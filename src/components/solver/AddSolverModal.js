import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddSolverModal = ({ show, onHide, onSave }) => {
    const [newSolverName, setNewSolverName] = useState('');

    const handleInputChange = (event) => {
        setNewSolverName(event.target.value);
    };

    const handleSaveClick = () => {
        onSave(newSolverName);
        setNewSolverName('');
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Přidat nového solvera</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Název solvera:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Zadejte název solvera"
                            value={newSolverName}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Zrušit
                </Button>
                <Button variant="primary" onClick={handleSaveClick}>
                    Uložit
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddSolverModal;