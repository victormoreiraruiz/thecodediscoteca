import React from 'react';
import AdministradorIndex from '../Components/AdministradorIndex';
import AdminUsuarios from '../Components/AdminUsuarios';
import AdminCrearEvento from '../Components/AdminCrearEvento';
import AdminGestionEventos from '../Components/AdminGestionEventos';  // Importar el componente de gestión de eventos

const AdminIndex = ({ usuarios, salas, eventos }) => {  // Asegúrate de recibir los eventos
    return (
        <div>
            <AdministradorIndex />
            <AdminUsuarios usuarios={usuarios} />
            <AdminCrearEvento salas={salas} />
            <AdminGestionEventos eventos={eventos} /> {/* Pasar eventos como prop */}
        </div>
    );
};

export default AdminIndex;
