// stores/UserStore.js

import { defineStore } from 'pinia'
import { fetchUser } from '../libs/FetchUser.js'
import { jwtDecode } from 'jwt-decode'
import { CookieUtil } from'../libs/CookieUtil.js' // Import your CookieUtil class

export const useUserStore = defineStore('UserStore', {
    state: () => ({
        user: {},
        token: '',
        isLoggedIn: false
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
        }
    },
    actions: {
        async login(user) {
            try {
                const data = await fetchUser(
                    'http://localhost:8080/login',
                    user
                )

                const decoded = jwtDecode(data.access_token)

                if (decoded) {
                    this.token = data.access_token
                    this.user = decoded
                    this.isLoggedIn = true

                    // Set the access token in a cookie with a 30-minute expiration
                    const expires = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
                    CookieUtil.set('access_token', this.token, expires)
                    
                } else {
                    alert('Failed to login')
                }
            } catch (error) {
                console.log('error')

                throw new Error(error.message)
            }
        },
        async logout() {
            this.user = {}
            this.token = ''
            this.isLoggedIn = false

            // Remove the access token cookie when logging out
            CookieUtil.unset('access_token')
        }
    }
})
