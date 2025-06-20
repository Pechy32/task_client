import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const AddSubtaskModal = ({ show, onHide, onAdd }) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleNewSubtaskTitleChange = (event) => {
    setNewSubtaskTitle(event.target.value);
  };

  const handleAdd = () => {
    if (newSubtaskTitle.trim() !== "" && newSubtaskTitle.length <= 50) {
      onAdd({ title: newSubtaskTitle });
      setNewSubtaskTitle('');
      onHide();
    } else if (newSubtaskTitle.trim() === "") {
      alert("Název subtasku nemůže být prázdný.");
    } else if (newSubtaskTitle.length > 50) {
      alert("Název subtasku může mít maximálně 50 znaků.");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add subtask</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Subtask title</Form.Label>
          <Form.Control
            type="text"
            value={newSubtaskTitle}
            onChange={handleNewSubtaskTitleChange}
            maxLength={50}
          />
          <Form.Text className="text-muted">
            Max 50 chars
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} style={{ width: '80px' }}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAdd} style={{ width: '80px' }}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSubtaskModal;