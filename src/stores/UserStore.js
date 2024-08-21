// stores/UserStore.js

import { defineStore } from 'pinia'
import { fetchUser } from '../libs/FetchUser.js'
import { jwtDecode } from 'jwt-decode'

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
                    'http://localhost:8080/api/auth/login',
                    user
                )

                const decoded = jwtDecode(data.access_token)
                console.log(decoded.name)

                if (decoded) {
                  this.token = data;
                  this.user = decoded;
                  this.isLoggedIn = true;
                } else {
                  alert("Failed to login");
                }
            } catch (error) {
              console.log('error');
              
                throw new Error(error.message)
            }
        },
        async logout() {
            this.user = {}
            this.token = ''
            this.isLoggedIn = false
        }
    }
})
