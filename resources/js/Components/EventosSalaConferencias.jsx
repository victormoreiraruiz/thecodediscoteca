import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const EventosSalaConferencias = () => {
  const [motivo, setMotivo] = useState('');
  const [numeroPersonas, setNumeroPersonas] = useState(30);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  // Definir fetchBookedDates como una función para obtener las fechas ocupadas
  const fetchBookedDates = async () => {
    try {
      const response = await axios.get('/api/salas/1/reservas'); // Cambia '1' por el id de la sala actual
      setBookedDates(response.data);
    } catch (error) {
      console.error('Error al cargar las fechas de reservas:', error);
    }
  };

  useEffect(() => {
    fetchBookedDates(); // Llama a fetchBookedDates al cargar el componente
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date); // Establece la fecha seleccionada
  };

  const isDateBooked = (date) => {
    return bookedDates.some(
      (bookedDate) => new Date(bookedDate).toDateString() === date.toDateString()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      alert('Por favor, selecciona una fecha disponible en el calendario.');
      return;
    }

    // Ajustar la fecha a la zona horaria local para evitar desfases
    const adjustedDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

    try {
      await axios.post('/api/salas/1/reservar', {
        fecha_reserva: adjustedDate,
        descripcion: motivo,
        asistentes: numeroPersonas,
      });

      alert('Reserva creada exitosamente');
      setMotivo('');
      setNumeroPersonas(30);
      setSelectedDate(null);
      fetchBookedDates(); // Recargar fechas reservadas después de crear la reserva
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      alert('Hubo un error al crear la reserva. Inténtalo de nuevo.');
    }
  };

  return (
    <div>
      <h2>Sala de Conferencias</h2>
      <br />

      <div className="info-container">
        <img src="/imagenes/salaconferencias.jpg" alt="Sala de Conferencias" className="reservation-image" />
        <h3 className="reservation-description">
          El espacio ideal para aquellos eventos más reducidos, pero no por ello menos importantes.
          Con nuestro sello de calidad y atención, y con un aforo de hasta 150 personas, todo tiene cabida en The Code.
        </h3>
      </div>

      {/* Calendario */}
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          minDate={new Date()} // Evita seleccionar fechas pasadas
          tileClassName={({ date }) => isDateBooked(date) ? 'booked-date' : null}
        />
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="event-form">
        <label>
          ¿Para qué desea la sala?
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Describa el evento o motivo"
            required
            className="event-textarea"
          />
        </label>

        <label>
          Número de personas:
          <select
            value={numeroPersonas}
            onChange={(e) => setNumeroPersonas(Number(e.target.value))}
            className="event-select"
          >
            {[...Array(5)].map((_, index) => (
              <option key={index} value={(index + 1) * 40}>
                {(index + 1) * 40}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="event-submit-button">RESERVAR</button>
      </form>
    </div>
  );
};

export default EventosSalaConferencias;
