import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { X, Pencil, Trash } from 'react-bootstrap-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { formatToCET } from '../../../utils/dateTimeFormatter.js';

const TaskDetailModal = ({
    show,
    onHide,
    task,
    solvers,
    loadingSolvers,
    getDueDateClassName,
    getPriorityClassName,
    onUpdate,
    onIsCompletedChange,
    onDueDateChange,
    onRemoveDueDate,
    onSubtaskChange,
    onSubtaskDelete,
    onNoteDelete,
    onSolverUpdate,
    openEditTitleModal,
    openEditDescriptionModal,
    openAddSubtaskModal,
    openEditSubtaskModal,
    openAddNoteModal,
    openEditNoteModal,
    openDeleteConfirmationModal,
}) => {

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title className="d-flex align-items-center">
                    {task.title}
                    <Pencil size={18} className="ms-3" style={{ cursor: 'pointer' }} onClick={openEditTitleModal} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <div className="d-flex align-items-center">
                        <strong>Description</strong>
                        <Pencil size={14} className="ms-2" style={{ cursor: 'pointer' }} onClick={openEditDescriptionModal} />
                    </div>
                    <p className="mt-1 text-muted">{task.description || 'No description provided.'}</p>
                </div>
                <hr></hr>
                <Row className="mb-3 gy-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Due Date</Form.Label>
                            <div className={`d-flex align-items-center ${getDueDateClassName(task.dueDate)}`}>
                                <DatePicker
                                    selected={task.dueDate ? new Date(task.dueDate) : null}
                                    onChange={onDueDateChange}
                                    className={`form-control ${getDueDateClassName(task.dueDate)}`}
                                    dateFormat="dd.MM.yyyy"
                                    placeholderText="Select date"
                                />
                                {task.dueDate && (
                                    <button type="button" className="ms-2 btn btn-sm btn-link p-0" onClick={onRemoveDueDate}>
                                        <X size={20} color='red' />
                                    </button>
                                )}
                            </div>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Priority</Form.Label>
                            <Form.Select
                                value={task.priority || ""}
                                onChange={(e) => onUpdate({ priority: e.target.value || null })}
                                className={getPriorityClassName(task.priority)}
                            >
                                <option value="">Not Set</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={6}>                    
                        <Form.Label>Completed</Form.Label>
                        <Form.Check
                            type="switch"
                            id={`task-completed-switch-${task._id}`}
                            checked={task.isCompleted}
                            onChange={onIsCompletedChange}
                            className="custom-checkbox-lg-green mt-1"
                        />
                    </Col>

                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Solver</Form.Label>
                            {loadingSolvers ? (
                                <Form.Control readOnly defaultValue="Loading..." />
                            ) : (
                                <Form.Select
                                    value={task.solver || ''}
                                    onChange={(e) => onSolverUpdate(e.target.value || null)}
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

                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5>Subtasks</h5>
                    <Button variant="outline-primary" size="sm" onClick={openAddSubtaskModal}>Add Subtask</Button>
                </div>
                <ul className='my-ul'>
                    {task.subtasks?.length > 0 ? task.subtasks.map((subtask) => (
                        <li key={subtask._id}>
                            <Form.Check
                                type="checkbox"
                                checked={subtask.isCompleted}
                                onChange={() => onSubtaskChange(subtask._id, subtask.isCompleted)}
                                label={
                                    <span>
                                        {subtask.title}
                                        <Pencil size={12} className="ms-2" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); openEditSubtaskModal(subtask); }} />
                                        <Trash size={12} className="ms-2" style={{ cursor: 'pointer', color: 'red' }} onClick={(e) => { e.preventDefault(); onSubtaskDelete(subtask._id); }} />
                                    </span>
                                }
                            />
                        </li>
                    )) : <li className="text-muted">No subtasks yet.</li>}
                </ul>
                <hr />

                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5>Notes</h5>
                    <Button variant="outline-info" size="sm" onClick={openAddNoteModal}>Add Note</Button>
                </div>
                <ul className='my-ul'>
                    {task.notes?.length > 0 ? task.notes.map((note, index) => (
                        <li key={index}>
                            <small className="text-muted">{formatToCET(note.timestamp)}</small>
                            <br />
                            <span>
                                {note.note}
                                <Pencil size={12} className="ms-2" style={{ cursor: 'pointer' }} onClick={() => openEditNoteModal(note, index)} />
                                <Trash size={12} className="ms-2" style={{ cursor: 'pointer', color: 'red' }} onClick={() => onNoteDelete(index)} />
                            </span>
                        </li>
                    )) : <li className="text-muted">No notes yet.</li>}
                </ul>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between align-items-center">
                <Trash size={22} style={{ cursor: 'pointer', color: 'red' }} onClick={openDeleteConfirmationModal} />
                <small className="text-muted">Created: {task.created ? new Date(task.created).toLocaleDateString() : ""}</small>
            </Modal.Footer>
        </Modal>
    );
};

export default TaskDetailModal;