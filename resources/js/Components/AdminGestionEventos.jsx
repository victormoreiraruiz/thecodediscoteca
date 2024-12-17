import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

const AdminGestionEventos = ({ eventos }) => {
    const [loading, setLoading] = useState(null); // Carga por evento
    const [error, setError] = useState(null);
    const [eventosList, setEventos] = useState(eventos);
    const [motivoCancelacion, setMotivoCancelacion] = useState(""); // Estado para el motivo
    const [eventoAEliminar, setEventoAEliminar] = useState(null); // Evento seleccionado para eliminar

    const handleMotivoChange = (e) => {
        setMotivoCancelacion(e.target.value);
    };

    const eliminarEvento = async () => {
        if (!motivoCancelacion) {
            alert('Por favor, ingrese un motivo para cancelar el evento.');
            return;
        }

        if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            return;
        }

        setLoading((prevLoading) => ({ ...prevLoading, [eventoAEliminar.id]: true })); // Cargar evento individual
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

            const updatedEventos = eventosList.filter(evento => evento.id !== eventoAEliminar.id);
            setEventos(updatedEventos);
            setMotivoCancelacion(""); // Limpiar el motivo

            alert('Evento eliminado exitosamente!');
        } catch (error) {
            console.error(error);
            alert('Hubo un error al intentar eliminar el evento.');
        } finally {
            setLoading((prevLoading) => ({ ...prevLoading, [eventoAEliminar.id]: false })); // Terminar carga
        }
    };

    const handleEventClick = (id) => {
        Inertia.visit(`/eventos/${id}`);
    };

    return (
        <div>
            <h3>Gestión de Eventos</h3>
            {error && <div className="error">{error}</div>}

            <div className="usuarios-table">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre del Evento</th>
                            <th>Fecha</th>
                            <th>Sala</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventosList.length > 0 ? (
                            eventosList.map(evento => (
                                <tr key={evento.id}>
                                    <td>
                                    <a
        href={`/eventos/${evento.id}`}
    >
        {evento.nombre_evento}
    </a>
                                    </td>
                                    <td>{evento.fecha_evento}</td>
                                    <td>{evento.sala ? evento.sala.tipo_sala : 'Sin sala'}</td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                setEventoAEliminar(evento); // Guardar evento seleccionado
                                                setMotivoCancelacion(""); // Limpiar motivo
                                            }}
                                            disabled={loading && loading[evento.id]}
                                        >
                                            {loading && loading[evento.id] ? 'Eliminando...' : 'Eliminar Evento'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No hay eventos disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {eventoAEliminar && (
                    <div className="modal">
                        <h3>Motivo de cancelación</h3>
                        <textarea
                            value={motivoCancelacion}
                            onChange={handleMotivoChange}
                            placeholder="Escribe el motivo de la cancelación"
                            rows="4"
                            cols="50"
                        ></textarea>
                        <br />
                        <button onClick={eliminarEvento}>Confirmar Eliminación</button>
                        <button onClick={() => setEventoAEliminar(null)}>Cancelar</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminGestionEventos;
