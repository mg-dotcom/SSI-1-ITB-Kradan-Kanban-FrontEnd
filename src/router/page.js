import { createRouter, createWebHistory } from 'vue-router'
import { useRoute } from 'vue-router'
import { useUserToken } from '@/stores/UserStore'
import { computed } from 'vue'
import { useUserStore } from '@/stores/UserStore'
import { useStatusStore } from '@/stores/StatusStore'
import { useBoardStore } from '@/stores/BoardStore'
import { useCollabStore } from '@/stores/CollabStore'
import { useTaskStore } from '@/stores/TaskStore'
import TaskView from '../views/TaskView.vue'
import Detail from '../components/taskModal/Detail.vue'
import AddEditTask from '../components/taskModal/AddEditTask.vue'
import StatusView from '../views/StatusView.vue'
import AddEditStatusModal from '../components/statusModal/AddEditStatus.vue'
import Login from '../views/Login.vue'
import BoardView from '@/views/BoardView.vue'
import AddBoard from '@/components/boardModal/AddBoard.vue'
import AccessDenied from '@/views/AccessDenied.vue'
import CollabView from '@/views/CollabView.vue'
import { checkTokenExpiration } from '@/stores/UserStore'

const routes = [
    {
        path: '/board',
        name: 'board',
        component: BoardView,
        meta: { requireAuth: true },
        children: [
            {
                path: 'add',
                name: 'board-add',
                component: AddBoard
            },

            {
                path: ':id',
                name: 'board-detail',
                component: BoardView,
                redirect: (to) => {
                    return { name: 'board-task', params: { id: to.params.id } } // Redirect to tasks for this board
                }
            }
        ]
    },
    {
        path: '/board/:id/collab',
        name: 'board-collab',
        component: CollabView
    },
    {
        path: '/board/:id/task',
        name: 'board-task',
        component: TaskView,
        children: [
            {
                path: ':taskId', // No leading slash
                name: 'task-detail',
                component: Detail
            },
            {
                path: 'add', // No leading slash
                name: 'task-add',
                component: AddEditTask
            },
            {
                path: ':taskId/edit', // No leading slash
                name: 'task-edit',
                component: AddEditTask
            }
        ]
    },
    {
        path: '/board/:id/status',
        name: 'board-status',
        component: StatusView,
        // meta: { requireAuth: true },
        children: [
            {
                path: 'add', // No leading slash
                name: 'status-add',
                component: AddEditStatusModal
            },
            {
                path: ':statusId/edit', // No leading slash
                name: 'status-edit',
                component: AddEditStatusModal
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/access-denied',
        name: 'access-denied',
        component: AccessDenied
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login'
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach(async (to, _, next) => {
    const userStore = useUserStore()
    const boardStore = useBoardStore()
    const collabStore = useCollabStore()
    const taskStore = useTaskStore()
    const statusStore = useStatusStore()
    const isAuthenticated = !!userStore.getIsLoggedIn
    const boardId = to.params.id

    if (to.meta.requireAuth && !isAuthenticated && !isPublicBoard) {
        return next({ name: 'login' })
    }

    if (to.path.startsWith('/board')) {
        try {
            if (to.name === 'board') {
                await boardStore.loadBoards()
            }
            if (boardId) {
                await checkTokenExpiration(boardId)
                await boardStore.loadBoardById(boardId)
                await collabStore.loadCollab(boardId)
                await taskStore.loadTasks(boardId)
                await statusStore.loadStatuses(boardId)
            }
        } catch (error) {
            console.log('Cannot Access')
            console.error('Error loading board-related data:', error)
            // return next({ name: 'login' })
            return next({ name: 'access-denied' })
        }
    }

    if (
        ['task-add', 'task-edit', 'status-add', 'status-edit'].includes(to.name)
    ) {
        // Check if user has a token
        const userToken = useUserToken().value
        if (!userToken) {
            return next({ name: 'access-denied' })
        }

        // Check if the user is the board owner
        const boardOwner = await boardStore.checkIsOwner(boardId)
        if (boardOwner) {
            return next()
        }

        // Check if user has write access rights
        const collab = collabStore.findCollabBoardByOid(userStore.getUser?.oid)
        const hasAccessRight = collab?.accessRight === 'WRITE'
        if (!hasAccessRight) {
            return next({ name: 'access-denied' })
        }

        return next() // Proceed if all conditions are met
    }
    next()
})

export default router
