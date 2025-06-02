import { useEffect, useState } from 'react';
import Card from './components/card/Card.js';
import { apiGet, apiPut, apiPost, apiDelete } from './utils/api.js';
import './TaskIndex.css';
import { Button, Modal, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

  const fetchTasksWithSubtasks = async () => {
    try {
      const tasksData = await apiGet('/tasks?parentTaskId=null');

      const tasksWithSubtasks = await Promise.all(
        tasksData.map(async (task) => {
          try {
            const subtasks = await apiGet(`/tasks?parentTaskId=${task._id}`);
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
  }, []);

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
      await apiPost('/tasks', subtaskData);
      fetchTasksWithSubtasks();
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
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'left', marginTop: '10px' }}>
        <Button variant="primary" className="mb-3" onClick={handleShowAddTaskModal}>
          Add Task
        </Button>
      </div>

      <div className="task-index">
        <Modal show={showAddTaskModal} onHide={handleCloseAddTaskModal}>
          <Modal.Header closeButton>
            <Modal.Title>Přidat nový úkol</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Název úkolu</Form.Label>
                <Form.Control
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  maxLength={50}
                  required
                />
                <Form.Text className="text-muted">Maximálně 50 znaků.</Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Popis</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Datum dokončení</Form.Label>
                <DatePicker
                  selected={newTaskDueDate}
                  onChange={(date) => setNewTaskDueDate(date)}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Vyberte datum"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Priorita</Form.Label>
                <Form.Select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                >
                  <option value="">Not Set</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Řešitel</Form.Label>
                {loadingSolversForNewTask ? (
                  <Form.Control readOnly defaultValue="Loading..." />
                ) : (
                  <Form.Select
                    value={newTaskSolver}
                    onChange={(e) => setNewTaskSolver(e.target.value)}
                  >
                    <option value="">Not Set</option>
                    {solvers.map((solver) => (
                      <option key={solver._id} value={solver._id}>
                        {solver.name}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddTaskModal}>
              Zrušit
            </Button>
            <Button variant="primary" onClick={handleCreateNewTask}>
              Přidat
            </Button>
          </Modal.Footer>
        </Modal>

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
            completition={task.completition}
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