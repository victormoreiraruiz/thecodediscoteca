import React from 'react';
import AdministradorIndex from '../Components/AdministradorIndex';
import AdminUsuarios from '../Components/AdminUsuarios';

const AdminIndex = ({ usuarios }) => {  // Aquí recibimos los usuarios como prop
    return (
        <div>
            <AdministradorIndex />
            <AdminUsuarios usuarios={usuarios} />
        </div>
    );
};

export default AdminIndex;
