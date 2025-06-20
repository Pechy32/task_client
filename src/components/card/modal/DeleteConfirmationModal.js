import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteConfirmationModal = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Delete confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the task? This action cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} style={{ width: '80px' }}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} style={{ width: '80px' }}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;