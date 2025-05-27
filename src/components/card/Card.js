import { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './card.css';
import { formatToCET } from '../../utils/dateTimeFormatter.js';

const Card = ({
  title,
  description,
  solver,
  priority,
  subtasks,
  dueDate,
  created,
  notes,
  completition,
  onUpdate, // Callback pro změny
}) => {
  const [flipped, setFlipped] = useState(false);
  const [localDueDate, setLocalDueDate] = useState(dueDate ? new Date(dueDate) : null);
  const [localPriority, setLocalPriority] = useState(priority || '');
  const [localSolver, setLocalSolver] = useState(solver || '');

  const handleFlip = () => setFlipped(!flipped);

  const handleSubtaskChange = (index) => {
    const updated = [...subtasks];
    updated[index].isCompleted = !updated[index].isCompleted;
    onUpdate?.({ subtasks: updated });
  };

  return (
    <div className={`task-card-container ${flipped ? 'flipped' : ''}`}>
      <div className="task-card">
        {/* FRONT */}
        <div className="task-card-front">
          <div className='task-card-header'>
            <h5 className="task-card-title">{title}</h5>
          </div>

          <div className="task-card-body scrollable">
            <div onClick={handleFlip} className='task-card-icon' />

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Due Date</Form.Label>
                  <DatePicker
                    selected={localDueDate}
                    onChange={(date) => {
                      setLocalDueDate(date);
                      onUpdate?.({ dueDate: date });
                    }}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={localPriority}
                    onChange={(e) => {
                      setLocalPriority(e.target.value);
                      onUpdate?.({ priority: e.target.value });
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
                  <Form.Select
                    value={localSolver}
                    onChange={(e) => {
                      setLocalSolver(e.target.value);
                      onUpdate?.({ solver: e.target.value });
                    }}
                  >
                    <option value="">Not Set</option>
                    <option>Solver 1</option>
                    <option>Solver 2</option>
                    {/* Případně dynamicky */}
                  </Form.Select>
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

          <div className='task-card-footer'>
            <small>{created ? new Date(created).toLocaleDateString() : ""}</small>
          </div>
        </div>

        {/* BACK */}
        <div className="task-card-back">
          <div className='task-card-header'>
            <h5 className="task-card-title">{title}</h5>
          </div>

          <div className="task-card-body scrollable">
            <div onClick={handleFlip} className='task-card-icon' />

            <p>{description}</p>
            <hr />
            <ul className='my-ul'>
              {notes?.map((note, index) => (
                <li key={index}>
                  <small>{formatToCET(note.timestamp)}</small>
                  <br />
                  <span>{note.note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className='task-card-footer'>
            <small>{created ? new Date(created).toLocaleDateString() : ""}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;