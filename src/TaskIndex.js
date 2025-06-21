import { useEffect, useState } from 'react';
import Card from './components/card/Card.js';
import { apiGet, apiPut, apiPost, apiDelete } from './utils/api.js';
import './TaskIndex.css';
import { Button, Form } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import AddTaskModal from './components/card/modal/AddTaskModal.js';

const TaskIndex = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState(null);
  const [newTaskPriority, setNewTaskPriority] = useState('');
  const [newTaskSolver, setNewTaskSolver] = useState('');
  const [solvers, setSolvers] = useState([]);
  const [loadingSolversForNewTask, setLoadingSolversForNewTask] = useState(true);
  const [sortingOptions, setSortingOptions] = useState("DueDate");

  const fetchTasksWithSubtasks = async () => {
    setLoading(true);

    try {
      let url = '/tasks?parentTaskId=null';
      if (sortingOptions === "Priority") {
        url += '&sort=priority:desc,dueDate:asc,created:desc';
      } else if (sortingOptions === "DueDate") {
        url += '&sort=dueDate:asc,priority:desc,created:desc';
      }

      const tasksData = await apiGet(url);

      const tasksWithSubtasks = await Promise.all(
        tasksData.map(async (task) => {
          try {
            const subtasks = await apiGet(`/tasks?parentTaskId=${task._id}&sort=created:asc`);
            return { ...task, subtasks };
          } catch (subtaskErr) {
            console.error(`Failed to fetch subtasks for task ${task._id}:`, subtaskErr);
            return { ...task, subtasks: [] };
          }
        })
      );

      setTasks(tasksWithSubtasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksWithSubtasks();
  }, [sortingOptions]);

  useEffect(() => {
    const fetchSolvers = async () => {
      try {
        const data = await apiGet('/solvers');
        setSolvers(data);
      } catch (error) {
        console.error('Failed to fetch solvers:', error);
      } finally {
        setLoadingSolversForNewTask(false);
      }
    };

    fetchSolvers();
  }, []);

  const handleUpdate = async (taskId, updateData) => {
    try {
      if (updateData.subtask) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task._id === taskId) {
              return {
                ...task,
                subtasks: task.subtasks.map((subtask) =>
                  subtask._id === updateData.subtask._id ? updateData.subtask : subtask
                ),
              };
            }
            return task;
          })
        );
      } else if (updateData.deletedSubtaskId) { 
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task._id === updateData.parentTaskId) { 
              return {
                ...task,
                subtasks: task.subtasks.filter(
                  (subtask) => subtask._id !== updateData.deletedSubtaskId
                ),
              };
            }
            return task;
          })
        );
      } else {
        const updatedTaskFromServer = await apiPut(`/tasks/${taskId}`, updateData);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, ...updatedTaskFromServer } : task
          )
        );
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCreateSubtask = async (subtaskData) => {
  try {
    const newSubtask = await apiPost('/tasks', subtaskData);

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === subtaskData.parentTaskId
          ? { ...task, subtasks: [...task.subtasks, newSubtask] }
          : task
      )
    );
  } catch (error) {
    console.error('Failed to create subtask:', error);
    alert('Nepodařilo se vytvořit subtask.');
  }
};

  const handleDeleteTask = async (taskIdToDelete) => {
    try {
      await apiDelete(`/tasks/${taskIdToDelete}`);
      setTasks((prevTasks) => prevTasks.filter(task => task._id !== taskIdToDelete));
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Nepodařilo se smazat úkol.');
    }
  };

  const handleShowAddTaskModal = () => setShowAddTaskModal(true);
  const handleCloseAddTaskModal = () => setShowAddTaskModal(false);

  const handleCreateNewTask = async () => {
    if (newTaskTitle.trim() !== "" && newTaskTitle.length <= 50) {
      const newTaskData = {
        title: newTaskTitle,
        description: newTaskDescription,
        dueDate: newTaskDueDate,
        priority: newTaskPriority === "" ? null : newTaskPriority,
        solver: newTaskSolver === "" ? null : newTaskSolver,
      };

      try {
        await apiPost('/tasks', newTaskData);
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskDueDate(null);
        setNewTaskPriority('');
        setNewTaskSolver('');
        handleCloseAddTaskModal();
        fetchTasksWithSubtasks();
      } catch (error) {
        console.error('Failed to create task:', error);
        alert('Nepodařilo se vytvořit nový úkol.');
      }
    } else if (newTaskTitle.trim() === "") {
      alert('Název úkolu je povinný.');
    } else if (newTaskTitle.length > 50) {
      alert('Název úkolu může mít maximálně 50 znaků.');
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'left', marginTop: '10px' }}>

        <Button variant="primary" className="mb-3" onClick={handleShowAddTaskModal}>
          Add Task
        </Button>

        <Form.Group style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Form.Label style={{ margin: '10px' }}>Sort&nbsp;by:</Form.Label>
          <Form.Select
            value={sortingOptions || ""}
            onChange={(e) => {
              const newValue = e.target.value === "" ? null : e.target.value;
              setSortingOptions(newValue);
            }}
          >
            <option value="DueDate">Due Date</option>
            <option value="Priority">Priority</option>
          </Form.Select>
        </Form.Group>

      </div>

      <div className="task-index">
        <AddTaskModal
          show={showAddTaskModal}
          onHide={handleCloseAddTaskModal}
          onSubmit={handleCreateNewTask}
          title={newTaskTitle}
          description={newTaskDescription}
          dueDate={newTaskDueDate}
          priority={newTaskPriority}
          solver={newTaskSolver}
          solvers={solvers}
          loadingSolvers={loadingSolversForNewTask}
          onTitleChange={(e) => setNewTaskTitle(e.target.value)}
          onDescriptionChange={(e) => setNewTaskDescription(e.target.value)}
          onDueDateChange={(date) => setNewTaskDueDate(date)}
          onPriorityChange={(e) => setNewTaskPriority(e.target.value)}
          onSolverChange={(e) => setNewTaskSolver(e.target.value)}
        />

        {tasks.map((task) => (
          <Card
            key={task._id}
            _id={task._id}
            title={task.title}
            description={task.description}
            solver={task.solver}
            priority={task.priority}
            subtasks={task.subtasks}
            dueDate={task.dueDate}
            created={task.created}
            notes={task.notes}
            isCompleted={task.isCompleted}
            onUpdate={(fields) => handleUpdate(task._id, fields)}
            onCreateSubtask={handleCreateSubtask}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskIndex;