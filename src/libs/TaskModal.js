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
      status: task.statusName,
      createdOn: task.createdOn,
      updatedOn: task.updatedOn,
    });
  }

  removeTask(index) {
    this.tasks.splice(index, 1);
  }

  editTask(id, updatedTask) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      return this.tasks[index];
    } else {
      return null; 
    }
  }

  getTasksById(id) {
    return this.tasks.find((task) => task.id === id);
  }

  getTasks() {
    return this.tasks;
  }
}

export { TaskModal };
