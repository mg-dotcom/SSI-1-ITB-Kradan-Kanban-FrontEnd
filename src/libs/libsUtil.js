import { ref } from 'vue'
import router from '@/router/page.js'
import { useUserStore } from '@/stores/UserStore'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { useBoardStore } from '@/stores/BoardStore.js'

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
    if (res.status === 401 || res.status === 404) {
        const userStore = useUserStore()
        userStore.$reset()
        alert('Session expired. Please login again.')
        router.push({ name: 'login' })
    } else if (res.status === 403) {
        const userStore = useUserStore()
        userStore.$reset()
        router.push({ name: 'access-denied' })
    } else if (res.status >= 400) {
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

let isCheckingToken = false // Initialize at top of the file
export const checkTokenExpirationTest = async (boardId, res) => {
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

    const decoded = jwtDecode(userStore.token)
    //30sec
    if (decoded.exp < Date.now() / 1000 + 30 && res.status === 401) {
        console.log(decoded.exp)

        // Token has expired; try to refresh it
        try {
            const data = await fetchToken(
                `${import.meta.env.VITE_BASE_URL}token`
            )
            const expires = new Date(Date.now() + 30 * 1000) // 30 sec from now
            CookieUtil.set('access_token', data.access_token, expires)
            userStore.token = data.access_token
            isCheckingToken = false // Reset flag after successful refresh
            return data.access_token
        } catch {
            userStore.logout()
            router.push({ name: 'login' })
            isCheckingToken = false // Reset flag on failure
        }
    } else if (res.status === 401 || res.status === 404) {
        console.log('bitcj')
        const userStore = useUserStore()
        // userStore.$reset()
        userStore.logout()
        alert('Session expired. Please login again.')
        router.push({ name: 'login' })
    } else if (res.status === 403) {
        const userStore = useUserStore()
        userStore.$reset()
        router.push({ name: 'access-denied' })
    } else if (res.status >= 400) {
        this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred',
            life: 3000
        })
    } else {
        isCheckingToken = false // Reset flag if token is still valid
    }
}
export { formatDate, localTimeZone, sortTasks }
