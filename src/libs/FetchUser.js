import { handleResponseStatus } from './libsUtil.js'
import { useUserStore } from '@/stores/UserStore'
import { useToast } from 'primevue/usetoast'

const fetchUser = async (url, userLogin) => {
    const res = await fetch(`${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userName: userLogin.username,
            password: userLogin.password
        })
    })

    handleResponseStatus(res)
    const data = await res.json()
    return data
}

const fetchToken = async (url) => {
    const res = await fetch(`${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${useUserStore().refreshToken}`
        }
    })

    handleResponseStatus(res)
    const data = await res.json()
    return data
}

export { fetchUser, fetchToken }
