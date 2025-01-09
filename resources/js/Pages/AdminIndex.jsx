import React from 'react';
import AdministradorIndex from '../Components/AdministradorIndex';
import AdminUsuarios from '../Components/AdminUsuarios';
import AdminCrearEvento from '../Components/AdminCrearEvento';
import AdminGestionEventos from '../Components/AdminGestionEventos';  
import AdminSorteos from '../Components/AdminSorteos';
import AdminIngresos from '../Components/AdminIngresos'; 
import AdminCrearProducto from "../Components/AdminCrearProducto";
import AdminCrearCategoria from "../Components/AdminCrearCategoria";
import AdminGestionProductos from "../Components/AdminGestionProductos";

const AdminIndex = ({ usuarios, salas, eventos }) => {  
    return (
        <div>
            <AdministradorIndex />
            <AdminIngresos />
            <AdminUsuarios usuarios={usuarios} />
            <AdminCrearEvento salas={salas} />
            <AdminGestionEventos eventos={eventos} /> 
            <AdminSorteos usuarios={usuarios} />
            <AdminCrearCategoria />
            <AdminCrearProducto />
            <AdminGestionProductos />
        </div>
    );
};

export default AdminIndex;
