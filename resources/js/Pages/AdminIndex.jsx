import React, { useState } from 'react';
import AdministradorIndex from '../Components/AdministradorIndex';
import AdminUsuarios from '../Components/AdminUsuarios';
import AdminCrearEvento from '../Components/AdminCrearEvento';
import AdminGestionEventos from '../Components/AdminGestionEventos';  
import AdminSorteos from '../Components/AdminSorteos';
import AdminIngresos from '../Components/AdminIngresos'; 
import AdminCrearProducto from "../Components/AdminCrearProducto";
import AdminCrearCategoria from "../Components/AdminCrearCategoria";
import AdminGestionProductos from "../Components/AdminGestionProductos";
import AdminReponerStock from "../Components/AdminReponerStock";  // 🔹 Nuevo Componente
import Mensajes from "../Components/Mensajes";

const paneles = [
    { id: 'ingresos', nombre: 'Ingresos', componente: AdminIngresos },
    { id: 'usuarios', nombre: 'Usuarios', componente: AdminUsuarios },
    { id: 'crearEvento', nombre: 'Crear Evento', componente: AdminCrearEvento },
    { id: 'gestionEventos', nombre: 'Gestionar Eventos', componente: AdminGestionEventos },
    { id: 'sorteos', nombre: 'Sorteos', componente: AdminSorteos },
    { id: 'crearCategoria', nombre: 'Crear Categoría', componente: AdminCrearCategoria },
    { id: 'crearProducto', nombre: 'Crear Producto', componente: AdminCrearProducto },
    { id: 'gestionProductos', nombre: 'Gestionar Productos', componente: AdminGestionProductos },
    { id: 'reponerStock', nombre: 'Reponer Stock', componente: AdminReponerStock }, // 🔹 Se añade la opción de reposición de stock
    { id: 'mensajes', nombre: 'Mensajes', componente: Mensajes },
];

const AdminIndex = ({ usuarios, salas, eventos }) => {
    const [componenteActivo, setComponenteActivo] = useState(null);

    const handleClick = (id) => {
        setComponenteActivo(componenteActivo === id ? null : id);
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <AdministradorIndex />

            {/* Contenedor de paneles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {paneles.map(({ id, nombre }) => (
                    <div 
                        key={id} 
                        className="bg-[#860303] text-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-red-800 transition-all"
                        onClick={() => handleClick(id)}
                    >
                        <h3 className="text-xl font-semibold text-center text-[#e5cc70]">{nombre}</h3>
                    </div>
                ))}
            </div>

            {/* Contenedor de componentes activos */}
            <div className="mt-8">
                {paneles.map(({ id, componente: Componente }) =>
                    componenteActivo === id ? (
                        <div key={id} className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold text-[#860303]">{paneles.find(p => p.id === id).nombre}</h3>
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
