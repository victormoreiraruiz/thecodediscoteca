import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const EventosSalaConferencias = () => {
  const [motivo, setMotivo] = useState('');
  const [numeroPersonas, setNumeroPersonas] = useState(30);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]); // Guarda fechas ocupadas

  // Cargar las fechas ocupadas al montar el componente
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await axios.get('/api/salas/1/reservas'); // Cambia '1' por el id de la sala actual
        setBookedDates(response.data); // Asume que response.data es un array de fechas ocupadas
      } catch (error) {
        console.error('Error al cargar las fechas de reservas:', error);
      }
    };

    fetchBookedDates();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Motivo: ${motivo}\nNúmero de personas: ${numeroPersonas}\nFecha de reserva: ${selectedDate}`);
  };

  const isDateDisabled = (date) => {
    // Verifica si la fecha está en las fechas ocupadas
    return bookedDates.some(
      (bookedDate) => new Date(bookedDate).toDateString() === date.toDateString()
    );
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
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileDisabled={({ date }) => isDateDisabled(date)} // Desactiva las fechas ocupadas
      />

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

export default EventosSalaConferencias;
