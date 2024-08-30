import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import TaskView from "../views/TaskView.vue";
import Detail from "../components/taskModal/Detail.vue";
import AddEditTask from "../components/taskModal/AddEditTask.vue";
import StatusView from "../views/StatusView.vue";
import AddEditStatusModal from "../components/statusModal/AddEditStatus.vue";
import Login from "../views/Login.vue";
import BoardView from "@/views/BoardView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/task",
      name: "task",
      component: TaskView,
      children: [
        {
          path: ":id",
          name: "task-detail",
          component: Detail,
        },
        {
          path: "add",
          name: "task-add",
          component: AddEditTask,
        },
        {
          path: ":id/edit",
          name: "task-edit",
          component: AddEditTask,
        },
      ],
    },
    {
      path: "/status",
      name: "status",
      component: StatusView,
      children: [
        {
          path: "add",
          name: "status-add",
          component: AddEditStatusModal,
        },
        {
          path: ":id/edit",
          name: "status-edit",
          component: AddEditStatusModal,
        },
      ],
    },
    {
      path: "/:notfound(.*)",
      redirect: "/task",
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/board",
      name: "board",
      component: BoardView,
    },
  ],
});

// router.beforeEach((to,_,next) => {
//   const userStore = useUserStore();
//   const isAuthenticated = !!userStore.getToken;

//   if (to.path !== '/login' && !isAuthenticated) {
//     next('/login');
//   } else if (to.path === '/login' && isAuthenticated) {
//     next('/task');
//   } else {
//     next();
//   }
// });
export default router;
