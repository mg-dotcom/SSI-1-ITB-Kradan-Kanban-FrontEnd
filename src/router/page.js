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
import { useBoardStore } from "@/stores/BoardStore";
import { useTaskStore } from "@/stores/TaskStore";
import { handleAuthenticationClearAndRedirect } from "@/libs/libsUtil";

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
        path: "add", // No leading slash
        name: "board-add",
        component: AddBoard,
      },
      {
        path: ":id", // No leading slash
        name: "board-detail",
        component: BoardView,
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
        path: ":taskId", // No leading slash
        name: "task-detail",
        component: Detail,
      },
      {
        path: "add", // No leading slash
        name: "task-add",
        component: AddEditTask,
      },
      {
        path: ":taskId/edit", // No leading slash
        name: "task-edit",
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
        path: "add", // No leading slash
        name: "status-add",
        component: AddEditStatusModal,
      },
      {
        path: ":statusId/edit", // No leading slash
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
  // {
  //   path: "/:notFound(.*)",
  //   redirect: "/board",
  // },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _, next) => {
  const userStore = useUserStore();
  const isAuthenticated = !!userStore.getIsLoggedIn;

  if (to.meta.requireAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }

  if (to.name === "board-detail" || to.name === "board-task") {
    const boardStore = useBoardStore();
    await boardStore.loadBoards();
    const boardExists = await boardStore.loadBoardById(to.params.id);

    if (!boardExists) {
      handleAuthenticationClearAndRedirect();
      next("/login");
    }
  }

  if (
    to.name === "task-detail" ||
    to.name === "task-edit" ||
    to.params.taskId
  ) {
    const boardStore = useBoardStore();
    await boardStore.loadBoards();
    const boardExists = await boardStore.loadBoardById(to.params.id);
    const taskStore = useTaskStore();
    const taskExists = await taskStore.loadTaskById(to.params.taskId);

    if (!taskExists || !boardExists) {
      handleAuthenticationClearAndRedirect();
      next("/login");
    }
  }
});

export default router;
