import React from 'react';

const EventosInformacion = () => {
  return (
    <div className="informacion-container">
      {/* Imagen recortada */}
      <div className="header-section">
        <img
          src="/imagenes/EventoInformacion.png"
          alt="Evento Principal"
          className="header-image w-full h-64 object-cover object-center"
        />
      </div>

      {/* Texto introductorio */}
      <div className="intro-section px-4 py-6 text-center">
        <h4 className="text-xl font-bold">THE CODE EVENTOS</h4>
        <br />
        <h5 className="text-base leading-7">
          The Code te permite la posibilidad de crear tu propio evento en la posiblemente mejor sala de Sanlúcar de Barrameda.
          <br />
          Organiza tu evento en el mismo lugar donde han actuado los mejores artistas de la última década.
          <br />
          Pero esto no es el pasado, ve hacia nuestro futuro.
          <br />
          Bienvenidos a sala The Code Eventos. Estás en casa.
        </h5>
      </div>
    </div>
  );
};

export default EventosInformacion;
