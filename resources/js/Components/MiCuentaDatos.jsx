// MiCuentaDatos.jsx
import React from 'react';

const MiCuentaDatos = ({ user }) => {
    // Verifica si 'user' está definido antes de mostrarlo
    if (!user) return <p>Cargando datos del usuario...</p>;

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
        </div>
    );
};

export default MiCuentaDatos;
