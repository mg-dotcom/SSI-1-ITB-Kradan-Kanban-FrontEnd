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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/board",
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
          name: "board-detail",
          component: TaskView,
          children: [
            {
              path: "",
              name: "task-list",
              component: TaskView,
            },
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

router.beforeEach((to, _, next) => {
  const userStore = useUserStore();
  const isAuthenticated = !!userStore.getToken;

  console.log("Token:", userStore.getToken); // Debugging line
  console.log("Is Authenticated:", isAuthenticated); // Debugging line

  if (to.path !== "/login" && !isAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    next("/board");
  } else {
    next();
  }
});

export default router;
