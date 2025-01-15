import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/app.css'; // Asegura que este CSS se carga después del de react-calendar



const EventosSalaCelebraciones = () => {
  const [motivo, setMotivo] = useState('');
  const [numeroPersonas, setNumeroPersonas] = useState(40);
  const [tipoReserva, setTipoReserva] = useState('privada');
  const [precioEntrada, setPrecioEntrada] = useState('');
  const [nombreConcierto, setNombreConcierto] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [cartel, setCartel] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [acceptPolicies, setAcceptPolicies] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBookedDates = async () => {
    try {
      const response = await axios.get('/api/salas/2/reservas');
      setBookedDates(response.data);
    } catch (error) {
      console.error('Error al cargar las fechas de reservas:', error);
    }
  };

  useEffect(() => {
    fetchBookedDates();
  }, []);

  const handleDateChange = (date) => {
    if (!isDateBooked(date)) {
      setSelectedDate(date);
    }
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
      Swal.fire({
        icon: 'warning',
        title: 'Políticas de la sala',
        text: 'Debes aceptar las políticas de la sala antes de continuar.',
      });
      return;
    }

    if (!selectedDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Fecha requerida',
        text: 'Por favor, selecciona una fecha disponible en el calendario.',
      });
      return;
    }

    if (
      tipoReserva === 'concierto' &&
      (!precioEntrada || !nombreConcierto || !horaInicio || !horaFin)
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Por favor, completa todos los campos obligatorios para el concierto.',
      });
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
      await axios.post('/api/salas/2/reservar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Swal.fire({
        icon: 'success',
        title: 'Reserva creada',
        text: 'Reserva creada exitosamente. Se ha generado la factura.',
      });

      setMotivo('');
      setNumeroPersonas(40);
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
      if (error.response && error.response.status === 403) {
        // Si el error es por falta de permisos, mostrar un alert y redirigir
        if (error.response.data.error === 'Solo los promotores o administradores pueden realizar reservas.') {
            const confirmRedirect = window.confirm(
                'No tienes permisos para realizar reservas. ¿Quieres convertirte en promotor?'
            );
            if (confirmRedirect) {
                window.location.href = '/convertir-promotor';
            }
        }
    } else {
        console.error('Error al crear la reserva:', error);
        alert('Hubo un error al crear la reserva. Inténtalo de nuevo.');
    }
}
};

  return (
    <div>
      <h2>Sala de Celebraciones</h2>
      <div className="calendar-container">
      <Calendar
  onChange={handleDateChange}
  value={selectedDate}
  minDate={new Date()} // Evita que se seleccionen fechas pasadas
  className="w-[380px] p-4 bg-[#e5cc70] rounded-lg shadow-lg border border-gray-300"
  tileClassName={({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return 'text-gray-400 pointer-events-none'; // Días pasados en gris y no seleccionables
    }
    if (isDateBooked(date)) {
      return 'bg-[#860303] text-white font-semibold rounded-md'; // Fechas ocupadas en rojo oscuro
    }
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      return 'bg-black text-white font-semibold rounded-md'; // Fecha seleccionada en negro
    }
    return 'hover:bg-gray-200 rounded-md'; // Hover en días normales
  }}
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
              <h3>Hora de fin:</h3>
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
              <input type="number" value={precioEntrada} onChange={(e) => setPrecioEntrada(e.target.value)} min="0" step="0.01" required />
            </label>
            <label>
            <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Describa el evento o motivo"
            required
            className="event-textarea"
          />
            </label>
          </>
        )}

        <label className="accept-policies">
          <input type="checkbox" checked={acceptPolicies} onChange={(e) => setAcceptPolicies(e.target.checked)} />
          <h3>He leído y acepto las <a href="/politica-privacidad">políticas de la sala</a></h3>
        </label>

        <button type="submit" className="event-submit-button" disabled={loading}>
          {loading ? 'Reservando...' : 'RESERVAR'}
        </button>
      </form>
    </div>
  );
};

export default EventosSalaCelebraciones;
