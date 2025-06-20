import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ConfirmDeleteModal = ({ show, onHide, onConfirm }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Delete confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete the solver? This action cannot be undone.
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

export default ConfirmDeleteModal;