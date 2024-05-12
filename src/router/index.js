import { createRouter, createWebHistory } from 'vue-router'
import TaskView from '../views/TaskView.vue'
import Detail from '../components/taskModal/Detail.vue'
import AddEditTask from '../components/taskModal/AddEditTask.vue'
import Status from '../views/StatusView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/task'
    },
    {
      path: '/task',
      name: 'task',
      component: TaskView,
      children: [
        {
          path: ':id',
          name: 'task-detail',
          component: Detail
        },
        {
          path: ':id/edit',
          name: 'task-edit',
          component: AddEditTask
        },
        {
          path: 'add',
          name: 'task-add',
          component: AddEditTask
        }
      ]
    },
    {
      path: '/status',
      name: 'status',
      component: Status,
      children: [
        {
          path: 'add',
          name: 'status-add',
          component: AddEditTask
        },
        {
          path: ':id/edit',
          name: 'status-edit',
          component: AddEditTask
        }
      ]
    },

    {
      path: '/:catchAll(.*)',
      redirect: '/task'
    }
  ]
})

export default router
