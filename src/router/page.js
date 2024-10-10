import { createRouter, createWebHistory } from "vue-router";
import { useRoute } from "vue-router";
import { computed } from "vue";
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
import AccessDenied from "@/views/AccessDenied.vue";
import CollabView from "@/views/CollabView.vue";

const routes = [
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

      {
        path: ":id",
        name: "board-detail",
        component: BoardView,
        redirect: (to) => {
          return { name: "board-task", params: { id: to.params.id } }; // Redirect to tasks for this board
        },
      },
    ],
  },
  {
    path: "/board/:id/collab",
    name: "board-collab",
    component: CollabView,
  },
  {
    path: "/board/:id/task",
    name: "board-task",
    component: TaskView,
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
    // meta: { requireAuth: true },
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
  {
    path: "/access-denied",
    name: "access-denied",
    component: AccessDenied,
  },
  {
    path: "/:pathMatch(.*)*", // This will catch all undefined routes
    redirect: "/login", // Redirects to the login page
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _, next) => {
  const userStore = useUserStore();
  const boardStore = useBoardStore();
  const isAuthenticated = !!userStore.getIsLoggedIn;
  const boardId = to.params.id;

  userStore.initialize();

  const isPublicBoard = boardId
    ? await boardStore.isPublicBoard(boardId)
    : false;

  const isOwner = boardId
    ? await boardStore.isBoardOwnerByRoute(boardId, userStore.getUser.oid)
    : false;

  if (to.meta.requireAuth && !isAuthenticated && !isPublicBoard) {
    return next({ name: "login" });
  }

  if (!isOwner && to.name === "board-collab") {
    return next({ name: "board-task", params: { id: boardId } });
  }

  next();
});

export default router;
