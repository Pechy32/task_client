import { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { X, Pencil, Trash } from 'react-bootstrap-icons';

import 'react-datepicker/dist/react-datepicker.css';
import './card.css';

import { formatToCET } from '../../utils/dateTimeFormatter.js';
import { apiPut, apiGet, apiDelete } from '../../utils/api.js';

import EditTitleModal from './modal/EditTitleModal.js';
import EditDescriptionModal from './modal/EditDescriptionModal.js';
import AddSubtaskModal from './modal/AddSubtaskModal.js';
import AddNoteModal from './modal/AddNoteModal.js';
import DeleteConfirmationModal from './modal/DeleteConfirmationModal.js';
import EditNoteModal from './modal/EditNoteModal.js';


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

  // =================================================================
  // S T A T E   M A N A G E M E N T
  // =================================================================

  // Card UI State
  const [flipped, setFlipped] = useState(false);
  const [localDueDate, setLocalDueDate] = useState(initialDueDate ? new Date(initialDueDate) : null);
  const [localSolver, setLocalSolver] = useState(initialSolver || '');

  // Data Fetching State
  const [solvers, setSolvers] = useState([]);
  const [loadingSolvers, setLoadingSolvers] = useState(true);

  // Modal Visibility State
  const [showEditTitleModal, setShowEditTitleModal] = useState(false);
  const [showEditDescriptionModal, setShowEditDescriptionModal] = useState(false);
  const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [showEditSubtaskTitleModal, setShowEditSubtaskTitleModal] = useState(false);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);

  // State for Modal Data
  const [currentSubtaskToEdit, setCurrentSubtaskToEdit] = useState(null);
  const [currentNoteToEdit, setCurrentNoteToEdit] = useState(null);


  // =================================================================
  // S I D E   E F F E C T S
  // =================================================================

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


  // =================================================================
  // H E L P E R S   &   U T I L S
  // =================================================================

  const getPriorityClassName = (priority) => {
    // Returns a CSS class based on task priority for styling.
    switch (priority) {
      case 'Low': return 'priority-low-text';
      case 'Medium': return 'priority-medium-text';
      case 'High': return 'priority-high-text';
      default: return '';
    }
  };

  const getDueDateClassName = (dueDate) => {
    // Returns a CSS class for the due date based on how close it is.
    if (!dueDate) return '';
    const now = new Date();
    const dueDateObj = new Date(dueDate);
    const differenceInDays = (dueDateObj - now) / (1000 * 60 * 60 * 24);

    if (differenceInDays < -0.5) return 'duedate-past';
    if (differenceInDays < 3) return 'duedate-soon';
    return '';
  };


  // =================================================================
  // E V E N T   H A N D L E R S
  // =================================================================

  // --- UI Handlers ---
  const handleFlip = () => setFlipped(!flipped);

  // --- Modal Control Handlers ---
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

  const handleShowEditSubtaskTitleModal = (subtask) => {
    setCurrentSubtaskToEdit(subtask);
    setShowEditSubtaskTitleModal(true);
  };
  const handleCloseEditSubtaskTitleModal = () => {
    setShowEditSubtaskTitleModal(false);
    setCurrentSubtaskToEdit(null);
  };

  const handleShowEditNoteModal = (note, index) => {
    setCurrentNoteToEdit({ index, text: note.note });
    setShowEditNoteModal(true);
  };
  const handleCloseEditNoteModal = () => {
    setShowEditNoteModal(false);
    setCurrentNoteToEdit(null);
  };

  // --- Data & API Handlers ---

  const handleIsCompletedChange = async (event) => {
    try {
      const updatedTaskFromApi = await apiPut(`/tasks/${taskId}`, { isCompleted: event.target.checked });
      onUpdate?.({ _id: taskId, isCompleted: updatedTaskFromApi.isCompleted });
    } catch (error) {
      console.error(`Failed to update task completion status:`, error);
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

  const handleSaveTitle = (newTitle) => onUpdate?.({ title: newTitle });
  const handleSaveDescription = (newDescription) => onUpdate?.({ description: newDescription });
  const handleAddSubtask = (subtaskData) => onCreateSubtask?.({ ...subtaskData, parentTaskId: taskId });

  const handleDeleteTask = async () => {
    try {
      await apiDelete(`/tasks/${taskId}`);
      handleCloseDeleteConfirmationModal();
      onDeleteTask?.(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleSubtaskChange = async (subtaskId, isCompleted) => {
    try {
      const updatedSubtaskFromApi = await apiPut(`/tasks/${subtaskId}`, { isCompleted: !isCompleted });
      onUpdate?.({ _id: taskId, subtask: updatedSubtaskFromApi });
    } catch (error) {
      console.error(`Failed to update subtask ${subtaskId}:`, error);
    }
  };

  const handleSubtaskDelete = async (subtaskId) => {
    if (!window.confirm('Opravdu chcete smazat podúkol?')) return;
    try {
      await apiDelete(`/tasks/${subtaskId}`);
      onUpdate?.({ parentTaskId: taskId, deletedSubtaskId: subtaskId });
    } catch (error) {
      console.error(`Failed to delete subtask ${subtaskId}:`, error);
    }
  };

  const handleSaveSubtaskTitle = async (newTitle) => {
    if (!currentSubtaskToEdit) return;
    try {
      const updatedSubtask = await apiPut(`/tasks/${currentSubtaskToEdit._id}`, { title: newTitle });
      onUpdate?.({ _id: taskId, subtask: updatedSubtask });
      handleCloseEditSubtaskTitleModal();
    } catch (error) {
      console.error(`Failed to update subtask title for ${currentSubtaskToEdit._id}:`, error);
    }
  };

  const handleAddNote = async (noteData) => {
    try {
      const updatedNotes = [...(initialNotes || []), noteData];
      await apiPut(`/tasks/${taskId}`, { notes: updatedNotes });
      onUpdate?.({ _id: taskId, notes: updatedNotes });
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleSaveNote = async (newText) => {
    if (currentNoteToEdit === null) return;
    const updatedNotes = initialNotes.map((note, index) =>
      index === currentNoteToEdit.index ? { ...note, note: newText } : note
    );
    try {
      await apiPut(`/tasks/${taskId}`, { notes: updatedNotes });
      onUpdate?.({ _id: taskId, notes: updatedNotes });
      handleCloseEditNoteModal();
    } catch (error) {
      console.error('Failed to edit note:', error);
    }
  };

  const handleDeleteNote = async (noteIndex) => {
    const updatedNotes = initialNotes.filter((_, index) => index !== noteIndex);
    try {
      await apiPut(`/tasks/${taskId}`, { notes: updatedNotes });
      onUpdate?.({ _id: taskId, notes: updatedNotes });
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };


  // =================================================================
  // R E N D E R
  // =================================================================

  return (
    <div className={`task-card-container ${flipped ? 'flipped' : ''}`}>
      <div className="task-card">
        {/* --- CARD FRONT --- */}
        <div className="task-card-front">
          <div className='task-card-header d-flex justify-content-center align-items-center'>
            <h5 className="task-card-title">
              {initialTitle}
              <Pencil size={14} className="ms-2" style={{ cursor: 'pointer' }} onClick={handleShowEditTitleModal} />
            </h5>
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
                      <button type="button" className="ms-2 btn btn-sm btn-link p-0" onClick={handleRemoveDueDate}>
                        <X size={16} color='red'/>
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
                    onChange={(e) => onUpdate?.({ priority: e.target.value || null })}
                    className={getPriorityClassName(initialPriority)}
                  >
                    <option value="">Not Set</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col>
                <Form.Label>Completion</Form.Label>
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
                    checked={subtask.isCompleted}
                    onChange={() => handleSubtaskChange(subtask._id, subtask.isCompleted)}
                    label={
                      <span>
                        {subtask.title}
                        <Pencil size={12} className="ms-2" style={{ cursor: 'pointer' }} onClick={(e) => {
                          e.preventDefault();
                          handleShowEditSubtaskTitleModal(subtask);
                        }} />
                        <Trash size={12} className="ms-2" style={{ cursor: 'pointer', color: 'red' }} onClick={(e) => {
                          e.preventDefault();
                          handleSubtaskDelete(subtask._id);
                        }} />
                      </span>
                    }
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className='task-card-footer d-flex justify-content-between align-items-center'>
            <Button variant="outline-primary" size="sm" onClick={handleShowAddSubtaskModal}>Add Subtask</Button>
            <small className="ms-2">{created ? new Date(created).toLocaleDateString() : ""}</small>
            <Trash size={20} style={{ cursor: 'pointer', color: 'red' }} onClick={handleShowDeleteConfirmationModal} />
          </div>
        </div>

        {/* --- CARD BACK --- */}
        <div className="task-card-back">
          <div className='task-card-header'>
            <h5 className="task-card-title">{initialTitle}</h5>
          </div>
          <div className="task-card-body">
            <div onClick={handleFlip} className='task-card-icon' />
            <div>
              {initialDescription}
              <Pencil size={14} style={{ cursor: 'pointer', marginLeft: '5px' }} onClick={handleShowEditDescriptionModal} />
            </div>
            <hr />
            <ul className='my-ul'>
              {initialNotes?.map((note, index) => (
                <li key={index}>
                  <small>{formatToCET(note.timestamp)}</small>
                  <br />
                  <span>
                    {note.note}
                    <Pencil size={12} className="ms-2" style={{ cursor: 'pointer' }} onClick={() => handleShowEditNoteModal(note, index)} />
                    <Trash size={12} className="ms-2" style={{ cursor: 'pointer', color: 'red' }} onClick={() => handleDeleteNote(index)} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className='task-card-footer d-flex justify-content-between align-items-center'>
            <Button variant="outline-info" size="sm" onClick={handleShowAddNoteModal}>Add Note</Button>
            <small>{created ? new Date(created).toLocaleDateString() : ""}</small>
          </div>
        </div>
      </div>

      {/* --- MODAL WINDOWS --- */}
      <EditTitleModal show={showEditTitleModal} onHide={handleCloseEditTitleModal} initialTitle={initialTitle} onSave={handleSaveTitle} />
      <EditDescriptionModal show={showEditDescriptionModal} onHide={handleCloseEditDescriptionModal} initialDescription={initialDescription} onSave={handleSaveDescription} />
      <AddSubtaskModal show={showAddSubtaskModal} onHide={handleCloseAddSubtaskModal} onAdd={handleAddSubtask} />
      <AddNoteModal show={showAddNoteModal} onHide={handleCloseAddNoteModal} onAdd={handleAddNote} />
      <DeleteConfirmationModal show={showDeleteConfirmationModal} onHide={handleCloseDeleteConfirmationModal} onConfirm={handleDeleteTask} />
      <EditTitleModal show={showEditSubtaskTitleModal} onHide={handleCloseEditSubtaskTitleModal} initialTitle={currentSubtaskToEdit ? currentSubtaskToEdit.title : ''} onSave={handleSaveSubtaskTitle} />
      <EditNoteModal show={showEditNoteModal} onHide={handleCloseEditNoteModal} initialText={currentNoteToEdit ? currentNoteToEdit.text : ''} onSave={handleSaveNote} />
    </div>
  );
};

export default Card;