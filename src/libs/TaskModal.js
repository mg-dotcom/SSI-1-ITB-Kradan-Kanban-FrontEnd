class TaskModal{
    constructor(){
        this.tasks=[];
    }

    addAllTasks(tasks){
        tasks.forEach((task)=>{
            this.addTask(
                task.id,
                task.title,
                task.description,
                task.assignees,
                task.status,
                task.createdOn,
                task.updatedOn
            );
        })
    }

    addTask(id,title,description,assignees,status,createdOn,updatedOn){
        this.tasks.push({
            id:id,
            title:title,
            description:description,
            assignees:assignees,
            status:status,
            createdOn:createdOn,
            updatedOn:updatedOn
        })
    }

    getTasks(){
        return this.tasks;
    }
}

export {TaskModal}