import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const EventosSalaPrivada = () => {
  const [motivo, setMotivo] = useState('');
  const [numeroPersonas, setNumeroPersonas] = useState(30);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [precio, setPrecio] = useState(250); // Estado para el precio de la sala

  const fetchBookedDates = async () => {
    try {
      const response = await axios.get('/api/salas/2/reservas');
      setBookedDates(response.data);
    } catch (error) {
      console.error('Error al cargar las fechas de reservas:', error);
    }
  };

  const fetchSalaDetails = async () => {
    try {
      const response = await axios.get('/api/salas/2'); // Supone que hay una ruta para obtener los detalles de la sala
      setPrecio(response.data.precio);
    } catch (error) {
      console.error('Error al obtener detalles de la sala:', error);
    }
  };

  useEffect(() => {
    fetchBookedDates();
    fetchSalaDetails();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
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

    const isAlreadyBooked = bookedDates.some(
      (bookedDate) => new Date(bookedDate).toDateString() === selectedDate.toDateString()
    );

    if (isAlreadyBooked) {
      alert('Esta fecha ya está reservada. Por favor, selecciona otra fecha.');
      return;
    }

    const adjustedDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

    try {
      const response = await axios.post('/api/salas/2/reservar', {
        fecha_reserva: adjustedDate,
        descripcion: motivo,
        asistentes: numeroPersonas,
      });

      alert(response.data.message); // Muestra el mensaje de éxito
      setMotivo('');
      setNumeroPersonas(30);
      setSelectedDate(null);
      fetchBookedDates();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert(error.response.data.error); // Muestra el mensaje de error si no tiene saldo suficiente
      } else {
        console.error('Error al crear la reserva:', error);
        alert('Hubo un problema al intentar crear la reserva. Inténtalo de nuevo.');
      }
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
        <h3 className="reservation-price">Precio: {precio}€</h3>
      </div>

      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          minDate={new Date()}
          tileClassName={({ date }) => isDateBooked(date) ? 'booked-date' : null}
        />
      </div>

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
              <option key={index} value={(index + 1) * 50}>
                {(index + 1) * 50}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="event-submit-button">RESERVAR</button>
      </form>
    </div>
  );
};

export default EventosSalaPrivada;
