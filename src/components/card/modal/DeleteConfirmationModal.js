import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteConfirmationModal = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Potvrdit smazání</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Opravdu chcete smazat tento úkol? Tato akce je nevratná.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Zrušit
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Smazat
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;