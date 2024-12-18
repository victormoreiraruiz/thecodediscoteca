import React, { useState } from 'react';

const AdminCrearEvento = ({ salas, setEventos }) => {
    const [nombreEvento, setNombreEvento] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaEvento, setFechaEvento] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFinal, setHoraFinal] = useState('');
    const [cartel, setCartel] = useState(null);
    const [salaId, setSalaId] = useState(null);  // Este es el estado para la sala seleccionada
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            nombre_evento: nombreEvento,
            descripcion,
            fecha_evento: fechaEvento,
            hora_inicio: horaInicio,
            hora_final: horaFinal,
            cartel,
            sala_id: salaId,  // Asegúrate de enviar el ID de la sala
        };

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(route('admin.crearEvento'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error al crear el evento');
            }

            // Si el evento se crea con éxito, actualizamos la lista de eventos
            const nuevoEvento = await response.json(); // Asumimos que el backend responde con el evento creado
            setEventos(prevEventos => [...prevEventos, nuevoEvento]);

            alert('Evento creado exitosamente');
            // Limpiar formulario después de crear el evento
            setNombreEvento('');
            setDescripcion('');
            setFechaEvento('');
            setHoraInicio('');
            setHoraFinal('');
            setCartel(null);
            setSalaId(null);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="crear-evento-form">
            <h3>Crear Nuevo Evento</h3>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nombreEvento">Nombre del Evento</label>
                    <input
                        type="text"
                        id="nombreEvento"
                        value={nombreEvento}
                        onChange={(e) => setNombreEvento(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="fechaEvento">Fecha del Evento</label>
                    <input
                        type="date"
                        id="fechaEvento"
                        value={fechaEvento}
                        onChange={(e) => setFechaEvento(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="horaInicio">Hora de Inicio</label>
                    <input
                        type="time"
                        id="horaInicio"
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="horaFinal">Hora de Finalización</label>
                    <input
                        type="time"
                        id="horaFinal"
                        value={horaFinal}
                        onChange={(e) => setHoraFinal(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="cartel">Cartel del Evento</label>
                    <input
                        type="file"
                        id="cartel"
                        onChange={(e) => setCartel(e.target.files[0])}
                    />
                </div>
                <div>
                    <label htmlFor="salaId">Sala</label>
                    <select
                        id="salaId"
                        value={salaId}
                        onChange={(e) => setSalaId(e.target.value)}
                        required
                    >
                        <option value="">Seleccione una Sala</option>
                        {salas && salas.map(sala => (
                            <option key={sala.id} value={sala.id}>
                                {sala.tipo_sala} - Capacidad: {sala.capacidad}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creando Evento...' : 'Crear Evento'}
                </button>
            </form>
        </div>
    );
};

export default AdminCrearEvento;
