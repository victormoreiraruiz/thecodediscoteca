import React from 'react';

const NuestraHistoria = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center text-[#e5cc70] mb-12">Nuestra Historia</h2>
      <div className="flex flex-col md:flex-row items-center mb-12">
        <img
          src="/imagenes/puesta.jpg"
          alt="Puesta de sol de Sanlúcar de Barrameda"
          className="w-full md:w-1/2 rounded-lg shadow-lg"
        />
        <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
          <h3 className="text-xl md:text-2xl font-semibold text-[#e5cc70]">
            Nacidos en la tierra de la manzanilla, las carreras de caballos, los langostinos y las
            increíbles puestas de sol. En Sanlúcar de Barrameda no podíamos olvidarnos del ocio nocturno.
            Así nace The Code.
          </h3>
        </div>
      </div>

      <div className="flex flex-col md:flex-row-reverse items-center mb-12">
        <img
          src="/imagenes/fachada.png"
          alt="La discoteca The Code vista desde fuera"
          className="w-full md:w-1/2 rounded-lg shadow-lg"
        />
        <div className="w-full md:w-1/2 md:pr-8 mt-6 md:mt-0">
          <h3 className="text-xl md:text-2xl font-semibold text-[#e5cc70]">
            En el año 2012 The Code abre sus puertas, con la intención de fomentar el ocio nocturno en los
            sanluqueños y los muchos turistas que visitan nuestra ciudad.
          </h3>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center">
        <img
          src="/imagenes/disco.png"
          alt="La discoteca The Code desde dentro"
          className="w-full md:w-1/2 rounded-lg shadow-lg"
        />
        <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
          <h3 className="text-xl md:text-2xl font-semibold text-[#e5cc70]">
            The Code cuenta a día de hoy con más de 100.000 asistentes al año, convirtiéndose
            así en uno de los clubes nocturnos referentes en Andalucía.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default NuestraHistoria;
