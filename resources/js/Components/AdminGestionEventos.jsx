import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

const AdminGestionEventos = ({ eventos }) => {
    const [loading, setLoading] = useState(null); // Carga por evento
    const [error, setError] = useState(null);
    const [eventosList, setEventos] = useState(eventos);
    const [motivoCancelacion, setMotivoCancelacion] = useState(""); // Estado para el motivo
    const [eventoAEliminar, setEventoAEliminar] = useState(null); // Evento seleccionado para eliminar
    const [orden, setOrden] = useState({ campo: 'fecha_evento', asc: true }); // Estado para la ordenación
    const [search, setSearch] = useState(''); // Estado para la búsqueda por texto
    const [filtroFecha, setFiltroFecha] = useState({ desde: '', hasta: '' }); // Estado para el filtro por rango de fechas

    const handleMotivoChange = (e) => {
        setMotivoCancelacion(e.target.value);
    };

    const actualizarEstadoEvento = async (id, nuevoEstado) => {
        setLoading((prevLoading) => ({ ...prevLoading, [id]: true }));
        setError(null);

        try {
            const response = await fetch(route('admin.actualizarEstadoEvento', { id }), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ estado: nuevoEstado }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estado del evento.');
            }

            const updatedEventos = eventosList.map(evento =>
                evento.id === id ? { ...evento, estado: nuevoEstado } : evento
            );
            setEventos(updatedEventos);

            alert('Estado del evento actualizado exitosamente!');
        } catch (error) {
            console.error(error);
            alert('Hubo un error al intentar actualizar el estado del evento.');
        } finally {
            setLoading((prevLoading) => ({ ...prevLoading, [id]: false }));
        }
    };

    const eliminarEvento = async () => {
        if (!motivoCancelacion) {
            alert('Por favor, ingrese un motivo para cancelar el evento.');
            return;
        }

        setLoading((prevLoading) => ({ ...prevLoading, [eventoAEliminar.id]: true }));
        setError(null);

        try {
            const response = await fetch(route('admin.eliminarEvento', { id: eventoAEliminar.id }), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ motivo_cancelacion: motivoCancelacion }),
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el evento.');
            }

            const updatedEventos = eventosList.filter(evento => evento.id !== eventoAEliminar.id);
            setEventos(updatedEventos);
            setMotivoCancelacion("");
            setEventoAEliminar(null);

            alert('Evento eliminado exitosamente!');
        } catch (error) {
            console.error(error);
            alert('Hubo un error al intentar eliminar el evento.');
        } finally {
            setLoading((prevLoading) => ({ ...prevLoading, [eventoAEliminar.id]: false }));
        }
    };

    const cancelarEliminacion = () => {
        setEventoAEliminar(null);
        setMotivoCancelacion("");
    };

    const ordenarEventos = (campo) => {
        const esAscendente = orden.campo === campo ? !orden.asc : true;
        const eventosOrdenados = [...eventosList].sort((a, b) => {
            if (a[campo] < b[campo]) return esAscendente ? -1 : 1;
            if (a[campo] > b[campo]) return esAscendente ? 1 : -1;
            return 0;
        });
        setOrden({ campo, asc: esAscendente });
        setEventos(eventosOrdenados);
    };

    const filtrarPorFecha = (eventos) => {
        const { desde, hasta } = filtroFecha;
        if (!desde || !hasta) return eventos;

        const fechaDesde = new Date(desde).setHours(0, 0, 0, 0);
        const fechaHasta = new Date(hasta).setHours(23, 59, 59, 999);

        return eventos.filter(evento => {
            const fechaEvento = new Date(evento.fecha_evento).getTime();
            return fechaEvento >= fechaDesde && fechaEvento <= fechaHasta;
        });
    };

    // Filtrar eventos por texto y rango de fechas
    const eventosFiltrados = filtrarPorFecha(eventosList).filter(evento =>
        evento.nombre_evento.toLowerCase().includes(search.toLowerCase()) ||
        (evento.sala?.tipo_sala.toLowerCase().includes(search.toLowerCase()) || '') ||
        evento.estado.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h3>Gestión de Eventos</h3>
            {error && <div className="error">{error}</div>}

    
            <div className="usuarios-table">
            <div className="busqueda-texto">
                <input
                    type="text"
                    placeholder="Buscar por nombre, sala o estado"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        marginBottom: '10px',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        width: '100%',
                    }}
                />
            </div>
            <div className="filtro-fechas">
                    <label>
                        Desde:
                        <input
                            type="date"
                            value={filtroFecha.desde}
                            onChange={(e) => setFiltroFecha({ ...filtroFecha, desde: e.target.value })}
                        />
                    </label>
                    <label>
                        Hasta:
                        <input
                            type="date"
                            value={filtroFecha.hasta}
                            onChange={(e) => setFiltroFecha({ ...filtroFecha, hasta: e.target.value })}
                        />
                    </label>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => ordenarEventos('nombre_evento')}>Nombre</th>
                            <th onClick={() => ordenarEventos('fecha_evento')}>Fecha</th>
                            <th onClick={() => ordenarEventos('sala')}>Sala</th>
                            <th onClick={() => ordenarEventos('estado')}>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventosFiltrados.length > 0 ? (
                            eventosFiltrados.map(evento => (
                                <tr key={evento.id}>
                                    <td>{evento.nombre_evento}</td>
                                    <td>{evento.fecha_evento}</td>
                                    <td>{evento.sala?.tipo_sala || 'Sin sala'}</td>
                                    <td>
                                        <select
                                            value={evento.estado || 'pendiente'}
                                            onChange={(e) => actualizarEstadoEvento(evento.id, e.target.value)}
                                            disabled={loading && loading[evento.id]}
                                            style={{
                                                backgroundColor: '#f0f0f0',
                                                color: '#000',
                                                padding: '5px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            <option value="pendiente">Pendiente</option>
                                            <option value="apto">Apto</option>
                                            <option value="denegado">Denegado</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => setEventoAEliminar(evento)}
                                            disabled={loading && loading[evento.id]}
                                        >
                                            {loading && loading[evento.id] ? 'Eliminando...' : 'Eliminar'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No hay eventos disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>{eventoAEliminar && (
                <div className="modal">
                    <h4>Motivo de la cancelación</h4>
                    <textarea
                        value={motivoCancelacion}
                        onChange={handleMotivoChange}
                        placeholder="Escribe el motivo de la cancelación"
                        rows="4"
                        cols="50"
                    ></textarea>
                    <br />
                    <button onClick={eliminarEvento}>Confirmar Eliminación</button>
                    <button onClick={cancelarEliminacion}>Cancelar</button>
                </div>
            )}
            </div>

            
        </div>
    );
};

export default AdminGestionEventos;
