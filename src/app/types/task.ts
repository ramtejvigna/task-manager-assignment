export interface Task {
    _id: string;
    title: string;
    description: string;
    dueDate: string | Date;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
  }