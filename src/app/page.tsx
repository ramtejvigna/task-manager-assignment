'use client';
import { useState, useEffect } from 'react';
import { Plus, Loader2, Check, X, Pencil, Trash, Calendar, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import TaskForm from './components/TaskForm';
import { Task } from './types/task';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'incomplete' | 'completed'>('incomplete');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 3;
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAction = async (task: Task, action: 'create' | 'update' | 'delete') => {
    setLoading(true);
    try {
      let response;
      if (action === 'create') {
        response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
        toast({
          title: "Success",
          description: "Task created successfully!",
        });
      } else if (action === 'update') {
        response = await fetch(`/api/tasks/${task._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
        toast({
          title: "Success",
          description: task.completed ? "Task marked as complete!" : "Task updated successfully!",
        });
      } else {
        response = await fetch(`/api/tasks/${task._id}`, {
          method: 'DELETE',
        });
        toast({
          title: "Success",
          description: "Task deleted successfully!",
        });
      }
      
      if (!response.ok) throw new Error('Task action failed');
      await fetchTasks();
      setShowForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Task action failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${action} task. Please try again.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => 
    activeTab === 'completed' ? task.completed : !task.completed
  );

  const incompleteTasks = tasks.filter(task => !task.completed);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  const EmptyState = () => (
    <div className="text-center py-12 px-4 animate-fadeIn">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <ClipboardList className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No tasks found</h3>
      <p className="text-gray-600 mb-6">
        {activeTab === 'incomplete' 
          ? "You're all caught up! Add a new task to get started."
          : "You haven't completed any tasks yet. Keep going!"}
      </p>
      {activeTab === 'incomplete' && (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-[#1D1616] text-white rounded-lg
          hover:bg-[#2D2626] transition-colors duration-300 gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Your First Task
        </button>
      )}
    </div>
  );

  const Pagination = () => (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 
        disabled:cursor-not-allowed transition-colors duration-300"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => setCurrentPage(i + 1)}
          className={`w-7 h-7 text-sm rounded-lg transition-all duration-300 ${
            currentPage === i + 1
              ? 'bg-[#1D1616] text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 
        disabled:cursor-not-allowed transition-colors duration-300"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFBFB] p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black animate-fadeIn">
            Task Manager
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#1D1616] text-white px-6 py-3 rounded-xl 
            flex items-center gap-2 transition-all duration-300 
            shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Plus className="animate-pulse" size={20} />
            Add Task
          </button>
        </header>

        <div className="flex gap-4 mb-6">
          <div className="relative">
            <button
              onClick={() => setActiveTab('incomplete')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'incomplete'
                  ? 'bg-[#1D1616] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Incomplete
            </button>
            {incompleteTasks.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white 
              text-xs px-2 py-1 rounded-full">
                {incompleteTasks.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'completed'
                ? 'bg-[#1D1616] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-blue-500" size={48} />
          </div>
        ) : (
          <>
            {filteredTasks.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-4">
                {paginatedTasks.map((task, index) => (
                  <div
                    key={task._id}
                    className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg 
                    transition-all duration-300 transform hover:-translate-y-1 
                    border border-transparent hover:border-blue-100 animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => handleTaskAction({ ...task, completed: !task.completed }, 'update')}
                          className={`rounded-full p-3 transition-colors duration-300 ${
                            task.completed 
                              ? 'bg-green-100 text-green-500 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {task.completed ? (
                            <Check size={24} className="transform scale-110 transition-transform" />
                          ) : (
                            <X size={24} />
                          )}
                        </button>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {task.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar size={16} />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setShowForm(true);
                          }}
                          className="p-2 hover:bg-blue-50 text-blue-500 rounded-full transition-colors"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => handleTaskAction(task, 'delete')}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                        >
                          <Trash size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {filteredTasks.length > tasksPerPage && <Pagination />}
          </>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center 
          backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-lg 
            transform transition-all duration-300 scale-100 animate-slideIn">
              <TaskForm
                task={editingTask}
                onSubmit={(task) => handleTaskAction(task, editingTask ? 'update' : 'create')}
                onClose={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}