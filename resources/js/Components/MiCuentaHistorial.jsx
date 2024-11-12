import React from 'react';
import { usePage } from '@inertiajs/react';

const MiCuentaHistorial = () => {
    const { compras = [] } = usePage().props; // Asegura que compras sea un array

    return (
        <div className="historial-compras">
            <h2>Historial de Compras</h2>
            {compras.length === 0 ? (
                <h3>No tienes compras registradas.</h3>
            ) : (
                compras.map((compra, index) => (
                    <div key={index} className="compra">
                        <h3>Compra realizada el {new Date(compra.fecha_compra).toLocaleDateString()}</h3>
                        <p>Total: {compra.total}€</p>
                        <h4>Detalles de los productos:</h4>
                        <ul>
                            {compra.entradas.map((entrada, i) => (
                                <li key={i}>
                                    {entrada.tipo.charAt(0).toUpperCase() + entrada.tipo.slice(1)} x {entrada.pivot.cantidad}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default MiCuentaHistorial;
