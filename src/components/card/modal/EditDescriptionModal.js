import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EditDescriptionModal = ({ show, onHide, initialDescription, onSave }) => {
  const [localDescription, setLocalDescription] = useState(initialDescription);

  useEffect(() => {
    setLocalDescription(initialDescription);
  }, [initialDescription]);

  const handleDescriptionChange = (event) => {
    setLocalDescription(event.target.value);
  };

  const handleSave = () => {
    onSave(localDescription);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
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
        <Button variant="secondary" onClick={onHide}>
          Zrušit
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Uložit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditDescriptionModal;