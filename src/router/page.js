import { createRouter, createWebHistory } from "vue-router";
import TaskView from "../views/TaskView.vue";
import Detail from "../components/taskModal/Detail.vue";
import AddEditTask from "../components/taskModal/AddEditTask.vue";
import StatusView from "../views/StatusView.vue";
import AddEditStatusModal from "../components/statusModal/AddEditStatusModal.vue";
import Login from "../views/Login.vue";
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
  ],
});

export default router;
