import React from 'react';
import { Inertia } from '@inertiajs/inertia';

const EventosReservas = () => {
  const handleReservar = (ruta) => {
    Inertia.visit(ruta);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Sala Privada */}
      <div className="flex flex-col md:flex-row items-center mb-12">
        <img
          src="/imagenes/salaprivada.jpg"
          alt="Sala Privada"
          className="w-full md:w-1/2 rounded-lg shadow-lg"
        />
        <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0 flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-2xl font-bold text-[#e5cc70] mb-4">Nuestra Sala Privada</h4>
          <p className="text-lg text-white mb-6">
            Con una capacidad de hasta mil personas, equipada con la última tecnología en imagen,
            sonido e iluminación, nuestra sala privada es la ideal para desfiles, cócteles, entregas de premios…
            y cualquier evento privado que pueda imaginar.
          </p>
          <button
            className="bg-[#e5cc70] text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-500 transition-transform hover:scale-105"
            onClick={() => handleReservar('/salaprivada')}
          >
            SABER MÁS
          </button>
        </div>
      </div>

      {/* Sala de Celebraciones */}
      <div className="flex flex-col md:flex-row-reverse items-center mb-12">
        <img
          src="/imagenes/salacelebraciones.jpeg"
          alt="Sala de Celebraciones"
          className="w-full md:w-1/2 rounded-lg shadow-lg"
        />
        <div className="w-full md:w-1/2 md:pr-8 mt-6 md:mt-0 flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-2xl font-bold text-[#e5cc70] mb-4">Sala de Celebraciones</h4>
          <p className="text-lg text-white mb-6">
            El espacio ideal para aquellos eventos más reducidos, pero no por ello menos importantes.
            Con nuestro sello de calidad y atención, y con un aforo de hasta 150 personas, todo tiene cabida en The Code.
          </p>
          <button
            className="bg-[#e5cc70] text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-500 transition-transform hover:scale-105"
            onClick={() => handleReservar('/salacelebraciones')}
          >
            SABER MÁS
          </button>
        </div>
      </div>

      {/* Sala de Conferencias */}
      <div className="flex flex-col md:flex-row items-center">
        <img
          src="/imagenes/salaconferencias.jpg"
          alt="Sala de Conferencias"
          className="w-full md:w-1/2 rounded-lg shadow-lg"
        />
        <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0 flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-2xl font-bold text-[#e5cc70] mb-4">Sala de Conferencias</h4>
          <p className="text-lg text-white mb-6">
            Para los amantes de la privacidad y la discreción, The Code también cuenta con un espacio para vosotros.
            Un salón totalmente independiente a las demás zonas, servicio privado y listo para desaparecer.
          </p>
          <button
            className="bg-[#e5cc70] text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-500 transition-transform hover:scale-105"
            onClick={() => handleReservar('/salaconferencias')}
          >
            SABER MÁS
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventosReservas;
