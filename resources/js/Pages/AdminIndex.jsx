import React from 'react';
import AdministradorIndex from '../Components/AdministradorIndex';
import AdminUsuarios from '../Components/AdminUsuarios';
import AdminCrearEvento from '../Components/AdminCrearEvento';  // Importar el componente

const AdminIndex = ({ usuarios, salas }) => {  // Asegúrate de recibir las salas como prop
    return (
        <div>
            <AdministradorIndex />
            <AdminUsuarios usuarios={usuarios} />
            
            <AdminCrearEvento salas={salas} /> 
        </div>
    );
};

export default AdminIndex;
