import mongoose, { Schema } from 'mongoose';

export interface ITask {
    _id?: string;
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);