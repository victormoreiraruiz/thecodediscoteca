import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';

const AdminGestionEventos = ({ eventos }) => {
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [eventosList, setEventos] = useState(eventos);
    const [motivoCancelacion, setMotivoCancelacion] = useState("");
    const [eventoAEliminar, setEventoAEliminar] = useState(null);
    const [orden, setOrden] = useState({ campo: 'fecha_evento', asc: true });
    const [search, setSearch] = useState('');
    const [filtroFecha, setFiltroFecha] = useState({ desde: '', hasta: '' });

    const handleMotivoChange = (e) => {
        setMotivoCancelacion(e.target.value);
    };

    const actualizarEstadoEvento = async (id, nuevoEstado) => {
        // Establece el estado de carga en `true` para el evento con el ID proporcionado.
        setLoading((prevLoading) => ({ ...prevLoading, [id]: true }));
        // Reinicia el estado de error a `null` para limpiar errores previos.
        setError(null);
    
        try {
            // Realiza una solicitud `PUT` al servidor para actualizar el estado del evento.
            const response = await fetch(route('admin.actualizarEstadoEvento', { id }), {
                method: 'PUT', // Especifica que es una actualización (PUT).
                headers: {
                    'Content-Type': 'application/json', // Define el tipo de contenido como JSON.
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content, // Incluye el token CSRF para la protección.
                },
                body: JSON.stringify({ estado: nuevoEstado }), // Envía el nuevo estado como cuerpo de la solicitud.
            });
    
            // Si la respuesta no es exitosa, lanza un error.
            if (!response.ok) {
                throw new Error('Error al actualizar el estado del evento.');
            }
    
            // Actualiza la lista de eventos con el nuevo estado del evento correspondiente.
            const updatedEventos = eventosList.map(evento =>
                evento.id === id ? { ...evento, estado: nuevoEstado } : evento
            );
            setEventos(updatedEventos); // Establece la lista actualizada en el estado.
    
            
            Swal.fire({
                icon: 'success', 
                title: 'Estado actualizado', 
                text: 'El estado del evento se ha actualizado exitosamente.', 
                confirmButtonColor: '#e5cc70', 
                customClass: {
                   
                    confirmButton: 'bg-[#860303] text-white px-10 py-2 rounded-lg hover:bg-red-700',
                },
            });
        } catch (error) {
            // Maneja los errores y muestra un SweetAlert con el mensaje de error.
            console.error(error);
            Swal.fire({
                icon: 'error', 
                title: 'Error', 
                text: 'Hubo un error al intentar actualizar el estado del evento.', 
                confirmButtonColor: '#860303', 
                customClass: {
                    
                    confirmButton: 'bg-[#860303] text-white px-10 py-2 rounded-lg hover:bg-red-700',
                },
            });
        } finally {
            // Establece el estado de carga en `false` para el evento con el ID proporcionado.
            setLoading((prevLoading) => ({ ...prevLoading, [id]: false }));
        }
    };
    

    const eliminarEvento = async () => {
        // Verifica si se ha proporcionado un motivo para la cancelación.
        if (!motivoCancelacion) {
            Swal.fire({
                icon: 'warning',
                title: 'Motivo requerido',
                text: 'Por favor, ingrese un motivo para cancelar el evento.',
                confirmButtonColor: '#860303',
                customClass: {
                    confirmButton: 'bg-[#860303] text-white px-10 py-2 rounded-lg hover:bg-red-700',
                },
            });
            return; // Detiene la ejecución si no se ha proporcionado un motivo.
        }
    
        // Establece el estado de carga en `true` para el evento que se está eliminando.
        setLoading((prevLoading) => ({ ...prevLoading, [eventoAEliminar.id]: true }));
        setError(null); // Reinicia el estado de error.
    
        try {
            // Realiza una solicitud DELETE al servidor para eliminar el evento.
            const response = await fetch(route('admin.eliminarEvento', { id: eventoAEliminar.id }), {
                method: 'DELETE', // Método HTTP DELETE.
                headers: {
                    'Content-Type': 'application/json', // Define el tipo de contenido como JSON.
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content, // Incluye el token CSRF para la protección.
                },
                body: JSON.stringify({ motivo_cancelacion: motivoCancelacion }), // Envía el motivo de cancelación como cuerpo de la solicitud.
            });
    
            // Si la respuesta no es exitosa, lanza un error.
            if (!response.ok) {
                throw new Error('Error al eliminar el evento.');
            }
    
            // Filtra el evento eliminado de la lista de eventos.
            const updatedEventos = eventosList.filter(evento => evento.id !== eventoAEliminar.id);
            setEventos(updatedEventos); // Actualiza la lista de eventos en el estado.
            setMotivoCancelacion(""); // Reinicia el motivo de cancelación.
            setEventoAEliminar(null); // Limpia el evento seleccionado para eliminar.
    
            Swal.fire({
                icon: 'success',
                title: 'Evento eliminado',
                text: 'El evento ha sido eliminado exitosamente.',
                confirmButtonColor: '#e5cc70',
                customClass: {
                    confirmButton: 'bg-[#860303] text-white px-10 py-2 rounded-lg hover:bg-red-700',
                },
            });
        } catch (error) {
            
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al intentar eliminar el evento.',
                confirmButtonColor: '#860303',
                customClass: {
                    confirmButton: 'bg-[#860303] text-white px-10 py-2 rounded-lg hover:bg-red-700',
                },
            });
        } finally {
            // Establece el estado de carga en `false` para el evento eliminado.
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
       
        const { desde, hasta } = filtroFecha; // Extrae las fechas "desde" y "hasta" del filtro de fecha.
        if (!desde || !hasta) return eventos;// Si no se han seleccionado ambas fechas, devuelve la lista completa de eventos sin filtrar.
        const fechaDesde = new Date(desde).setHours(0, 0, 0, 0);  // Convierte la fecha "desde" al inicio del día (00:00:00).
        const fechaHasta = new Date(hasta).setHours(23, 59, 59, 999);  // Convierte la fecha "hasta" al final del día (23:59:59).
    
        // Filtra los eventos según las fechas seleccionadas.
        return eventos.filter(evento => {
            const fechaEvento = new Date(evento.fecha_evento).getTime(); // Convierte la fecha del evento a un timestamp 
            return fechaEvento >= fechaDesde && fechaEvento <= fechaHasta; // Devuelve los eventos cuya fecha esté dentro del rango "desde" y "hasta".
        });
    };
    
    // buscar por nombre, sala y estado
    const eventosFiltrados = filtrarPorFecha(eventosList).filter(evento =>
        evento.nombre_evento.toLowerCase().includes(search.toLowerCase()) || // filtra nombre
        (evento.sala?.tipo_sala.toLowerCase().includes(search.toLowerCase()) || '') ||  // filtra sala
        evento.estado.toLowerCase().includes(search.toLowerCase())  // filtra estado
    );
    
    return (
        <div className="admin-gestion-eventos">
            {error && <div className="mensaje-error">{error}</div>}

            <div className="contenedor-filtros">
                <input
                    type="text"
                    placeholder="Buscar por nombre, sala o estado"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input-busqueda border border-gray-300 rounded px-3 py-2 w-full"
                />
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
            </div>

            <table className="tabla-eventos w-full border-collapse">
                <thead>
                    <tr className="bg-[#860303] text-white">
                        <th onClick={() => ordenarEventos('nombre_evento')} className="p-3 cursor-pointer">Nombre</th>
                        <th onClick={() => ordenarEventos('fecha_evento')} className="p-3 cursor-pointer">Fecha</th>
                        <th onClick={() => ordenarEventos('sala.tipo_sala')} className="p-3 cursor-pointer">Sala</th>
                        <th onClick={() => ordenarEventos('estado')} className="p-3 cursor-pointer">Estado</th>
                        <th className="p-3">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {eventosFiltrados.length > 0 ? (
                        eventosFiltrados.map(evento => (
                            <tr key={evento.id} className="border-b bg-[#e5cc70] hover:bg-yellow-500">
                                <td className="p-3">
                                    <a href={`/mi-cuenta/eventos/${evento.id}`} className="text-[#860303] font-semibold underline">
                                        {evento.nombre_evento}
                                    </a>
                                </td>
                                <td className="p-3">{evento.fecha_evento}</td>
                                <td className="p-3">{evento.sala?.tipo_sala || 'Sin sala'}</td>
                                <td className="p-3">
                                    <select
                                        value={evento.estado || 'pendiente'}
                                        onChange={(e) => actualizarEstadoEvento(evento.id, e.target.value)}
                                        disabled={loading && loading[evento.id]}
                                        className="select-estado bg-white border border-gray-300 rounded px-2 py-1"
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="apto">Apto</option>
                                        <option value="denegado">Denegado</option>
                                    </select>
                                </td>
                                <td className="p-3">
                                    <button onClick={() => setEventoAEliminar(evento)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-2 rounded-md min-w-[80px] transition duration-300">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-3 text-center">No hay eventos disponibles.</td>
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
                    <button onClick={eliminarEvento} className="btn-confirmar">Confirmar Eliminación</button>
                    <button onClick={cancelarEliminacion} className="btn-cancelar">Cancelar</button>
                </div>
            )}
        </div>
    );
};

export default AdminGestionEventos;
