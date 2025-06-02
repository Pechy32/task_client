import React from 'react';
import { Pencil, Trash } from 'react-bootstrap-icons';

const Solver = ({ name, solverId, onEdit, onDelete }) => {
    return (
        <div className="border p-4 rounded shadow-md flex items-center justify-between">
            <h3>{name}</h3>
            <div>
                <button onClick={() => onEdit(solverId)} className="btn btn-sm btn-outline-primary mr-2">
                    <Pencil size={20} />
                </button>
                <button onClick={() => onDelete(solverId)} className="btn btn-sm btn-outline-danger">
                    <Trash size={20} />
                </button>
            </div>
        </div>
    );
};

export default Solver;