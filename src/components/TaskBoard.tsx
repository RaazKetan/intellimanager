import React, { useState } from 'react';
import { Task } from '../types/index';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  programId: string;
}

const TaskForm = ({ 
  task, 
  onSubmit, 
  onCancel,
  setTask
}: {
  task: Partial<Task>;
  onSubmit: () => void;
  onCancel: () => void;
  setTask: (task: Partial<Task>) => void;
}) => (
  <div className="mb-4 space-y-2">
    <input
      type="text"
      placeholder="Task Title"
      className="w-full p-2 border rounded"
      value={task.title || ''}
      onChange={(e) => setTask({ ...task, title: e.target.value })}
      autoFocus
    />
    <input
      type="text"
      placeholder="Description"
      className="w-full p-2 border rounded"
      value={task.description || ''}
      onChange={(e) => setTask({ ...task, description: e.target.value })}
    />
    <input
      type="text"
      placeholder="Assignee"
      className="w-full p-2 border rounded"
      value={task.assignee || ''}
      onChange={(e) => setTask({ ...task, assignee: e.target.value })}
    />
    <input
      type="date"
      className="w-full p-2 border rounded"
      value={task.dueDate || ''}
      onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
    />
    <select
      className="w-full p-2 border rounded"
      value={task.priority || 'Medium'}
      onChange={(e) => setTask({ ...task, priority: e.target.value as Task['priority'] })}
    >
      <option value="Low">Low Priority</option>
      <option value="Medium">Medium Priority</option>
      <option value="High">High Priority</option>
    </select>
    <div className="flex gap-2">
      <button
        onClick={onSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {task.id ? 'Update' : 'Save'}
      </button>
      <button
        onClick={onCancel}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  </div>
);

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, setTasks, programId }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({});

  const columns = {
    Todo: tasks.filter((task) => task.status === 'Todo'),
    'In Progress': tasks.filter((task) => task.status === 'In Progress'),
    Done: tasks.filter((task) => task.status === 'Done'),
  };

  const handleStatusChange = (taskId: string, newStatus: 'Todo' | 'In Progress' | 'Done') => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status: newStatus };
      }
      return task;
    });
    setTasks(updatedTasks);

    // Save to localStorage
    try {
      const savedData = localStorage.getItem('programManagementData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const programData = parsedData.programData || {};
        
        programData[programId] = {
          ...programData[programId],
          tasks: updatedTasks
        };

        localStorage.setItem('programManagementData', JSON.stringify({
          ...parsedData,
          programData
        }));
      }
    } catch (error) {
      console.error('Error saving task update to localStorage:', error);
    }
  };

  const handleAddTask = () => {
    if (!newTask.title) return;

    const task: Task = {
      id: Date.now().toString(),
      programId,
      title: newTask.title,
      description: newTask.description || '',
      status: 'Todo',
      assignee: newTask.assignee || '',
      dueDate: newTask.dueDate || '',
      priority: newTask.priority || 'Medium',
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    setNewTask({});
    setIsAddingTask(false);

    // Save to localStorage
    try {
      const savedData = localStorage.getItem('programManagementData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const programData = parsedData.programData || {};
        
        programData[programId] = {
          ...programData[programId],
          tasks: updatedTasks
        };

        localStorage.setItem('programManagementData', JSON.stringify({
          ...parsedData,
          programData
        }));
      }
    } catch (error) {
      console.error('Error saving new task to localStorage:', error);
    }
  };

  const handleUpdateTask = () => {
    if (!editingTask || !editingTask.title) return;

    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id ? editingTask : task
    );
    setTasks(updatedTasks);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <div className="bg-white p-3 rounded shadow mb-2">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium">{task.title}</h4>
          <p className="text-sm text-gray-600">{task.description}</p>
          {task.assignee && (
            <p className="text-sm text-gray-500 mt-1">
              Assignee: {task.assignee}
            </p>
          )}
          {task.dueDate && (
            <p className="text-sm text-gray-500">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditingTask(task)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteTask(task.id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <span className={`px-2 py-1 rounded ${
            task.priority === 'High'
              ? 'bg-red-100 text-red-800'
              : task.priority === 'Medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {task.priority}
          </span>
        </div>
        <div className="flex gap-2">
          {task.status !== 'Todo' && (
            <button
              onClick={() => handleStatusChange(
                task.id,
                task.status === 'Done' ? 'In Progress' : 'Todo'
              )}
              className="p-1 text-gray-600 hover:text-gray-800"
              title="Move Left"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {task.status !== 'Done' && (
            <button
              onClick={() => handleStatusChange(
                task.id,
                task.status === 'Todo' ? 'In Progress' : 'Done'
              )}
              className="p-1 text-gray-600 hover:text-gray-800"
              title="Move Right"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button
          onClick={() => setIsAddingTask(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>

      {isAddingTask && (
        <TaskForm
          task={newTask}
          setTask={setNewTask}
          onSubmit={handleAddTask}
          onCancel={() => {
            setIsAddingTask(false);
            setNewTask({});
          }}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          setTask={setEditingTask}
          onSubmit={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(columns).map(([columnId, columnTasks]) => (
          <div key={columnId} className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">{columnId}</h3>
            <div className="space-y-2 min-h-32">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;