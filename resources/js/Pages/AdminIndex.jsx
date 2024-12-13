import React from 'react';
import AdministradorIndex from '../Components/AdministradorIndex';
import AdminUsuarios from '../Components/AdminUsuarios';
import AdminCrearEvento from '../Components/AdminCrearEvento';
import AdminGestionEventos from '../Components/AdminGestionEventos';  
import AdminSorteos from '../Components/AdminSorteos';
const AdminIndex = ({ usuarios, salas, eventos }) => {  
    return (
        <div>
            <AdministradorIndex />
            <AdminUsuarios usuarios={usuarios} />
            <AdminCrearEvento salas={salas} />
            <AdminGestionEventos eventos={eventos} /> 
            <AdminSorteos usuarios={usuarios} />
        </div>
    );
};

export default AdminIndex;
