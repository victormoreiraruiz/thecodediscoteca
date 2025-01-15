import React, { useState } from 'react';
import { FaUsers, FaClipboardList, FaCalendarPlus, FaTrophy, FaBoxOpen, FaPlusCircle, FaClipboardCheck, FaBox, FaTools, FaEnvelope } from "react-icons/fa"; 
import AdministradorIndex from '../Components/AdministradorIndex';
import AdminUsuarios from '../Components/AdminUsuarios';
import AdminCrearEvento from '../Components/AdminCrearEvento';
import AdminGestionEventos from '../Components/AdminGestionEventos';  
import AdminSorteos from '../Components/AdminSorteos';
import AdminIngresos from '../Components/AdminIngresos'; 
import AdminCrearProducto from "../Components/AdminCrearProducto";
import AdminCrearCategoria from "../Components/AdminCrearCategoria";
import AdminGestionProductos from "../Components/AdminGestionProductos";
import AdminGestionCategoria from "../Components/AdminGestionCategoria";
import AdminReponerStock from "../Components/AdminReponerStock";  
import Mensajes from "../Components/Mensajes";
import Navigation from '../Components/Navigation';

// Definir paneles con íconos
const paneles = [
    { id: 'ingresos', nombre: 'Ingresos', icono: <FaClipboardList />, componente: AdminIngresos },
    { id: 'usuarios', nombre: 'Usuarios', icono: <FaUsers />, componente: AdminUsuarios },
    { id: 'crearEvento', nombre: 'Crear Evento', icono: <FaCalendarPlus />, componente: AdminCrearEvento },
    { id: 'gestionEventos', nombre: 'Gestionar Eventos', icono: <FaClipboardCheck />, componente: AdminGestionEventos },
    { id: 'sorteos', nombre: 'Sorteos', icono: <FaTrophy />, componente: AdminSorteos },
    { id: 'crearCategoria', nombre: 'Crear Categoría', icono: <FaPlusCircle />, componente: AdminCrearCategoria },
    { id: 'gestionCategoria', nombre: 'Gestionar Categoría', icono: <FaBoxOpen />, componente: AdminGestionCategoria },
    { id: 'crearProducto', nombre: 'Crear Producto', icono: <FaPlusCircle />, componente: AdminCrearProducto },
    { id: 'gestionProductos', nombre: 'Gestionar Productos', icono: <FaBox />, componente: AdminGestionProductos },
    { id: 'reponerStock', nombre: 'Reponer Stock', icono: <FaTools />, componente: AdminReponerStock },
    { id: 'mensajes', nombre: 'Mensajes', icono: <FaEnvelope />, componente: Mensajes },
];

const AdminIndex = ({ usuarios, salas, eventos }) => {
    const [componenteActivo, setComponenteActivo] = useState(null);

    const handleClick = (id) => {
        setComponenteActivo(componenteActivo === id ? null : id);
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <Navigation />
            <AdministradorIndex />

            {/* 🟥 Contenedor de paneles (botones) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                {paneles.map(({ id, nombre, icono }) => (
                    <div 
                        key={id} 
                        className="flex flex-col items-center justify-center bg-[#860303] text-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-red-700 transition-all transform hover:scale-105"
                        onClick={() => handleClick(id)}
                    >
                        <div className="text-3xl text-[#e5cc70] mb-2">{icono}</div>
                        <h3 className="text-lg font-semibold text-center">{nombre}</h3>
                    </div>
                ))}
            </div>

            {/* 📌 Contenedor de componentes activos */}
            <div className="mt-8">
                {paneles.map(({ id, componente: Componente }) =>
                    componenteActivo === id ? (
                        <div key={id} className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
                            <h3 className="text-2xl font-bold text-[#860303] mb-4">{paneles.find(p => p.id === id).nombre}</h3>
                            <Componente 
                                usuarios={id === 'usuarios' || id === 'sorteos' ? usuarios : undefined} 
                                salas={id === 'crearEvento' ? salas : undefined} 
                                eventos={id === 'gestionEventos' ? eventos : undefined} 
                            />
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
};

export default AdminIndex;
