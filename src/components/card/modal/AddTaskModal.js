import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddTaskModal = ({
  show,
  onHide,
  onSubmit,
  title,
  description,
  dueDate,
  priority,
  solver,
  solvers,
  loadingSolvers,
  onTitleChange,
  onDescriptionChange,
  onDueDateChange,
  onPriorityChange,
  onSolverChange,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Přidat nový úkol</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Název úkolu</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={onTitleChange}
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
              value={description}
              onChange={onDescriptionChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Datum dokončení</Form.Label>
            <DatePicker
              selected={dueDate}
              onChange={onDueDateChange}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              placeholderText="Vyberte datum"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Priorita</Form.Label>
            <Form.Select
              value={priority}
              onChange={onPriorityChange}
            >
              <option value="">Not Set</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Řešitel</Form.Label>
            {loadingSolvers ? (
              <Form.Control readOnly defaultValue="Loading..." />
            ) : (
              <Form.Select
                value={solver}
                onChange={onSolverChange}
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
        <Button variant="secondary" onClick={onHide}>
          Zrušit
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Přidat
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTaskModal;