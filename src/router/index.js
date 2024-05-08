import { createRouter, createWebHistory } from "vue-router";
import TaskView from "../views/TaskView.vue";
import Detail from "../components/taskModal/Detail.vue";
import AddEditModal from "../components/taskModal/AddEditModal.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/task",
    },
    {
      path: "/task",
      name: "task",
      component: TaskView,
      children: [
        {
          path: "/task/:id",
          name: "task-detail",
          component: Detail,
        },
        {
          path: "/task/:id/edit",
          name: "task-edit",
          component: AddEditModal,
        },
        {
          path: "/task/add",
          name: "task-add",
          component: AddEditModal,
        },
      ],
    },
    {
      path: "/:notfound(.*)",
      redirect: "/task",
    },
  ],
});

export default router;
