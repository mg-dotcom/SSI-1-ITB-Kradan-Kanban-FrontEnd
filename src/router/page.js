import { createRouter, createWebHistory } from "vue-router";
import { useUserStore, useUserToken } from "@/stores/UserStore";
import TaskView from "../views/TaskView.vue";
import Detail from "../components/taskModal/Detail.vue";
import AddEditTask from "../components/taskModal/AddEditTask.vue";
import StatusView from "../views/StatusView.vue";
import AddEditStatusModal from "../components/statusModal/AddEditStatus.vue";
import Login from "../views/Login.vue";
import BoardView from "@/views/BoardView.vue";
import AddBoard from "@/components/boardModal/AddBoard.vue";

const routes = [
  {
    path: "/",
    redirect: "/board",
    meta: { requireAuth: true }, // Meta field for auth check
  },
  {
    path: "/board",
    name: "board",
    component: BoardView,
    meta: { requireAuth: true },
    children: [
      {
        path: "add",
        name: "board-add",
        component: AddBoard,
      },
    ],
  },
  {
    path: "/board/:id",
    name: "board-task",
    component: TaskView,
    meta: { requireAuth: true },
    children: [
      {
        path: "/task/:taskId",
        name: "task-detail",
        component: Detail,
      },
      {
        path: "/task/add",
        name: "task-add",
        component: AddEditTask,
      },
      {
        path: "/task/:taskId/edit",
        name: "task-edit",
        component: AddEditTask,
      },
    ],
  },
  {
    path: "/board/:id",
    name: "board-status",
    component: StatusView,
    meta: { requireAuth: true },
    children: [
      {
        path: "/status/add",
        name: "status-add",
        component: AddEditStatusModal,
      },
      {
        path: "/status/:statusId/edit",
        name: "status-edit",
        component: AddEditStatusModal,
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/:notFound(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, _, next) => {
  const userStore = useUserStore();
  const isAuthenticated = !!userStore.getIsLoggedIn;

  if (to.meta.requireAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
