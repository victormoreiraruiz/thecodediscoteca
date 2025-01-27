import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Swal from "sweetalert2";

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

    useEffect(() => {
        const fetchDiasOcupados = async () => {
            try {
                const response = await fetch(route('eventos.diasOcupados'));
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
        
            // SweetAlert para éxito
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Evento creado exitosamente',
            });
        
            // Resetear los campos del formulario
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
            // SweetAlert para error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Hubo un problema al crear el evento.',
            });
        
            setError(error.message);
        } finally {
            setLoading(false);
        }
        
    };

    const resaltarDias = ({ date }) => {
        const fecha = date.toISOString().split('T')[0];
        if (diasOcupados.includes(fecha)) return 'dia-ocupado';
        if (fecha === fechaEvento) return 'dia-seleccionado';
        return null;
    };

    const deshabilitarDiasPasados = ({ date }) => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return date < hoy || diasOcupados.includes(date.toISOString().split('T')[0]);
    };

    return (
        <div className="crear-evento-form">
            <h3 className="text-[#860303] font-bold text-2xl mb-4">Crear Nuevo Evento</h3>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nombreEvento" style={{ color: 'black', fontWeight: 'bold' }}>Nombre del Evento</label>
                    <input
                        type="text"
                        id="nombreEvento"
                        value={nombreEvento}
                        onChange={(e) => setNombreEvento(e.target.value)}
                        required
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                </div>
                <div>
                    <label htmlFor="descripcion" style={{ color: 'black', fontWeight: 'bold' }}>Descripción</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                </div>
                <div>
                    <label htmlFor="fechaEvento" style={{ color: 'black', fontWeight: 'bold' }}>Fecha del Evento</label>
                    <Calendar
                        onChange={(date) => setFechaEvento(date.toISOString().split('T')[0])}
                        tileClassName={resaltarDias}
                        tileDisabled={deshabilitarDiasPasados}
                        value={fechaEvento ? new Date(fechaEvento) : null}
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                </div>
                <div>
                    <label htmlFor="horaInicio" style={{ color: 'black', fontWeight: 'bold' }}>Hora de Inicio</label>
                    <input
                        type="time"
                        id="horaInicio"
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                        required
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                </div>
                <div>
                    <label htmlFor="horaFinal" style={{ color: 'black', fontWeight: 'bold' }}>Hora de Finalización</label>
                    <input
                        type="time"
                        id="horaFinal"
                        value={horaFinal}
                        onChange={(e) => setHoraFinal(e.target.value)}
                        required
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                </div>
                <div>
                    <label htmlFor="cartel" style={{ color: 'black', fontWeight: 'bold' }}>Cartel del Evento</label>
                    <input
                        type="file"
                        id="cartel"
                        onChange={(e) => setCartel(e.target.files[0])}
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                </div>
                <div>
                    <label htmlFor="precioNormal" style={{ color: 'black', fontWeight: 'bold' }}>Precio Normal</label>
                    <input
                        type="number"
                        id="precioNormal"
                        value={precioNormal}
                        onChange={(e) => setPrecioNormal(e.target.value)}
                        required
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                </div>
              
                <div>
                    <label htmlFor="precioVip" style={{ color: 'black', fontWeight: 'bold' }}>Precio Vip</label>
                    <input
                        type="number"
                        id="precioVip"
                        value={precioVip}
                        onChange={(e) => setPrecioVip(e.target.value)}
                        required
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                </div>  
                <div>
                    <label htmlFor="precioPremium" style={{ color: 'black', fontWeight: 'bold' }}>Precio Premium</label>
                    <input
                        type="number"
                        id="precioPremium"
                        value={precioPremium}
                        onChange={(e) => setPrecioPremium(e.target.value)}
                        required
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#860303] text-white font-semibold px-4 py-2 rounded hover:bg-red-700 mt-4 w-full"
                >
                    {loading ? 'Creando Evento...' : 'Crear Evento'}
                </button>
            </form>
        </div>
    );
};

export default AdminCrearEvento;
