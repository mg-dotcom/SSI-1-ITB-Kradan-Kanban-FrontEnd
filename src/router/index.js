import { createRouter, createWebHistory } from "vue-router";
import TaskView from "../views/TaskView.vue";
import TaskDetail from "../views/Detail.vue";

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
          component: TaskDetail,
        },
      ],
    },
  ],
});

export default router;
