import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

const MiCuentaInfo = () => {
    const { user, compras = [], reservas = [] } = usePage().props; // Props globales
    const [selectedOption, setSelectedOption] = useState(null); // Estado para la opción seleccionada
    const [expandedItems, setExpandedItems] = useState({ compras: null, reservas: null }); // Estado del acordeón
    const [sortOption, setSortOption] = useState('fecha'); // Estado para la ordenación

    if (!user) return <p style={{ color: '#fff' }}>Cargando datos del usuario...</p>;

    // Función para manejar la expansión de un ítem (compras o reservas)
    const toggleExpand = (type, index) => {
        setExpandedItems((prev) => ({
            ...prev,
            [type]: prev[type] === index ? null : index, // Alterna entre expandir y colapsar
        }));
    };

    // Ordenar reservas según la opción seleccionada
    const sortedReservas = reservas.slice().sort((a, b) => {
        if (sortOption === 'fecha') {
            return new Date(a.fecha_reserva) - new Date(b.fecha_reserva); // Proximidad
        } else if (sortOption === 'creacion') {
            return new Date(b.created_at) - new Date(a.created_at); // Creación (descendente)
        }
        return 0;
    });

    // Función para cancelar una reserva
    const handleCancelReservation = async (reserva) => {
        const fechaReserva = new Date(reserva.fecha_reserva);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaReserva <= hoy) {
            alert('No se puede cancelar una reserva para el mismo día o días pasados.');
            return;
        }

        if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
            return;
        }

        try {
            const response = await axios.delete(`/api/reservas/${reserva.id}`);
            alert(response.data.message || 'Reserva cancelada con éxito.');
            location.reload();
        } catch (error) {
            console.error('Error al cancelar la reserva:', error);
            alert('Hubo un problema al cancelar la reserva. Inténtalo nuevamente.');
        }
    };

    // Opciones dinámicas para datos del usuario
    const userItems = [
        { label: 'Nombre', detail: user.name },
        { label: 'Email', detail: user.email },
        { label: 'Saldo', detail: `${user.saldo} €` },
        { label: 'Puntos', detail: user.puntos_totales },
    ];

    // Opciones para "Mis Compras" y "Mis Reservas"
    const staticItems = [
        {
            label: 'Mis Compras',
            detail: compras.length > 0 ? (
                compras.map((compra, index) => (
                    <div key={index}>
                        <div
                            style={{ cursor: 'pointer', color: '#e5cc70', marginBottom: '10px' }}
                            onClick={() => toggleExpand('compras', index)}
                        >
                            Compra realizada el {new Date(compra.fecha_compra).toLocaleDateString()} - Total: {compra.total}€
                        </div>
                        {expandedItems.compras === index && (
                            <div style={{ marginLeft: '20px' }}>
                                <h3>Detalles de los productos:</h3>
                                <ul>
                                    {compra.entradas.map((entrada, i) => (
                                        <li key={i}>
                                            {entrada.tipo.charAt(0).toUpperCase() + entrada.tipo.slice(1)} x {entrada.pivot.cantidad}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No tienes compras registradas.</p>
            ),
        },
        {
            label: 'Mis Reservas',
            detail: reservas.length > 0 ? (
                <>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="sort" style={{ color: 'white', marginRight: '10px' }}>Ordenar por:</label>
                        <select
                            id="sort"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            style={{ padding: '5px', borderRadius: '5px' }}
                        >
                            <option value="fecha">Proximidad</option>
                            <option value="creacion">Creación</option>
                        </select>
                    </div>
                    {sortedReservas.map((reserva, index) => {
                        const fechaReserva = new Date(reserva.fecha_reserva);
                        const hoy = new Date();
                        hoy.setHours(0, 0, 0, 0);
                        const esPasada = fechaReserva < hoy;

                        return (
                            <div key={index}>
                                <div
                                    style={{
                                        cursor: 'pointer',
                                        color: esPasada ? 'red' : '#e5cc70',
                                        marginBottom: '10px',
                                    }}
                                    onClick={() => toggleExpand('reservas', index)}
                                >
                                    Reserva para el {fechaReserva.toLocaleDateString()} - Sala: {reserva.sala.tipo_sala}
                                </div>
                                {expandedItems.reservas === index && (
                                    <div style={{ marginLeft: '20px' }}>
                                        <h3>Descripción: {reserva.descripcion}</h3>
                                        {!esPasada && (
                                            <button
                                                style={{
                                                    marginTop: '10px',
                                                    color: '#e5cc70',
                                                    background: 'none',
                                                    border: '1px solid #e5cc70',
                                                    padding: '8px 16px',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => handleCancelReservation(reserva)}
                                            >
                                                Cancelar Reserva
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </>
            ) : (
                <p>No tienes reservas registradas.</p>
            ),
        },
    ];

    const items = [...userItems, ...staticItems];

    // Función para cerrar sesión
    const handleLogout = () => {
        Inertia.post('/logout', {}, {
            onFinish: () => {
                Inertia.visit('/');
            },
        });
    };

    // Función para redirigir a la página "Añadir Saldo"
    const handleAddSaldo = () => {
        Inertia.visit('/añadir-saldo');
    };

    return (
        <div className="mi-cuenta-container">
            {/* Lista de elementos en la columna izquierda */}
            <div className="mi-cuenta-campos">
                <h2 className="mi-cuenta-titulo">Mi Cuenta</h2>
                <ul className="mi-cuenta-lista">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className={`mi-cuenta-item ${selectedOption === index ? 'selected' : ''}`}
                            onClick={() => setSelectedOption(index)}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>

                {/* Botón "Añadir Saldo" */}
                <button
                    className="mi-cuenta-boton-password"
                    onClick={handleAddSaldo}
                >
                    Añadir Saldo
                </button>
            </div>

            {/* Detalle seleccionado en el centro */}
            <div className="mi-cuenta-detalles">
                {selectedOption !== null ? (
                    <div className="mi-cuenta-detalle-info">{items[selectedOption].detail}</div>
                ) : (
                    <p className="mi-cuenta-mensaje">Selecciona un elemento para ver los detalles.</p>
                )}
            </div>

            {/* Botones de acción debajo */}
            <div className="mi-cuenta-container" style={{ position: 'relative' }}>
                <div className="mi-cuenta-acciones">
                    <button
                        className="mi-cuenta-boton-logout"
                        onClick={handleLogout}
                    >
                        Salir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MiCuentaInfo;
