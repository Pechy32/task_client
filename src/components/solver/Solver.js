import React from 'react';
import { Pencil, Trash, Person } from 'react-bootstrap-icons';

const Solver = ({ name, solverId, onEdit, onDelete }) => {
    return (
        <div className="border p-4 rounded shadow-md flex items-center justify-between" style={{ display: 'flex', alignItems: 'center' }}>      
            <Person size={40} style={{marginRight: '10px'}}/>
            <h3>{name}</h3> 
            <div>
                <Pencil size={20} onClick={() => onEdit(solverId)} style={{ cursor: 'pointer', marginRight: '15px', marginLeft: '10px' }} color='blue' />
                <Trash size={20} onClick={() => onDelete(solverId)} style={{cursor: 'pointer'}} color='red' />
            </div>
        </div>
    );
};

export default Solver;