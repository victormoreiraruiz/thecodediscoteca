import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const AdminCrearEvento = () => {
    const [nombreEvento, setNombreEvento] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaEvento, setFechaEvento] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFinal, setHoraFinal] = useState('');
    const [cartel, setCartel] = useState(null);
    const [precioNormal, setPrecioNormal] = useState('');
    const [precioVip, setPrecioVip] = useState('');
    const [precioPremium, setPrecioPremium] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [diasOcupados, setDiasOcupados] = useState([]); 

    // Fetch para obtener los días ocupados
    useEffect(() => {
        const fetchDiasOcupados = async () => {
            try {
                const response = await fetch(route('eventos.diasOcupados')); // obtiene dias ocupados
                const data = await response.json();
                setDiasOcupados(data);
            } catch (err) {
                console.error('Error al obtener los días ocupados:', err);
            }
        };
        fetchDiasOcupados();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nombre_evento', nombreEvento);
        formData.append('descripcion', descripcion);
        formData.append('fecha_evento', fechaEvento);
        formData.append('hora_inicio', horaInicio);
        formData.append('hora_final', horaFinal);
        formData.append('cartel', cartel);
        formData.append('precio_normal', precioNormal);
        if (precioVip) formData.append('precio_vip', precioVip);
        if (precioPremium) formData.append('precio_premium', precioPremium);

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(route('admin.crearEvento'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear el evento');
            }

            alert('Evento creado exitosamente');
            setNombreEvento('');
            setDescripcion('');
            setFechaEvento('');
            setHoraInicio('');
            setHoraFinal('');
            setCartel(null);
            setPrecioNormal('');
            setPrecioVip('');
            setPrecioPremium('');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // marca dias ocupados y seleccionado
    const resaltarDias = ({ date }) => {
        const fecha = date.toISOString().split('T')[0]; // Convertir a formato YYYY-MM-DD
        if (diasOcupados.includes(fecha)) return 'dia-ocupado'; // Día ocupado
        if (fecha === fechaEvento) return 'dia-seleccionado'; // Día seleccionado
        return null; // Días normales
    };

    // Deshabilitar días pasados
    const deshabilitarDiasPasados = ({ date }) => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Ajustar la hora para comparar solo la fecha
        return date < hoy || diasOcupados.includes(date.toISOString().split('T')[0]);
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
                    <Calendar
                        onChange={(date) => setFechaEvento(date.toISOString().split('T')[0])} // Actualizar la fecha seleccionada
                        tileClassName={resaltarDias} // Aplicar clases a los días
                        tileDisabled={deshabilitarDiasPasados} // Deshabilitar días pasados
                        value={fechaEvento ? new Date(fechaEvento) : null} // Fecha seleccionada
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
                    <label htmlFor="precioNormal">Precio Normal</label>
                    <input
                        type="number"
                        id="precioNormal"
                        value={precioNormal}
                        onChange={(e) => setPrecioNormal(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="precioVip">Precio VIP (opcional)</label>
                    <input
                        type="number"
                        id="precioVip"
                        value={precioVip}
                        onChange={(e) => setPrecioVip(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="precioPremium">Precio Premium (opcional)</label>
                    <input
                        type="number"
                        id="precioPremium"
                        value={precioPremium}
                        onChange={(e) => setPrecioPremium(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creando Evento...' : 'Crear Evento'}
                </button>
            </form>
        </div>
    );
};

export default AdminCrearEvento;
