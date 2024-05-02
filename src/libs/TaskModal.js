class TaskModal {
  constructor() {
    this.tasks = [];
  }

  addAllTasks(tasks) {
    tasks.forEach((task) => {
      this.addTask(task);
    });
  }

  addTask(task) {
    this.tasks.push({
      id: task.id,
      title: task.title,
      description: task.description,
      assignees: task.assignees,
      status: task.status,
      createdOn: task.createdOn,
      updatedOn: task.updatedOn,
    });
  }

  getTasksById(id) {
    return this.tasks.find((task) => task.id === id);
  }

  getTasks() {
    return this.tasks;
  }
}

export { TaskModal };
