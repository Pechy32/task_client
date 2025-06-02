import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ConfirmDeleteModal = ({ show, onHide, onConfirm }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Potvrdit smazání</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Opravdu chcete smazat tohoto solvera? Tato akce je nevratná.
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

export default ConfirmDeleteModal;