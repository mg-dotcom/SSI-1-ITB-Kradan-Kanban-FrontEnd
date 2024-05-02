import { createRouter, createWebHistory } from "vue-router";
import TaskView from "../views/TaskView.vue";

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
          component: TaskView,
        },
        {
          path: "/task/:id/edit",
          name: "task-edit",
          component: TaskView,
        },
        {
          path: "/task/add",
          name: "task-add",
          component: TaskView,
        },
        {
          path: "/task/:id/edit",
          name: "task-edit",
          component: TaskView,
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
