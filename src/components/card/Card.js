import { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './card.css';
import { formatToCET } from '../../utils/dateTimeFormatter.js';
import { apiPut, apiGet, apiDelete } from '../../utils/api.js';
import { X, Pencil, Trash } from 'react-bootstrap-icons';
import EditTitleModal from './modal/EditTitleModal.js';
import EditDescriptionModal from './modal/EditDescriptionModal.js';
import AddSubtaskModal from './modal/AddSubtaskModal.js';
import AddNoteModal from './modal/AddNoteModal.js';
import DeleteConfirmationModal from './modal/DeleteConfirmationModal.js';

const Card = ({
  _id: taskId,
  title: initialTitle,
  description: initialDescription,
  solver: initialSolver,
  priority: initialPriority,
  subtasks: initialSubtasks,
  dueDate: initialDueDate,
  created,
  notes: initialNotes,
  isCompleted,
  onUpdate,
  onCreateSubtask,
  onDeleteTask,
}) => {
  const [flipped, setFlipped] = useState(false);
  const [localDueDate, setLocalDueDate] = useState(initialDueDate ? new Date(initialDueDate) : null);
  const [localSolver, setLocalSolver] = useState(initialSolver || '');
  const [solvers, setSolvers] = useState([]);
  const [loadingSolvers, setLoadingSolvers] = useState(true);

  const [showEditTitleModal, setShowEditTitleModal] = useState(false);
  const [showEditDescriptionModal, setShowEditDescriptionModal] = useState(false);
  const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

  const handleFlip = () => setFlipped(!flipped);

  const handleIsCompletedChange = async (event) => {
  const updatedCompletion = event.target.checked; // Získání stavu z eventu
  try {
    const updatedTaskFromApi = await apiPut(`/tasks/${taskId}`, {
      isCompleted: updatedCompletion,
    });
    onUpdate?.({ _id: taskId, isCompleted: updatedTaskFromApi.isCompleted });
  } catch (error) {
    console.error(`Failed to update task completion status:`, error);
    alert('Nepodařilo se aktualizovat stav dokončení úkolu.');
  }
};

  const handleSubtaskChange = async (subtaskId) => {
    const subtaskToUpdate = initialSubtasks.find(subtask => subtask._id === subtaskId);

    if (!subtaskToUpdate) {
      console.error(`Subtask with ID ${subtaskId} not found.`);
      return;
    }

    const updatedCompletion = !subtaskToUpdate.isCompleted;

    try {
      const updatedSubtaskFromApi = await apiPut(`/tasks/${subtaskId}`, {
        isCompleted: updatedCompletion,
      });
      onUpdate?.({ _id: taskId, subtask: updatedSubtaskFromApi });
    } catch (error) {
      console.error(`Failed to update subtask ${subtaskId}:`, error);
    }
  };

  const handleDueDateChange = (date) => {
    setLocalDueDate(date);
    onUpdate?.({ dueDate: date });
  };

  const handleRemoveDueDate = () => {
    setLocalDueDate(null);
    onUpdate?.({ dueDate: null });
  };

  useEffect(() => {
    const fetchSolvers = async () => {
      try {
        const data = await apiGet('/solvers');
        setSolvers(data);
      } catch (error) {
        console.error('Failed to fetch solvers:', error);
      } finally {
        setLoadingSolvers(false);
      }
    };

    fetchSolvers();
  }, []);

  // Helper functions for class names based on priority and due date
  const getPriorityClassName = (priority) => {
    switch (priority) {
      case 'Low':
        return 'priority-low-text';
      case 'Medium':
        return 'priority-medium-text';
      case 'High':
        return 'priority-high-text';
      default:
        return '';
    }
  };

  const getDueDateClassName = (dueDate) => {
    if (!dueDate) {
      return ''; 
    }
    const now = new Date();
    const dueDateObj = new Date(dueDate);
    const differenceInDays = (dueDateObj - now) / (1000 * 60 * 60 * 24);

    if (differenceInDays < -0.5) { 
      return 'duedate-past';
    } else if (differenceInDays < 3) {
      return 'duedate-soon';
    } else {
      return ''; 
    }
  };

  // Handlers for showing/hiding modals
  const handleShowEditTitleModal = () => setShowEditTitleModal(true);
  const handleCloseEditTitleModal = () => setShowEditTitleModal(false);
  const handleShowEditDescriptionModal = () => setShowEditDescriptionModal(true);
  const handleCloseEditDescriptionModal = () => setShowEditDescriptionModal(false);
  const handleShowAddSubtaskModal = () => setShowAddSubtaskModal(true);
  const handleCloseAddSubtaskModal = () => setShowAddSubtaskModal(false);
  const handleShowAddNoteModal = () => setShowAddNoteModal(true);
  const handleCloseAddNoteModal = () => setShowAddNoteModal(false);
  const handleShowDeleteConfirmationModal = () => setShowDeleteConfirmationModal(true);
  const handleCloseDeleteConfirmationModal = () => setShowDeleteConfirmationModal(false);

  // Handlers for saving data from modals
  const handleSaveTitle = (newTitle) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSaveDescription = (newDescription) => {
    onUpdate?.({ description: newDescription });
  };

  const handleAddSubtask = (subtaskData) => {
    onCreateSubtask?.({ ...subtaskData, parentTaskId: taskId });
  };

  const handleAddNote = async (noteData) => {
    try {
      const updatedNotes = [...(initialNotes || []), noteData];
      await apiPut(`/tasks/${taskId}`, { notes: updatedNotes });
      onUpdate?.({ notes: updatedNotes });
    } catch (error) {
      console.error('Failed to add note:', error);
      alert('Nepodařilo se přidat poznámku.');
    }
  };

  const handleDeleteTask = async () => {
    try {
      await apiDelete(`/tasks/${taskId}`);
      handleCloseDeleteConfirmationModal();
      onDeleteTask?.(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Nepodařilo se smazat úkol.');
    }
  };

  return (
    <div className={`task-card-container ${flipped ? 'flipped' : ''}`}>
      <div className="task-card">
        {/* FRONT */}
        <div className="task-card-front">
          <div className='task-card-header d-flex justify-content-center align-items-center'>
            <h5 className="task-card-title">{initialTitle}</h5>
            <Pencil size={14} className="ms-2" style={{ cursor: 'pointer' }} onClick={handleShowEditTitleModal} />
          </div>

          <div className="task-card-body">
            <div onClick={handleFlip} className='task-card-icon' />

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Due Date</Form.Label>
                  <div className={`d-flex align-items-center ${getDueDateClassName(localDueDate)}`}>
                    <DatePicker
                      selected={localDueDate}
                      onChange={handleDueDateChange}
                      className={`form-control ${getDueDateClassName(localDueDate)}`} 
                      dateFormat="dd.MM.yyyy"
                      placeholderText="Select date"
                    />
                    {localDueDate && (
                      <button
                        type="button"
                        className="ms-2 btn btn-sm btn-link p-0"
                        onClick={handleRemoveDueDate}
                        aria-label="Remove due date"
                        style={{ color: 'red', cursor: 'pointer', margin: 0 }}
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={initialPriority || ""}
                    onChange={(e) => {
                      const newValue = e.target.value === "" ? null : e.target.value;
                      onUpdate?.({ priority: newValue });                   
                    }}
                    className={getPriorityClassName(initialPriority)}
                  >
                    <option value="" className={getPriorityClassName("")}>Not Set</option>
                    <option value="Low" className={getPriorityClassName("Low")}>Low</option>
                    <option value="Medium" className={getPriorityClassName("Medium")}>Medium</option>
                    <option value="High" className={getPriorityClassName("High")}>High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col>
                <Form.Label>Completition</Form.Label>
                <Form.Check                   
                    type="checkbox"                    
                    checked={isCompleted} 
                    onChange={handleIsCompletedChange}  
                    className="custom-checkbox-lg-green"              
                  />
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Solver</Form.Label>
                  {loadingSolvers ? (
                    <Form.Control readOnly defaultValue="Loading..." />
                  ) : (
                    <Form.Select
                      value={localSolver}
                      onChange={(e) => {
                        const newValue = e.target.value === "" ? null : e.target.value;
                        setLocalSolver(newValue);
                        onUpdate?.({ solver: newValue });
                      }}
                    >
                      <option value="">Not Set</option>
                      {solvers.map((solverOption) => (
                        <option key={solverOption._id} value={solverOption._id}>
                          {solverOption.name}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <hr />

            <ul className='my-ul'>
              {initialSubtasks?.map((subtask) => (
                <li key={subtask._id}>
                  <Form.Check
                    type="checkbox"
                    label={subtask.title}
                    checked={subtask.isCompleted}
                    onChange={() => handleSubtaskChange(subtask._id)}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className='task-card-footer d-flex justify-content-between align-items-center'>
            <Button variant="outline-primary" size="sm" onClick={handleShowAddSubtaskModal}>
              Add Subtask
            </Button>
            <small className="ms-2">{created ? new Date(created).toLocaleDateString() : ""}</small>
            <Trash size={20} className="ms-2" style={{ cursor: 'pointer', color: 'red' }} onClick={handleShowDeleteConfirmationModal} />
          </div>
        </div>

        {/* BACK */}
        <div className="task-card-back">
          <div className='task-card-header'>
            <h5 className="task-card-title">{initialTitle}</h5>
          </div>

          <div className="task-card-body">
            <div onClick={handleFlip} className='task-card-icon' />

            <div>
              <p>{initialDescription}</p>
              <Pencil
                size={14}
                style={{ cursor: 'pointer' }}
                onClick={handleShowEditDescriptionModal}
              />
            </div>
            <hr />
            <ul className='my-ul'>
              {initialNotes?.map((note, index) => (
                <li key={index}>
                  <small>{formatToCET(note.timestamp)}</small>
                  <br />
                  <span>{note.note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className='task-card-footer d-flex justify-content-between align-items-center'>
            <Button variant="outline-info" size="sm" onClick={handleShowAddNoteModal}>
              Add Note
            </Button>
            <small>{created ? new Date(created).toLocaleDateString() : ""}</small>
          </div>
        </div>
      </div>

      {/* Modal windows */}
      <EditTitleModal
        show={showEditTitleModal}
        onHide={handleCloseEditTitleModal}
        initialTitle={initialTitle}
        onSave={handleSaveTitle}
      />
      <EditDescriptionModal
        show={showEditDescriptionModal}
        onHide={handleCloseEditDescriptionModal}
        initialDescription={initialDescription}
        onSave={handleSaveDescription}
      />
      <AddSubtaskModal
        show={showAddSubtaskModal}
        onHide={handleCloseAddSubtaskModal}
        onAdd={handleAddSubtask}
      />
      <AddNoteModal
        show={showAddNoteModal}
        onHide={handleCloseAddNoteModal}
        onAdd={handleAddNote}
      />
      <DeleteConfirmationModal
        show={showDeleteConfirmationModal}
        onHide={handleCloseDeleteConfirmationModal}
        onConfirm={handleDeleteTask}
      />
    </div>
  );
};

export default Card;