'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Task } from '../types/task';

interface TaskFormProps {
    task?: Task | null;
    onSubmit: (task: Task) => void;
    onClose: () => void;
}

export default function TaskForm({ task, onSubmit, onClose }: TaskFormProps) {
    const [formData, setFormData] = useState<Partial<Task>>({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        completed: false,
    });

    useEffect(() => {
        if (task) {
            setFormData({
                ...task,
                dueDate: new Date(task.dueDate).toISOString().split('T')[0],
            });
        }
    }, [task]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData as Task);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-md"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{task ? 'Edit Task' : 'New Task'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full border rounded-lg p-2"
                            rows={3}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Due Date</label>
                        <input
                            type="date"
                            value={formData.dueDate ? new Date(formData.dueDate).toISOString().split("T")[0] : ""}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="w-full border rounded-lg p-2"
                            required
                        />

                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.completed}
                            onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                            className="rounded border-gray-300"
                        />
                        <label className="text-sm font-medium">Mark as completed</label>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#1D1616] text-white py-2 rounded-lg hover:bg-black transition-colors"
                    >
                        {task ? 'Update Task' : 'Create Task'}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}