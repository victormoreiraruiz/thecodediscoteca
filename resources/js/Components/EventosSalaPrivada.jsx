import React, { useState } from 'react';

const EventosSalaPrivada = () => {
  const [motivo, setMotivo] = useState('');
  const [numeroPersonas, setNumeroPersonas] = useState(30);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Motivo: ${motivo}\nNúmero de personas: ${numeroPersonas}`);
  };

  return (
    <div>
      <h2>Sala de Privada</h2>
      <br />

      {/* Contenedor para imagen y descripción */}
      <div className="info-container">
        <img src="/imagenes/salaprivada.jpg" alt="Sala Privada" className="reservation-image" />
        <h3 className="reservation-description">
          El espacio ideal para aquellos eventos más reducidos, pero no por ello menos importantes.
          Con nuestro sello de calidad y atención, y con un aforo de hasta 150 personas, todo tiene cabida en The Code.
        </h3>
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
            {[...Array(8)].map((_, index) => (
              <option key={index} value={(index + 1) * 10}>
                {(index + 1) * 10}
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
