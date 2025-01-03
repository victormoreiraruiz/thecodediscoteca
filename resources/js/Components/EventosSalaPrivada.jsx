import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const EventosSalaPrivada = () => {
  const [motivo, setMotivo] = useState('');
  const [numeroPersonas, setNumeroPersonas] = useState(30);
  const [tipoReserva, setTipoReserva] = useState('privada');
  const [precioEntrada, setPrecioEntrada] = useState('');
  const [nombreConcierto, setNombreConcierto] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [cartel, setCartel] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [acceptPolicies, setAcceptPolicies] = useState(false); // Estado para aceptar las políticas
  const [loading, setLoading] = useState(false); // Estado de carga para la reserva

  const fetchBookedDates = async () => {
    try {
      const response = await axios.get('/api/salas/1/reservas');
      setBookedDates(response.data);
      
    } catch (error) {
      console.error('Error al cargar las fechas de reservas:', error);
    }
  };

  useEffect(() => {
    fetchBookedDates();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const isDateBooked = (date) => {
    return bookedDates.some(
      (bookedDate) => new Date(bookedDate).toDateString() === date.toDateString()
    );
  };

  const handleCartelChange = (e) => {
    setCartel(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptPolicies) {
      alert('Debes aceptar las políticas de la sala antes de continuar.');
      return;
    }

    if (!selectedDate) {
      alert('Por favor, selecciona una fecha disponible en el calendario.');
      return;
    }

    if (
      tipoReserva === 'concierto' &&
      (!precioEntrada || !nombreConcierto || !horaInicio || !horaFin)
    ) {
      alert('Por favor, completa todos los campos obligatorios para el concierto.');
      return;
    }

    const adjustedDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

    const formData = new FormData();
    formData.append('fecha_reserva', adjustedDate);
    formData.append('descripcion', motivo);
    formData.append('asistentes', numeroPersonas);
    formData.append('tipo_reserva', tipoReserva);
    formData.append('precio_entrada', tipoReserva === 'concierto' ? precioEntrada : null);
    formData.append('nombre_concierto', tipoReserva === 'concierto' ? nombreConcierto : '');
    formData.append('hora_inicio', tipoReserva === 'concierto' ? horaInicio : '');
    formData.append('hora_fin', tipoReserva === 'concierto' ? horaFin : '');
    if (cartel) {
      formData.append('cartel', cartel);
    }

    try {
      setLoading(true);

      const response = await axios.post('/api/salas/1/reservar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });


      alert('Reserva creada exitosamente. Se ha generado la factura.');
      setMotivo('');
      setNumeroPersonas(30);
      setTipoReserva('privada');
      setPrecioEntrada('');
      setNombreConcierto('');
      setHoraInicio('');
      setHoraFin('');
      setCartel(null);
      setSelectedDate(null);
      setAcceptPolicies(false);
      fetchBookedDates();
    } catch (error) {
      console.error('Error al crear la reserva o generar la factura:', error);
      alert('Hubo un error al crear la reserva o generar la factura. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Sala Privada</h2>
      <div className="info-container">
        <img src="/imagenes/salaprivada.jpg" alt="Sala Privada" className="reservation-image" />
        <h3 className="reservation-description">
          El espacio ideal para aquellos eventos más reducidos, pero no por ello menos importantes.
          Con nuestro sello de calidad y atención, y con un aforo de hasta 150 personas, todo tiene cabida en The Code.
        </h3>
      </div>

      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          minDate={new Date()}
          tileClassName={({ date }) => (isDateBooked(date) ? 'booked-date' : null)}
        />
      </div>

      <form onSubmit={handleSubmit} className="event-form">
        <label>
          <h3>Número de personas:</h3>
          
          <select
            value={numeroPersonas}
            onChange={(e) => setNumeroPersonas(Number(e.target.value))}
            className="event-select"
          >
            {[...Array(6)].map((_, index) => (
              <option key={index} value={(index + 1) * 50}>
                {(index + 1) * 50}
              </option>
            ))}
          </select>
        </label>

        <label>
        <h3>Tipo de reserva:</h3> 
          <select
            value={tipoReserva}
            onChange={(e) => setTipoReserva(e.target.value)}
            required
          >
            <option value="privada">Privada</option>
            <option value="concierto">Concierto</option>
          </select>
        </label>

        {tipoReserva === 'concierto' && (
          <>
            <label>
            <h3>Nombre del concierto:</h3>
              
              <input
                type="text"
                value={nombreConcierto}
                onChange={(e) => setNombreConcierto(e.target.value)}
                placeholder="Nombre del concierto"
                required
              />
            </label>

            <label>
            <h3>Hora de inicio:</h3>
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
              />
            </label>

            <label>
            <h3> Hora de fin:</h3>
              <input
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                required
              />
            </label>

            <label>
            <h3>Cartel del concierto:</h3>
              <input type="file" onChange={handleCartelChange} accept="image/*" required />
            </label>

            <label>
            <h3>Precio de entrada (€):</h3>
              
              <input
                type="number"
                value={precioEntrada}
                onChange={(e) => setPrecioEntrada(e.target.value)}
                placeholder="Precio por entrada"
                min="0"
                step="0.01"
                required
              />
            </label>
          </>
        )}

        <label>
        <h3> Describa en qué consiste el evento:</h3>
         
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Describa el evento o motivo"
            required
            className="event-textarea"
          />
        </label>

        <label className="accept-policies">
          <input
            type="checkbox"
            checked={acceptPolicies}
            onChange={(e) => setAcceptPolicies(e.target.checked)}
          />
          <h3>He leído y acepto las políticas de la sala</h3>
          
        </label>

        <button type="submit" className="event-submit-button" disabled={loading}>
          {loading ? 'Reservando...' : 'RESERVAR'}
        </button>
      </form>
    </div>
  );
};

export default EventosSalaPrivada;
