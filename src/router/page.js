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
import AccessDenied from "@/views/AccessDenied.vue";

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
        path: ":id/task",
        name: "board-task",
        component: TaskView,
        children: [
          {
            path: ":taskId",
            name: "task-detail",
            component: Detail,
          },
          {
            path: "add",
            name: "task-add",
            component: AddEditTask,
          },
          {
            path: ":taskId/edit",
            name: "task-edit",
            component: AddEditTask,
          },
        ],
      },
      {
        path: ":id/status",
        name: "board-status",
        component: StatusView,
        children: [
          {
            path: "add",
            name: "status-add",
            component: AddEditStatusModal,
          },
          {
            path: ":statusId/edit",
            name: "status-edit",
            component: AddEditStatusModal,
          },
        ],
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
    path: "/:pathMatch(.*)*", // Catch all undefined routes
    redirect: "/login", // Redirect to the login page
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _, next) => {
  const userStore = useUserStore();
  const boardStore = useBoardStore();
  const token = useUserToken().value;
  const isAuthenticated = !!userStore.getIsLoggedIn;

  const boardId = to.params.id;

  // Check if the board is public
  const isPublicBoard = boardId
    ? await boardStore.isPublicBoard(boardId)
    : false;

  console.log(isPublicBoard);

  if (to.meta.requireAuth && !isAuthenticated && !isPublicBoard) {
    console.log("User is not authenticated");
    next({ name: "login" });
  } else {
    console.log("User is not authenticated");
    next();
  }
});

export default router;
