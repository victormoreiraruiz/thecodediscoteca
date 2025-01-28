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

     // Ordena los eventos según la opción seleccionada (por fecha o por fecha de creación).
    const sortedEventos = eventos.slice().sort((a, b) => { 
        if (sortOption === 'fecha') {
            return new Date(a.fecha_evento) - new Date(b.fecha_evento);
        } else if (sortOption === 'creacion') {
            return new Date(b.created_at) - new Date(a.created_at);
        }
        return 0;
    });
   
     // Maneja la cancelación de eventos
    const handleCancelEvent = async (evento) => {
        const fechaEvento = new Date(evento.fecha_evento);// Convertimos la fecha del evento a un objeto Date.
        const hoy = new Date(); // Obtenemos la fecha actual
        hoy.setHours(0, 0, 0, 0); // Ajustamos la hora para comparar solo las fechas
    
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
    // Filtra las compras que tienen entradas asociadas
    const comprasFiltradas = compras.filter(compra => compra.entradas && compra.entradas.length > 0);

     // Efecto para cargar las notificaciones del usuario al montar el componente.
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

        fetchNotificaciones(); // Llama a la función para obtener las notificaciones.
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

    
    const handleAddSaldo = () => {
        Inertia.visit('/añadir-saldo');
    };
   

    const userItems = [
        {
            label: 'Mi Perfil',
            detail: (
                <div className="overflow-x-auto mt-6 flex flex-col items-center">
    <table className="w-full max-w-lg border-2 border-[#860303] rounded-lg shadow-lg overflow-hidden">
        <thead>
            <tr className="bg-gradient-to-r from-[#860303] to-[#b20505] text-[#e5cc70] text-lg font-semibold uppercase">
                <th className="px-6 py-3 text-left">Detalle</th>
                <th className="px-6 py-3 text-left">Información</th>
            </tr>
        </thead>
        <tbody className="bg-[#e5cc70] text-[#860303] divide-y divide-[#860303]">
            <tr className="hover:bg-[#f0d77b] transition duration-200">
                <td className="px-6 py-4 font-bold">Nombre:</td>
                <td className="px-6 py-4">{user.name}</td>
            </tr>
            <tr className="hover:bg-[#f0d77b] transition duration-200">
                <td className="px-6 py-4 font-bold">Email:</td>
                <td className="px-6 py-4">{user.email}</td>
            </tr>
            <tr className="hover:bg-[#f0d77b] transition duration-200">
                <td className="px-6 py-4 font-bold">Saldo:</td>
                <td className="px-6 py-4">{user.saldo} €</td>
            </tr>
            <tr className="hover:bg-[#f0d77b] transition duration-200">
                <td className="px-6 py-4 font-bold">Puntos:</td>
                <td className="px-6 py-4">{user.puntos_totales}</td>
            </tr>
            <tr className="hover:bg-[#f0d77b] transition duration-200">
                <td className="px-6 py-4 font-bold">Membresía:</td>
                <td className="px-6 py-4">{user.membresia}</td>
            </tr>
        </tbody>
    </table>

    <button
        onClick={handleAddSaldo}
        className="mt-6 bg-[#860303] text-[#e5cc70] px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-[#a80505] transition duration-300"
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
        </div>
    );
};

export default MiCuentaInfo;
