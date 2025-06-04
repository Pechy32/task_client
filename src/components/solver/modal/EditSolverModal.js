import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const EditSolverModal = ({ show, onHide, solver, onSave }) => {
    const [editedName, setEditedName] = useState(solver?.name || '');

    const handleSave = () => {
        onSave(solver._id, editedName);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Editovat solver</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nový název:</Form.Label>
                        <Form.Control
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            maxLength={30}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Zavřít
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Uložit změny
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditSolverModal;