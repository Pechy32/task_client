import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EditTitleModal = ({ show, onHide, initialTitle, onSave }) => {
  const [localTitle, setLocalTitle] = useState(initialTitle);

  useEffect(() => {
    setLocalTitle(initialTitle); // Aktualizace lokálního stavu při změně propu
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

export default EditTitleModal;