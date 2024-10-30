import { createRouter, createWebHistory } from "vue-router";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useUserStore } from "@/stores/UserStore";
import { useStatusStore } from "@/stores/StatusStore";
import { useBoardStore } from "@/stores/BoardStore";
import { useCollabStore } from "@/stores/CollabStore";
import { useTaskStore } from "@/stores/TaskStore";
import TaskView from "../views/TaskView.vue";
import Detail from "../components/taskModal/Detail.vue";
import AddEditTask from "../components/taskModal/AddEditTask.vue";
import StatusView from "../views/StatusView.vue";
import AddEditStatusModal from "../components/statusModal/AddEditStatus.vue";
import Login from "../views/Login.vue";
import BoardView from "@/views/BoardView.vue";
import AddBoard from "@/components/boardModal/AddBoard.vue";
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
  const collabStore = useCollabStore();
  const taskStore = useTaskStore();
  const statusStore = useStatusStore();
  const isAuthenticated = !!userStore.getIsLoggedIn;
  const boardId = to.params.id;
  
  // Log the boardId to see if it is being set correctly
  console.log("Board ID in beforeEach:", boardId);

  // Check if we can determine if the board is public
  const isPublicBoard = boardId ? await boardStore.isPublicBoard(boardId) : false;

  // Log the public board status after the check
  console.log("isPublicBoard in beforeEach after calling store:", isPublicBoard);
    
  // Authentication check: allow access to public boards even if not authenticated
  if (to.meta.requireAuth && !isAuthenticated && !isPublicBoard) {
    return next({ name: "login" });
  }

  // Load data for board routes
  if (to.path.startsWith("/board")) {
    try {
      if (to.name === "board") {
        await boardStore.loadBoards(); // Load the boards list
      }
      if (boardId) {
        await boardStore.loadBoardById(boardId); // Load specific board data
        await collabStore.loadCollab(boardId); // Load collaborators
        await taskStore.loadTasks(boardId); // Load tasks
        await statusStore.loadStatuses(boardId); // Load statuses
      }
    } catch (error) {
      console.error("Error loading board-related data:", error);
    }
  }

  // Permission check for task and status modifications
  if (
    ["task-add", "task-edit", "status-add", "status-edit"].includes(to.name)
  ) {
    const boardOwner = await boardStore.checkIsOwner(boardId);
    if (boardOwner) {
      return next();
    }

    const hasAccessRight = computed(() => {
      const collab = collabStore.findCollabBoardByOid(userStore.getUser?.oid);
      return collab?.accessRight === "WRITE";
    });

    if (!hasAccessRight.value) {
      return next({ name: "access-denied" });
    }
  }

  next();
});

export default router;
