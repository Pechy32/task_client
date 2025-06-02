import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const AddNoteModal = ({ show, onHide, onAdd }) => {
  const [newNoteText, setNewNoteText] = useState('');

  const handleNewNoteTextChange = (event) => {
    setNewNoteText(event.target.value);
  };

  const handleAdd = () => {
    if (newNoteText.trim() !== "") {
      onAdd({ note: newNoteText, timestamp: new Date().toISOString() });
      setNewNoteText('');
      onHide();
    } else {
      alert("Poznámka nemůže být prázdná.");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
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

export default AddNoteModal;