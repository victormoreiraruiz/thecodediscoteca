import React, { useState, useEffect } from 'react';

const AdminGestionEventos = ({ eventos }) => {
    const [loading, setLoading] = useState(null); // Ahora gestionamos un loading por evento
    const [error, setError] = useState(null);
    const [eventosList, setEventos] = useState(eventos);

    const eliminarEvento = async (eventoId) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            return;
        }

        setLoading((prevLoading) => ({ ...prevLoading, [eventoId]: true })); // Establecer carga individual por evento
        setError(null);

        try {
            const response = await fetch(route('admin.eliminarEvento', { id: eventoId }), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
                },
            });

            const updatedEventos = eventosList.filter(evento => evento.id !== eventoId);
            setEventos(updatedEventos);

            alert('Evento eliminado exitosamente!');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading((prevLoading) => ({ ...prevLoading, [eventoId]: false })); // Restablecer estado de carga
        }
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
                                    <td>{evento.nombre_evento}</td>
                                    <td>{evento.fecha_evento}</td>
                                    <td>{evento.sala ? evento.sala.tipo_sala : 'Sin sala'}</td> 
                                    <td>
                                        <button 
                                            onClick={() => eliminarEvento(evento.id)} 
                                            disabled={loading && loading[evento.id]}
                                        >
                                            {loading && loading[evento.id] ? 'Eliminando...' : 'Eliminar Evento'}
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
                </table>
            </div>
        </div>
    );
};

export default AdminGestionEventos;
