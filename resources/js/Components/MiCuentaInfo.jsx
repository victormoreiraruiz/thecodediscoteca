import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import TablaCompras from './TablaCompras';
import TablaNotificaciones from './TablaNotificaciones';
import TablaEventos from './TablaEventos';

const MiCuentaInfo = () => {
    const { user, compras = [], eventos = [] } = usePage().props; // Cambiado de reservas a eventos
    const [selectedOption, setSelectedOption] = useState(null);
    const [sortOption, setSortOption] = useState('fecha');
    const [ingresos, setIngresos] = useState([]);
    const [notificaciones, setNotificaciones] = useState([]);
    const [nuevasNotificaciones, setNuevasNotificaciones] = useState(0);


    const sortedEventos = eventos.slice().sort((a, b) => {
        if (sortOption === 'fecha') {
            return new Date(a.fecha_evento) - new Date(b.fecha_evento);
        } else if (sortOption === 'creacion') {
            return new Date(b.created_at) - new Date(a.created_at);
        }
        return 0;
    });
   
    const handleCancelEvent = async (evento) => {
        const fechaEvento = new Date(evento.fecha_evento);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
    
        if (fechaEvento <= hoy) {
            alert('No se puede cancelar un evento para el mismo día o días pasados.');
            return;
        }
    
        if (!confirm('¿Estás seguro de que deseas cancelar este evento?')) {
            return;
        }
    
        try {
            const response = await axios.delete(`/api/reservas/${evento.reserva_id}`);
            alert(response.data.message || 'Evento cancelado con éxito.');
            location.reload();
        } catch (error) {
            console.error('Error al cancelar el evento:', error);
            console.error('Respuesta del servidor:', error.response?.data);
            alert('Hubo un problema al cancelar el evento. Inténtalo nuevamente.');
        }
    };

    if (!user) return <p style={{ color: '#fff' }}>Cargando datos del usuario...</p>;
    const comprasFiltradas = compras.filter(compra => compra.entradas && compra.entradas.length > 0);

    useEffect(() => {
        const fetchNotificaciones = async () => {
            try {
                const response = await axios.get('/notificaciones');
                setNotificaciones(response.data);
                const noLeidas = response.data.filter(notificacion => !notificacion.leido).length;
                setNuevasNotificaciones(noLeidas);
            } catch (error) {
                console.error('Error al obtener las notificaciones:', error);
            }
        };

        fetchNotificaciones();
    }, []);

    useEffect(() => {
        if (selectedOption === 2) {
            const marcarTodasComoLeidas = async () => {
                try {
                    await axios.put('/notificaciones/marcar-todas-leidas');
                    setNotificaciones(prev => prev.map(n => ({ ...n, leido: true })));
                    setNuevasNotificaciones(0);
                } catch (error) {
                    console.error('Error al marcar todas como leídas:', error);
                }
            };

            marcarTodasComoLeidas();
        }
    }, [selectedOption]);

    useEffect(() => {
        if (selectedOption === 1) {
            const fetchIngresos = async () => {
                try {
                    const response = await axios.get('/mi-cuenta/ingresos');
                    setIngresos(response.data);
                } catch (error) {
                    console.error('Error al obtener los ingresos:', error);
                }
            };
            fetchIngresos();
        }
    }, [selectedOption]);

    const totalIngresos = ingresos
        .map(ingreso => ingreso.total_ingresos)
        .reduce((total, ingreso) => total + ingreso, 0)
        .toFixed(2);

       

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
            detail: <TablaNotificaciones notificaciones={notificaciones} />,
        },
    ];

    const staticItems = [
        {
            label: 'Mis Compras',
            detail: <TablaCompras compras={compras} />,
        },
        {
            label: 'Mis Eventos',
            detail: <TablaEventos eventos={eventos} />,
        }
    ]

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
                {selectedOption === 1 ? (
                    <div>
                        <h3>Historial de Ingresos</h3>
                        <p><strong>Ingresos Totales: {totalIngresos} €</strong></p>
                        <ul>
                            {ingresos.length > 0 ? (
                                ingresos.sort((a, b) => new Date(b.fecha_evento) - new Date(a.fecha_evento)).map((ingreso, index) => (
                                    <li key={index} className="ingreso">
                                        {`+${ingreso.total_ingresos} € por la venta de entradas del evento ${ingreso.nombre_evento}`}
                                    </li>
                                ))
                            ) : (
                                <p>No tienes movimientos registrados.</p>
                            )}
                        </ul>
                    </div>
                     ) : selectedOption === 2 ? (
                        <div>
                            <TablaNotificaciones notificaciones={notificaciones} />
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
