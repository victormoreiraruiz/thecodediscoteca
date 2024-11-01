// MiCuentaDatos.jsx
import React from 'react';
import { Inertia } from '@inertiajs/inertia';

const MiCuentaDatos = ({ user }) => {
    // Verifica si 'user' está definido antes de mostrarlo
    if (!user) return <p>Cargando datos del usuario...</p>;

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        Inertia.post('/logout', {}, {
            onFinish: () => {
                Inertia.visit('/'); // Redirige a la página de inicio tras cerrar sesión
            }
        });
    };

    return (
        <div className="account-container">
            <h2>Mi Cuenta</h2>
            <div className="account-info">
                <h2>Nombre:</h2>
                <h2>{user.name}</h2>
            </div>
            <div className="account-info">
                <h2>Email:</h2>
                <h2>{user.email}</h2>
            </div>
            <div className="account-info">
                <h2>Saldo:</h2>
                <h2>{user.saldo} €</h2>
            </div>
            <div className="account-info">
                <h2>Puntos:</h2>
                <h2>{user.puntos_totales}</h2>
            </div>
            <button className="btn-change-password">Cambiar Contraseña</button>
            <button className="btn-logout" onClick={handleLogout}>Salir de mi cuenta</button>
        </div>
    );
};

export default MiCuentaDatos;
