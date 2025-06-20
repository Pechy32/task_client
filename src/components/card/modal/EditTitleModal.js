import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EditTitleModal = ({ show, onHide, initialTitle, onSave }) => {
  const [localTitle, setLocalTitle] = useState(initialTitle);

  useEffect(() => {
    setLocalTitle(initialTitle); // Actually update the local title when initialTitle changes
  }, [initialTitle]);

  const handleTitleChange = (event) => {
    setLocalTitle(event.target.value);
  };

  const handleSave = () => {
    if (localTitle.trim() !== "" && localTitle.length <= 50) {
      onSave(localTitle);
      onHide();
    } else if (localTitle.trim() === "") {
      alert("Název nemůže být prázdný.");
    } else if (localTitle.length > 50) {
      alert("Název může mít maximálně 50 znaků.");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit task title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>New title</Form.Label>
          <Form.Control
            type="text"
            value={localTitle}
            onChange={handleTitleChange}
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
        <Button variant="primary" onClick={handleSave} style={{ width: '80px' }}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditTitleModal;