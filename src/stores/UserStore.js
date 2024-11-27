import { defineStore } from 'pinia'
import {
    fetchUser,
    fetchToken,
    fetchLoginWithMicrosoft,
    fetchMicrosoftGraphUser
} from '../libs/FetchUser.js'
import { useBoardStore } from './BoardStore.js'
import { useRoute, useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import MsConfig from '../libs/msalConfig.js'
import { CookieUtil } from '../libs/CookieUtil.js'
import { computed, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import * as msal from '@azure/msal-browser'
import { handleAuthenticationClearAndRedirect } from '@/libs/libsUtil.js'

const USER_ENDPOINT = import.meta.env.VITE_USER_ENDPOINT
const USER_AZURE_ENDPOINT = import.meta.env.VITE_USER_AZURE_ENDPOINT
const REDIRECT_URI = import.meta.env.VITE_AZURE_REDIRECT_URI
const msalInstance = new msal.PublicClientApplication(MsConfig)

export const useUserStore = defineStore('UserStore', {
    state: () => ({
        user: {},
        userStore: useUserStore(),
        toast: useToast(),
        boardStore: useBoardStore(),
        token: CookieUtil.get('access_token') || '',
        refreshToken: CookieUtil.get('refresh_token') || '',
        isLoggedIn: !!CookieUtil.get('access_token'),
        redirectAfterLogin: '',
        authMethod: CookieUtil.get('authMethod'),
        microsoftAccessToken:""
    }),
    getters: {
        getUser() {
            return this.user
        },
        getToken() {
            return this.token
        },
        getIsLoggedIn() {
            return this.isLoggedIn
        },
        getRedirectAfterLogin() {
            return this.redirectAfterLogin
        }
    },
    actions: {
        setAuthMethod(method) {
            this.authMethod = method
            CookieUtil.set('authMethod', method) // Set it in the cookie as well
        },
        async login(user) {
            try {
                const data = await fetchUser(
                    `${import.meta.env.VITE_BASE_URL}${USER_ENDPOINT}`,
                    user
                )
                // initialize()

                this.setAuthMethod('local')

                // 30 minutes from now
                const decoded = jwtDecode(data.access_token)
                this.token = data.access_token
                this.refreshToken = data.refresh_token

                if (decoded) {
                    this.user = decoded
                    this.isLoggedIn = true

                    // Set the access token in a cookie with a 30-min expiration
                    const expires = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
                    const refreshToken = new Date(
                        Date.now() + 24 * 60 * 60 * 1000
                    ) // 24hours from now
                    CookieUtil.set('access_token', this.token, expires)
                    CookieUtil.set(
                        'refresh_token',
                        data.refresh_token,
                        refreshToken
                    )
                } else {
                    alert('Failed to login')
                }
            } catch (error) {
                throw new Error(error.message)
            }
        },

        async fetchGraphUserByEmail(userEmail) {
            try {
              // Check if Microsoft access token is already available
              if (!this.microsoftAccessToken) {
                // Acquire a new token if not present
                const loginResponse = await msalInstance.acquireTokenSilent({
                  scopes: ['User.ReadBasic.All'], // Ensure correct scope
                });
                this.microsoftAccessToken = loginResponse.accessToken;
              }
        
              // Fetch the user using the access token
              const userData = await fetchMicrosoftGraphUser(
                this.microsoftAccessToken,
                userEmail
              );
        
              console.log('Fetched Microsoft Graph user data:', userData);
              return userData;
            } catch (error) {
              console.error('Error fetching Microsoft Graph user:', error.message);
              this.toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch user from Microsoft Graph.',
              });
              throw error; // Re-throw to handle in the calling function if needed
            }
          },

        async initializeMsal() {
            try {
                await msalInstance.initialize()
                console.log('MSAL initialized successfully.')
            } catch (error) {
                this.toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to initialize MSAL'
                })
            }
        },

        async loginWithMicrosoft() {
            try {
                const loginResponse = await msalInstance.loginPopup({
                    scopes: ['User.ReadBasic.All']
                })
                
                this.microsoftAccessToken = loginResponse.accessToken
                console.log("loginRes : ",this.microsoftAccessToken);
                const res = await fetchLoginWithMicrosoft(
                    `${import.meta.env.VITE_BASE_URL}${USER_AZURE_ENDPOINT}`,
                    loginResponse.accessToken
                )

                this.setAuthMethod('microsoft')
                
                const loginMSData = await res.json()
                
                
                this.token = loginMSData.access_token
                this.refreshToken = loginMSData.refresh_token

                const decoded = jwtDecode(loginMSData.access_token)
                if (decoded) {
                    this.user = decoded
                    this.isLoggedIn = true

                    const expires = new Date(Date.now() + 30 * 60 * 1000) // 30 minuts from now
                    const refreshToken = new Date(
                        Date.now() + 24 * 60 * 60 * 1000
                    ) // 24hours from now
                    CookieUtil.set('access_token', this.token, expires)
                    CookieUtil.set(
                        'refresh_token',
                        loginMSData.refresh_token,
                        refreshToken
                    )
                } else {
                    alert('Failed to login with Microsoft')
                }
            } catch (error) {
                throw new Error(error.message)
            }
        },
        clearAllCookies() {
            const cookies = document.cookie.split(';')

            cookies.forEach((cookie) => {
                const cookieName = cookie.split('=')[0].trim()
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
            })
        },

        logout() {
            this.user = {}
            this.token = ''
            this.refreshToken = ''
            this.isLoggedIn = false
            this.authMethod = ''

            // Remove the access token cookie when logging out
            CookieUtil.unset('access_token')
            CookieUtil.unset('refresh_token')
            CookieUtil.unset('authMethod')
        },

        async logoutWithMicrosoft() {
            this.user = {}
            this.token = ''
            this.refreshToken = ''
            this.isLoggedIn = false
            CookieUtil.unset('authMethod')
            CookieUtil.unset('access_token')
            CookieUtil.unset('refresh_token')
            // Redirect to Microsoft logout endpoint
            const postLogoutRedirectUri = encodeURIComponent(REDIRECT_URI) // Your app's redirect URL
            const logoutUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${postLogoutRedirectUri}`
            window.location.href = logoutUrl
        },

        async initialize() {
            // Check if the token exists in the cookie during initialization

            const token = CookieUtil.get('access_token')
            if (token) {
                this.token = token
                const decoded = jwtDecode(token)

                this.user = decoded
                this.isLoggedIn = true
            }
        },

        setRedirectAfterLogin(redirectName) {
            this.redirectAfterLogin = redirectName
        }
    },
    checkPermission() {}
})

export const useUserToken = () => {
    const userStore = useUserStore()

    // Create a computed property for the token
    const token = computed(() => CookieUtil.get('access_token') || null)

    // Watch for changes to the cookie and update the store if necessary
    watch(token, (newToken) => {
        userStore.token = newToken
    })

    return token
}

let isCheckingToken = false // Initialize at top of the file

export const checkTokenExpiration = async (boardId) => {
    if (isCheckingToken) return // If already checking, exit early
    isCheckingToken = true // Set flag to prevent re-entry

    const userStore = useUserStore()
    const boardStore = useBoardStore()
    const router = useRouter()

    const isPublicBoard = boardId
        ? await boardStore.isPublicBoard(boardId)
        : false

    if (!userStore.token) {
        if (isPublicBoard) {
            isCheckingToken = false // Reset the flag
            return
        } else {
            router.push({ name: 'access-denied' })
            isCheckingToken = false // Reset the flag
            return
        }
    }

    const decoded = jwtDecode(CookieUtil.get('access_token'))
    const decodedRft = jwtDecode(CookieUtil.get('refresh_token'))

    if (decoded.exp < Date.now() / 1000 && decodedRft.exp > Date.now() / 1000) {
        // Token has expired; try to refresh it

        try {
            const data = await fetchToken(
                `${import.meta.env.VITE_BASE_URL}token`
            )
            // console.log(data)

            const expires = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
            CookieUtil.set('access_token', data.access_token, expires)
            userStore.token = data.access_token

            isCheckingToken = false // Reset flag after successful refresh
            return data.access_token
        } catch {
            userStore.logout()
            isCheckingToken = false // Reset flag on failure
        }
    } else if (decodedRft && decodedRft.exp < Date.now() / 1000) {
        // userStore.$reset()
        userStore.logout()
    } else {
        isCheckingToken = false // Reset flag if token is still valid
        return userStore.token // Token is still valid
    }
}
