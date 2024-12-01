import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import { Link } from '@inertiajs/react';

const MiCuentaInfo = () => {
    const { user, compras = [], reservas = [] } = usePage().props; // Props globales
    const [selectedOption, setSelectedOption] = useState(null); // Estado para la opción seleccionada
    const [expandedItems, setExpandedItems] = useState({ compras: null, reservas: null }); // Estado del acordeón
    const [sortOption, setSortOption] = useState('fecha'); // Estado para la ordenación
    const [ingresos, setIngresos] = useState([]); // Estado para los ingresos

    if (!user) return <p style={{ color: '#fff' }}>Cargando datos del usuario...</p>;

    useEffect(() => {
        if (selectedOption === 4) {  // Solo cuando se selecciona "Mis Ingresos"
            const fetchIngresos = async () => {
                try {
                    const response = await axios.get('/mi-cuenta/ingresos');
                    console.log('Datos de ingresos:', response.data); // Verifica los datos aquí
                    setIngresos(response.data);
                } catch (error) {
                    console.error('Error al obtener los ingresos:', error);
                }
            };
            fetchIngresos();
        }
    }, [selectedOption]);

    // Calcular ingresos totales: Es importante sumar solo los ingresos únicos y asegurarse de que no haya duplicados
    const totalIngresos = ingresos
        .map(ingreso => ingreso.total_ingresos)  // Extrae los ingresos individuales
        .reduce((total, ingreso) => total + ingreso, 0)  // Suma los ingresos
        .toFixed(2);

    const toggleExpand = (type, index) => {
        setExpandedItems((prev) => ({
            ...prev,
            [type]: prev[type] === index ? null : index,
        }));
    };

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

    const userItems = [
        { label: 'Nombre', detail: "Su nombre es " + user.name + "." },
        { label: 'Email', detail: "Su email es " + user.email + "." },
        { label: 'Saldo', detail: "Su saldo actual es de " + `${user.saldo} €` },
        { label: 'Puntos', detail: "Dispone de un total de " + user.puntos_totales + " puntos." },
        { label: 'Mis Ingresos', detail: `Los ingresos por sus eventos realizados son de ${user.ingresos || 0} €` },
    ];

    const sortedReservas = reservas.slice().sort((a, b) => {
        if (sortOption === 'fecha') {
            return new Date(a.fecha_reserva) - new Date(b.fecha_reserva);
        } else if (sortOption === 'creacion') {
            return new Date(b.created_at) - new Date(a.created_at);
        }
        return 0;
    });

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
                                            <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                {Array.from({ length: entrada.pivot.cantidad }).map((_, qrIndex) => (
                                                    <img
                                                        key={qrIndex}
                                                        src={`/storage/qrcodes/compra_${compra.id}_entrada_${entrada.id}_n${qrIndex + 1}.png`}
                                                        alt={`QR Entrada ${entrada.id} - ${qrIndex + 1}`}
                                                        style={{ width: '150px', height: '150px' }}
                                                    />
                                                ))}
                                            </div>
                                        </li>
                                    ))}
                                    <a 
                                        href={`/mi-cuenta/compras/${compra.id}/descargar-pdf`} 
                                        className="btn btn-primary"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Descargar PDF
                                    </a>
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
            label: 'Mis Eventos',
        detail: reservas.length > 0 ? (
            <div>
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
                {sortedReservas.map((reserva, index) => (
    <div key={index}>
        <div
            style={{ cursor: 'pointer', color: '#e5cc70', marginBottom: '10px' }}
            onClick={() => toggleExpand('reservas', index)}
        >
            {/* Este es el enlace que lleva a la página del evento */}
            <Link href={`/mi-cuenta/eventos/${reserva.id +1 }`} style={{ color: '#e5cc70' }}>
                Reserva para el {new Date(reserva.fecha_reserva).toLocaleDateString()} - Sala: {reserva.sala.tipo_sala}
            </Link>
        </div>
                        {expandedItems.reservas === index && (
                            <div style={{ marginLeft: '20px' }}>
                                <h3>Descripción: {reserva.descripcion}</h3>
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
                            </div>
                        )}
                    </div>
                ))}
            </div>
        ) : (
            <p>No tienes reservas registradas.</p>
        ),
    },
];

    const items = [...userItems, ...staticItems];

    const handleLogout = () => {
        Inertia.post('/logout', {}, {
            onFinish: () => {
                Inertia.visit('/');
            },
        });
    };

    const handleAddSaldo = () => {
        Inertia.visit('/añadir-saldo');
    };

 

    const selectedItem = items[selectedOption] || { detail: null };

    return (
        <div className="mi-cuenta-container">
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
                <button className="mi-cuenta-boton-password" onClick={handleAddSaldo}>
                    Añadir Saldo
                </button>
            </div>

            <div className="mi-cuenta-detalles">
                {selectedOption === 4 ? (  // Si selecciona "Mis Ingresos"
                    <div>
                        <h3>Historial de Ingresos</h3>
                        <p><strong>Ingresos Totales: {totalIngresos} €</strong></p>
                        <ul>
                            {ingresos.length > 0 ? (
                                ingresos.sort((a, b) => new Date(b.fecha_evento) - new Date(a.fecha_evento)).map((ingreso, index) => (
                                    <li key={index} className="ingreso">
                                        {`+${ingreso.total_ingresos} € por la venta de entradas del evento ${ingreso.nombre_evento} `}
                                    </li>
                                ))
                            ) : (
                                <p>No tienes movimientos registrados.</p>
                            )}
                        </ul>
                    </div>
                ) : selectedItem.detail ? (
                    <div className="mi-cuenta-detalle-info">{selectedItem.detail}</div>
                ) : (
                    <p className="mi-cuenta-mensaje">Selecciona un elemento para ver los detalles.</p>
                )}
            </div>

            <div className="mi-cuenta-container" style={{ position: 'relative' }}>
                <div className="mi-cuenta-acciones">
                    <button className="mi-cuenta-boton-logout" onClick={handleLogout}>
                        Salir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MiCuentaInfo;
