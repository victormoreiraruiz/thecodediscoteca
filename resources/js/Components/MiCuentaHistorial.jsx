import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

const MiCuentaHistorial = () => {
    const { compras = [], reservas = [] } = usePage().props;
    const [activeCompra, setActiveCompra] = useState(null); // Para controlar qué compra está expandida
    const [activeReservation, setActiveReservation] = useState(null); // Para controlar qué reserva está expandida

    const toggleCompra = (index) => {
        setActiveCompra(activeCompra === index ? null : index);
    };

    const toggleReservation = (index) => {
        setActiveReservation(activeReservation === index ? null : index);
    };

    return (
        <div className="historial">
            <h2>Historial de Compras</h2>
            {compras.length === 0 ? (
                <h3>No tienes compras registradas.</h3>
            ) : (
                compras.map((compra, index) => (
                    <div key={index} className="compra">
                        <h3 onClick={() => toggleCompra(index)} style={{ cursor: 'pointer', color: 'blue' }}>
                            {activeCompra === index ? '▼ ' : '▶ '} Compra realizada el {new Date(compra.fecha_compra).toLocaleDateString()} - Total: {compra.total}€
                        </h3>
                        {activeCompra === index && (
                            <div className="compra-detalles" style={{ padding: '10px', border: '1px solid #ddd', marginTop: '5px' }}>
                                <h3>Detalles de los productos:</h3>
                                <ul>
                                    {compra.entradas.map((entrada, i) => (
                                        <li key={i} className="li-estilo-h3">
                                            {entrada.tipo.charAt(0).toUpperCase() + entrada.tipo.slice(1)} x {entrada.pivot.cantidad}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))
            )}

            <h2>Historial de Reservas</h2>
            {reservas.length === 0 ? (
                <h3>No tienes reservas registradas.</h3>
            ) : (
                reservas.map((reserva, index) => (
                    <div key={index} className="reserva">
                        <h3 onClick={() => toggleReservation(index)} style={{ cursor: 'pointer', color: 'blue' }}>
                            {activeReservation === index ? '▼ ' : '▶ '} {reserva.sala.tipo_sala.charAt(0).toUpperCase() + reserva.sala.tipo_sala.slice(1)} - {new Date(reserva.fecha_reserva).toLocaleDateString()}
                        </h3>
                        {activeReservation === index && (
                            <div className="reserva-detalles" style={{ padding: '10px', border: '1px solid #ddd', marginTop: '5px' }}>
                                <h3>Fecha de Reserva: {new Date(reserva.fecha_reserva).toLocaleDateString()}</h3>
                                <h3>Asistentes: {reserva.asistentes}</h3>
                                <p>Descripción: {reserva.descripcion}</p>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default MiCuentaHistorial;
