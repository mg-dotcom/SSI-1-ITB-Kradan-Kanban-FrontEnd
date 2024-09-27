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
import { CookieUtil } from "@/libs/CookieUtil";
import { useStatusStore } from "@/stores/StatusStore";
import AccessDenied from "@/views/AccessDenied.vue";

const routes = [
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

  const boardStore = useBoardStore();
  const userStore = useUserStore();
  const token = userStore.token;
  //board visibility public
  if(boardStore.visibility&&token){
    console.log('public');
    if (to.params.id) {
      await boardStore.loadBoardById(to.params.id);
    }
  }
  //board visibility private
  else{
    const token = userStore.token;
    //if user access board-task without login or board-status without login
    if(to.name == "board-task" && !token || to.name == "board-status" && !token || to.name =="task-detail" && !token){
      return next("/access-denied");
    }
    //and owner can do any action in the board
}

next();
});

export default router;



  // const userStore = useUserStore();
  // const token = useUserToken().value;
  // const isAuthenticated = !!userStore.getIsLoggedIn;

  // if (to.meta.requireAuth && !isAuthenticated) {
  //   console.log('not authenticated');
    
  //   return next("/login");
  // } else {
  //   console.log('authenticated');
    
  //   next();
  // }

  // const boardStore = useBoardStore();

  // if (to.params.id) {
  //   await boardStore.loadBoardById(to.params.id);
  // }
