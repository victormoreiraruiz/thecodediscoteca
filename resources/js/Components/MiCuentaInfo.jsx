import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import TablaCompras from './TablaCompras';

const MiCuentaInfo = () => {
    const { user, compras = [], reservas = [] } = usePage().props; // Props globales
    const [selectedOption, setSelectedOption] = useState(null); // Estado para la opción seleccionada
    const [expandedItems, setExpandedItems] = useState({ compras: null, reservas: null }); // Estado del acordeón
    const [sortOption, setSortOption] = useState('fecha'); // Estado para la ordenación
    const [ingresos, setIngresos] = useState([]); // Estado para los ingresos
    const [notificaciones, setNotificaciones] = useState([]);
    const [nuevasNotificaciones, setNuevasNotificaciones] = useState(0); // Estado para notificaciones no leídas

    const sortedReservas = reservas.slice().sort((a, b) => {
        if (sortOption === 'fecha') {
            return new Date(a.fecha_reserva) - new Date(b.fecha_reserva);
        } else if (sortOption === 'creacion') {
            return new Date(b.created_at) - new Date(a.created_at);
        }
        return 0;
    });

    if (!user) return <p style={{ color: '#fff' }}>Cargando datos del usuario...</p>;
    const comprasFiltradas = compras.filter(compra => compra.entradas && compra.entradas.length > 0);

    // Fetch de notificaciones al cargar el componente
    useEffect(() => {
        const fetchNotificaciones = async () => {
            try {
                const response = await axios.get('/notificaciones');
                setNotificaciones(response.data);

                // Calcular las no leídas
                const noLeidas = response.data.filter(notificacion => !notificacion.leido).length;
                setNuevasNotificaciones(noLeidas); // Actualiza el estado con la cantidad de no leídas
            } catch (error) {
                console.error('Error al obtener las notificaciones:', error);
            }
        };

        fetchNotificaciones();
    }, []); // Ejecutar solo una vez al cargar el componente

    // Marcar todas como leídas al ver las notificaciones
    useEffect(() => {
        if (selectedOption === 2) { // Cuando selecciona "Notificaciones"
            const marcarTodasComoLeidas = async () => {
                try {
                    await axios.put('/notificaciones/marcar-todas-leidas'); // Ruta para marcar todas como leídas
                    setNotificaciones((prev) => prev.map((n) => ({ ...n, leido: true })));
                    setNuevasNotificaciones(0); // Resetea el contador de nuevas notificaciones
                } catch (error) {
                    console.error('Error al marcar todas como leídas:', error);
                }
            };

            marcarTodasComoLeidas();
        }
    }, [selectedOption]);

    // Fetch de ingresos si se selecciona "Mis Ingresos"
    useEffect(() => {
        if (selectedOption === 1) {
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

    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`/notificaciones/${id}/visto`);
            setNotificaciones((prev) =>
                prev.map((n) =>
                    n.id === id ? { ...n, leido: true } : n
                )
            );
        } catch (error) {
            console.error('Error al marcar como leída:', error);
        }
    };

    const userItems = [
        {
            label: 'Mi Perfil',
            detail: (
                <div>
                    <p><strong>Nombre:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Saldo:</strong> {user.saldo} €</p>
                    <p><strong>Puntos:</strong> {user.puntos_totales}</p>
                    <button
                        className="mi-cuenta-boton-password"
                        onClick={() => handleAddSaldo()}
                        style={{
                            marginTop: '10px',
                            color: '#000000',
                            background: '#e5cc70',
                            border: 'none',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            borderRadius: '5px',
                        }}
                    >
                        Añadir Saldo
                    </button>
                </div>
            ),
        },
        { label: 'Mis Ingresos', detail: `Los ingresos por sus eventos realizados son de ${user.ingresos || 0} €` },
        { 
            label: `Notificaciones${nuevasNotificaciones > 0 ? ` (${nuevasNotificaciones})` : ''}`, 
            detail: 'Aquí puedes ver tus notificaciones.',
        },
    ];
    

    const staticItems = [
        {
            label: 'Mis Compras',
            detail: <TablaCompras compras={compras} />, // Utiliza el nuevo componente
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
                        <div key={index} style={{ marginBottom: '15px' }}>
                            <div>
                                <Link href={`/mi-cuenta/eventos/${reserva.id +1}`} style={{ color: '#e5cc70' }}>
                                    Reserva para el {new Date(reserva.fecha_reserva).toLocaleDateString()} - Sala: {reserva.sala.tipo_sala}
                                </Link>
                            </div>
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
            </div>

            <div className="mi-cuenta-detalles">
                {selectedOption === 1 ? (  // Si selecciona "Mis Ingresos"
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
                ) : selectedOption === 2 ? (
                    <div>
                        <h3>Tus Notificaciones</h3>
                        {Array.isArray(notificaciones) && notificaciones.length > 0 ? (
                            <ul>
                                {notificaciones.map((notificacion, index) => (
                                    <li key={index} style={{ marginBottom: '10px' }}>
                                        <p style={{ color: notificacion.leido ? '#aaa' : '#fff' }}>
                                            {notificacion.mensaje}
                                        </p>
                                        
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No tienes notificaciones pendientes.</p>
                        )}
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
