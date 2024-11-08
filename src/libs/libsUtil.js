import { ref } from 'vue'
import router from '@/router/page.js'
import { useUserStore } from '@/stores/UserStore'
import { CookieUtil } from './CookieUtil'

const localTimeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)

const formatDate = (date) => {
    const d = new Date(date)
    return d.toLocaleString('en-GB', { timeZone: localTimeZone.value })
}

const sortTasks = (tasks, sortType) => {
    if (sortType === 'ascending') {
        tasks.sort((a, b) => a.status.localeCompare(b.status))
    } else if (sortType === 'descending') {
        tasks.sort((a, b) => b.status.localeCompare(a.status))
    }
}

export function handleResponseStatus(res) {
    console.log(!CookieUtil.get('refresh_token'))

    if (
        (!CookieUtil.get('access_token') && res.status === 401) ||
        res.status === 404
    ) {
        console.log('2222222')

        const userStore = useUserStore()
        // userStore.$reset()
        userStore.logout()
        alert('Session expired. Please login again.')
        router.push({ name: 'login' })
    } else if (res.status === 403) {
        console.log('3333333')
        const userStore = useUserStore()
        userStore.logout()
        router.push({ name: 'access-denied' })
    } else if (!CookieUtil.get('refresh_token') && res.status >= 400) {
        this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred',
            life: 3000
        })
    }
}
export const handleAuthenticationClearAndRedirect = () => {
    const userStore = useUserStore()
    userStore.$reset()
    alert('Session expired. Please login again.')
    router.push({ name: 'login' })
}

export { formatDate, localTimeZone, sortTasks }
