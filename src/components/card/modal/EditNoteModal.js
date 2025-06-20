import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EditNoteModal = ({ show, onHide, initialText, onSave, modalTitle }) => {
  const [localText, setLocalText] = useState(initialText);

  useEffect(() => {
    setLocalText(initialText);
  }, [initialText]);

  const handleTextChange = (event) => {
    setLocalText(event.target.value);
  };

  const handleSave = () => {
    if (localText.trim() !== "") {
      onSave(localText);
      onHide();
    } else {
      alert("Poznámka nemůže být prázdná.");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle || 'Edit note'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Note text</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={localText}
            onChange={handleTextChange}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} style={{ width: '80px' }}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} style={{ width: '80px' }}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditNoteModal;