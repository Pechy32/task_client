import { useEffect, useState } from 'react';
import { apiGet, apiDelete, apiPut, apiPost } from './utils/api';
import Solver from './components/solver/Solver';
import EditSolverModal from './components/solver/modal/EditSolverModal';
import ConfirmDeleteModal from './components/solver/modal/ConfirmDeleteModal';
import AddSolverModal from './components/solver/modal/AddSolverModal';
import { Button } from 'react-bootstrap';

const SolverIndex = () => {
    const [solversData, setSolversData] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSolver, setEditingSolver] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [solverToDeleteId, setSolverToDeleteId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false); 
    
    const fetchSolvers = async () => {
        try {
            const data = await apiGet('/solvers');
            setSolversData(data);
        } catch (error) {
            console.error('Failed to fetch solvers:', error);
        }
    };

    const handleAddClick = () => {
        setShowAddModal(true);
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
    };

    const handleCreateSolver = async (newSolverName) => {
        try {
            await apiPost('/solvers', { name: newSolverName });
            fetchSolvers();
        } catch (error) {
            console.error('Failed to create solver:', error);
            alert('Failed to create solver. Please try again.');
        }
    };

    const handleEditClick = (solverId) => {
        const solverToEdit = solversData.find((solver) => solver._id === solverId);
        setEditingSolver(solverToEdit);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingSolver(null);
    };

    const handleSaveSolver = async (solverId, newName) => {
        try {
            await apiPut(`/solvers/${solverId}`, { name: newName });
            fetchSolvers();
        } catch (error) {
            console.error('Failed to update solver:', error);
            alert('Failed to update solver. Please try again.');
        }
    };

    const handleDeleteClick = (solverId) => {
        setSolverToDeleteId(solverId);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSolverToDeleteId(null);
    };

    const handleConfirmDelete = async () => {
        if (solverToDeleteId) {
            try {
                await apiDelete(`/solvers/${solverToDeleteId}`);
                fetchSolvers();
                setShowDeleteModal(false);
                setSolverToDeleteId(null);
            } catch (error) {
                console.error('Failed to delete solver:', error);
                alert('Failed to delete solver. Please try again.');
            }
        }
    };

    useEffect(() => {
        fetchSolvers();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'left', marginTop: '10px' }}>
                <Button variant="primary" className="mb-3" onClick={handleAddClick}>
                    Add Solver
                </Button>               
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {solversData.map((solver) => (
                    <Solver
                        key={solver._id}
                        name={solver.name}
                        solverId={solver._id}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
                ))}
            </div>

            {editingSolver && (
                <EditSolverModal
                    show={showEditModal}
                    onHide={handleCloseEditModal}
                    solver={editingSolver}
                    onSave={handleSaveSolver}
                />
            )}

            <ConfirmDeleteModal
                show={showDeleteModal}
                onHide={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
            />

            <AddSolverModal
                show={showAddModal}
                onHide={handleCloseAddModal}
                onSave={handleCreateSolver}
            />
        </div>
    );
};

export default SolverIndex;