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
        <Modal.Title>Přidat nový subtask</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Název subtasku</Form.Label>
          <Form.Control
            type="text"
            value={newSubtaskTitle}
            onChange={handleNewSubtaskTitleChange}
            maxLength={50}
          />
          <Form.Text className="text-muted">
            Maximálně 50 znaků.
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Zrušit
        </Button>
        <Button variant="primary" onClick={handleAdd}>
          Přidat
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSubtaskModal;