import { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './card.css';
import { formatToCET } from '../../utils/dateTimeFormatter.js';
import { apiPut, apiGet, apiDelete } from '../../utils/api.js';
import { X, Pencil, Trash } from 'react-bootstrap-icons';

const Card = ({
  _id: taskId,
  title: initialTitle,
  description: initialDescription,
  solver,
  priority,
  subtasks,
  dueDate,
  created,
  notes: initialNotes,
  completition,
  onUpdate,
  onCreateSubtask,
  onDeleteTask,
}) => {
  const [flipped, setFlipped] = useState(false);
  const [localDueDate, setLocalDueDate] = useState(dueDate ? new Date(dueDate) : null);
  const [localPriority, setLocalPriority] = useState(priority || '');
  const [localSolver, setLocalSolver] = useState(solver || '');
  const [solvers, setSolvers] = useState([]);
  const [loadingSolvers, setLoadingSolvers] = useState(true);
  const [showEditTitleModal, setShowEditTitleModal] = useState(false);
  const [localTitle, setLocalTitle] = useState(initialTitle);
  const [showEditDescriptionModal, setShowEditDescriptionModal] = useState(false);
  const [localDescription, setLocalDescription] = useState(initialDescription || '');
  const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

  const handleFlip = () => setFlipped(!flipped);

  const handleSubtaskChange = async (index) => {
    const subtask = subtasks[index];
    const updatedCompletion = !subtask.isCompleted;

    try {
      const updatedSubtask = await apiPut(`/tasks/${subtask._id}`, {
        isCompleted: updatedCompletion,
      });
      const updatedSubtasks = [...subtasks];
      updatedSubtasks[index] = updatedSubtask;
      onUpdate?.({ subtasks: updatedSubtasks });
    } catch (error) {
      console.error(`Failed to update subtask ${subtask._id}:`, error);
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

  const handleShowEditTitleModal = () => setShowEditTitleModal(true);
  const handleCloseEditTitleModal = () => setShowEditTitleModal(false);

  const handleTitleChange = (event) => {
    setLocalTitle(event.target.value);
  };

  const handleSaveTitle = () => {
    if (localTitle.trim() !== "" && localTitle.length <= 100) {
      onUpdate?.({ title: localTitle });
      handleCloseEditTitleModal();
    } else if (localTitle.trim() === "") {
      alert("Název nemůže být prázdný.");
    } else if (localTitle.length > 100) {
      alert("Název může mít maximálně 100 znaků.");
    }
  };

  // Handlers for editing description
  const handleShowEditDescriptionModal = () => setShowEditDescriptionModal(true);
  const handleCloseEditDescriptionModal = () => setShowEditDescriptionModal(false);

  const handleDescriptionChange = (event) => {
    setLocalDescription(event.target.value);
  };

  const handleSaveDescription = () => {
    onUpdate?.({ description: localDescription });
    handleCloseEditDescriptionModal();
  };

  // Handlers for adding subtask
  const handleShowAddSubtaskModal = () => setShowAddSubtaskModal(true);
  const handleCloseAddSubtaskModal = () => setShowAddSubtaskModal(false);

  const handleNewSubtaskTitleChange = (event) => {
    setNewSubtaskTitle(event.target.value);
  };

  const handleAddSubtask = async () => {
    if (newSubtaskTitle.trim() !== "" && newSubtaskTitle.length <= 100 && onCreateSubtask) {
      try {
        await onCreateSubtask({ title: newSubtaskTitle, parentTaskId: taskId });
        setNewSubtaskTitle(''); 
        handleCloseAddSubtaskModal();      
      } catch (error) {
        console.error('Failed to create subtask:', error);
        alert('Nepodařilo se vytvořit subtask.'); 
      }
    } else if (newSubtaskTitle.trim() === "") {
      alert("Název subtasku nemůže být prázdný.");
    } else if (newSubtaskTitle.length > 100) {
      alert("Název subtasku může mít maximálně 100 znaků.");
    }
  };

  // Handlers for adding note
  const handleShowAddNoteModal = () => setShowAddNoteModal(true);
  const handleCloseAddNoteModal = () => setShowAddNoteModal(false);

  const handleNewNoteTextChange = (event) => {
    setNewNoteText(event.target.value);
  };

  const handleAddNote = async () => {
    if (newNoteText.trim() !== "") {
      try {
        const updatedNotes = [...(initialNotes || []), { note: newNoteText, timestamp: new Date().toISOString() }];
        await apiPut(`/tasks/${taskId}`, { notes: updatedNotes });
        setNewNoteText('');
        handleCloseAddNoteModal();
        onUpdate?.({ notes: updatedNotes });
      } catch (error) {
        console.error('Failed to add note:', error);
        alert('Nepodařilo se přidat poznámku.');
      }
    } else {
      alert("Poznámka nemůže být prázdná.");
    }
  };

  // Handlers for deleting task
  const handleShowDeleteConfirmationModal = () => setShowDeleteConfirmationModal(true);
  const handleCloseDeleteConfirmationModal = () => setShowDeleteConfirmationModal(false);

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
          <div className='task-card-header d-flex justify-content-center align-items-center'> {/* Flex pro zarovnání */}
            <h5 className="task-card-title">{initialTitle}</h5>
            <Pencil size={14} className="ms-2" style={{ cursor: 'pointer' }} onClick={handleShowEditTitleModal} /> {/* Ikona tužky */}
          </div>

          <div className="task-card-body">
            <div onClick={handleFlip} className='task-card-icon' />

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Due Date</Form.Label>
                  <div className="d-flex align-items-center"> 
                    <DatePicker
                      selected={localDueDate}
                      onChange={handleDueDateChange}
                      className="form-control"
                      dateFormat="yyyy-MM-dd"
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
                    value={localPriority}
                    onChange={(e) => {
                      const newValue = e.target.value === "" ? null : e.target.value;
                      setLocalPriority(newValue);
                      onUpdate?.({ priority: newValue });
                    }}
                  >
                    <option value="">Not Set</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col>
                <Form.Label>Completition</Form.Label>
                <p>{completition || "0 %"}</p>
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

            <hr></hr>

            <ul className='my-ul'>
              {subtasks?.map((subtask, index) => (
                <li key={index}>
                  <Form.Check
                    type="checkbox"
                    label={subtask.title}
                    checked={subtask.isCompleted}
                    onChange={() => handleSubtaskChange(index)}
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

      {/* Modal window for editing title */}
      <Modal show={showEditTitleModal} onHide={handleCloseEditTitleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editovat název úkolu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nový název</Form.Label>
            <Form.Control
              type="text"
              value={localTitle}
              onChange={handleTitleChange}
              maxLength={50}
            />
            <Form.Text className="text-muted">
              Maximálně 50 znaků.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditTitleModal}>
            Zrušit
          </Button>
          <Button variant="primary" onClick={handleSaveTitle}>
            Uložit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal window for editing description */}
      <Modal show={showEditDescriptionModal} onHide={handleCloseEditDescriptionModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editovat popis úkolu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nový popis</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={localDescription}
              onChange={handleDescriptionChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditDescriptionModal}>
            Zrušit
          </Button>
          <Button variant="primary" onClick={handleSaveDescription}>
            Uložit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal window for adding subtasks */}
      <Modal show={showAddSubtaskModal} onHide={handleCloseAddSubtaskModal}>
        <Modal.Header closeButton>
          <Modal.Title>Přidat nový subtask</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Název subtasku</Form.Label>
            <Form.Control
              type="text"
              value={newSubtaskTitle}
              onChange={handleNewSubtaskTitleChange}
              maxLength={100}
            />
            <Form.Text className="text-muted">
              Maximálně 100 znaků.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddSubtaskModal}>
            Zrušit
          </Button>
          <Button variant="primary" onClick={handleAddSubtask}>
            Přidat
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal window for adding notes */}
      <Modal show={showAddNoteModal} onHide={handleCloseAddNoteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Přidat poznámku</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nová poznámka</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newNoteText}
              onChange={handleNewNoteTextChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddNoteModal}>
            Zrušit
          </Button>
          <Button variant="primary" onClick={handleAddNote}>
            Přidat
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal window for deleting confirmation */}
      <Modal show={showDeleteConfirmationModal} onHide={handleCloseDeleteConfirmationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Potvrdit smazání</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Opravdu chcete smazat tento úkol? Tato akce je nevratná.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteConfirmationModal}>
            Zrušit
          </Button>
          <Button variant="danger" onClick={handleDeleteTask}>
            Smazat
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Card;