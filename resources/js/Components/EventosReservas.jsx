import React from 'react';
import { Inertia } from '@inertiajs/inertia';

const EventosReservas = () => {
  const handleReservar = (ruta) => {
    Inertia.visit(ruta);
  };

  return (
    <div className="reservation-section">
      <div className="reservation-item">
        <img src="/imagenes/salaprivada.jpg" alt="Sala Privada" className="reservation-image" />
        <div className="reservation-content">
          <h4>Nuestra Sala Privada</h4>
          <p>
            Con una capacidad de hasta mil personas, equipada con la última tecnología en imagen,
            sonido e iluminación, nuestra sala privada es la ideal para desfiles, cocteles, entregas de premio… y cualquier evento privado que pueda imaginar.
          </p>
          <button className="reserve-button" onClick={() => handleReservar('/salaprivada')}>
            SABER MÁS
          </button>
        </div>
      </div>

      <div className="reservation-item reverse">
        <img src="/imagenes/salacelebraciones.jpeg" alt="Sala de Celebraciones" className="reservation-image" />
        <div className="reservation-content">
          <h4>Sala de Celebraciones</h4>
          <p>
            El espacio ideal para aquellos eventos más reducidos, pero no por ello menos importantes.
            Con nuestro sello de calidad y atención, y con un aforo de hasta 150 personas, todo tiene cabida en The Code.
          </p>
          <button className="reserve-button" onClick={() => handleReservar('/salacelebraciones')}>
          SABER MÁS
          </button>
        </div>
      </div>

      <div className="reservation-item">
        <img src="/imagenes/salaconferencias.jpg" alt="Nuestro Sello de Calidad" className="reservation-image" />
        <div className="reservation-content">
          <h4>Sala de Conferencias</h4>
          <p>
            Para los amantes de la privacidad y la discreción The Code también cuenta con un espacio para vosotros.
            Un salón totalmente independiente a las demás zonas, servicio privado, y listo para desaparecer.
          </p>
          <button className="reserve-button" onClick={() => handleReservar('/salaconferencias')}>
          SABER MÁS
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventosReservas;
