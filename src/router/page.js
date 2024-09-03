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
import { useBoardStore } from "@/stores/BoardStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/board/:id",
    },
    {
      path: "/board",
      name: "board",
      component: BoardView,
      children: [
        {
          path: "add",
          name: "board-add",
          component: AddBoard,
        },
        {
          path: ":id",
          name: "board-task",
          component: TaskView,
          children: [
            {
              path: "task/add",
              name: "task-add",
              component: AddEditTask,
            },
            {
              path: "task/:task-id/edit",
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
              path: ":status-id/edit",
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
      path: "/:notfound(.*)",
      redirect: "/board",
    },
  ],
});

router.beforeEach(async (to, _, next) => {
  const userStore = useUserStore();
  const boardStore = useBoardStore();

  // โหลด board อย่างไม่ประสานกัน
  await boardStore.loadBoards();

  console.log(boardStore.getBoards);

  const isAuthenticated = !!userStore.getToken;

  if (to.path !== "/login" && !isAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    if (boardStore.getBoards.length === 0) {
      next("/board");
    } else {
      next(`/board/${boardStore.getBoards[0].id}`);
    }
  } else {
    next();
  }
});

export default router;
