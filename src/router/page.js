import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import TaskView from "../views/TaskView.vue";
import Detail from "../components/taskModal/Detail.vue";
import AddEditTask from "../components/taskModal/AddEditTask.vue";
import StatusView from "../views/StatusView.vue";
import AddEditStatusModal from "../components/statusModal/AddEditStatus.vue";
import Login from "../views/Login.vue";
import BoardView from "@/views/BoardView.vue";
import AddBoard from "@/components/boardModal/AddBoard.vue";
import { CookieUtil } from "@/libs/CookieUtil";
import { jwtDecode } from "jwt-decode";

const routes = [
  {
    path: "/",
    redirect: "/board",
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
        meta: { requireAuth: true },
        component: AddBoard,
      },
    ],
  },
  {
    path: "/board/:id/task",
    name: "board-task",
    component: TaskView,
    meta: { requireAuth: true },
    children: [
      {
        path: ":taskId",
        name: "task-detail",
        meta: { requireAuth: true },
        component: Detail,
      },
      {
        path: "add",
        name: "task-add",
        meta: { requireAuth: true },
        component: AddEditTask,
      },
      {
        path: ":taskId/edit",
        name: "task-edit",
        meta: { requireAuth: true },
        component: AddEditTask,
      },
    ],
  },
  {
    path: "/board/:id/status",
    name: "board-status",
    component: StatusView,
    meta: { requireAuth: true },
    children: [
      {
        path: "add",
        name: "status-add",
        meta: { requireAuth: true },
        component: AddEditStatusModal,
      },
      {
        path: ":statusId/edit",
        name: "status-edit",
        meta: { requireAuth: true },
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
    path: "/:notfound(.*)",
    redirect: "/board",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Set up navigation guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const oldToken = userStore.getToken; // Retrieve the token from the store (Pinia or Vuex)
  const newToken = CookieUtil.get("access_token"); // Retrieve the token from the cookie

  if (newToken) {
    const decodedToken = jwtDecode(newToken);
    const isTokenExpired = CookieUtil.isExpired(decodedToken.exp);

    if (isTokenExpired || oldToken !== newToken || !oldToken || !decodedToken) {
      userStore.logout();
      CookieUtil.unset("access_token");
      next("/login");
    } else {
      next();
    }
  } else {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      next("/login");
    } else {
      next();
    }
  }
});

export default router;
