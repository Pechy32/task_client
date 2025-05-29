import { useEffect, useState } from 'react';
import Card from './components/card/Card.js';
import { apiGet, apiPut } from './utils/api.js';
import './TaskIndex.css'

const TaskIndex = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await apiGet('/tasks');
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleUpdate = async (taskId, updatedFields) => {
    try {
      const updatedTask = await apiPut(`/tasks/${taskId}`, updatedFields);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
      );
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className="task-index">
      {tasks.map((task) => (
        <Card
          key={task._id}
          title={task.title}
          description={task.description}
          solver={task.solver}
          priority={task.priority}
          subtasks={task.subtasks}
          dueDate={task.dueDate}
          created={task.created}
          notes={task.notes}
          completition={task.completition}
          onUpdate={(fields) => handleUpdate(task._id, fields)}
        />
      ))}
    </div>
  );
};

export default TaskIndex;