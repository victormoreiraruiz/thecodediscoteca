import React from 'react';

const NuestraHistoria = () => {
  return (
    <div>
      <h2>Nuestra Historia</h2>
      <div className="contenedor">
        <img src="/imagenes/puesta.jpg" alt="Puesta de sol de Sanlúcar de Barrameda" />
        <h3>
          Nacidos en la tierra de la manzanilla, las carreras de caballos, los langostinos y las
          increíbles puestas de sol. En Sanlúcar de Barrameda no podíamos olvidarnos del ocio nocturno.
          Así nace The Code.
        </h3>
      </div>
      <div className="contenedor">
        <h3>
          En el año 2012 The Code abre sus puertas, con la intención de fomentar el ocio nocturno en los
          sanluqueños y los muchos turistas que visitan nuestra ciudad.
        </h3>
        <img src="/imagenes/fachada.png" alt="La discoteca The Code vista desde fuera" />
      </div>
      <div className="contenedor">
        <img src="/imagenes/disco.png" alt="La discoteca The Code desde dentro" />
        <h3>
          The Code cuenta a día de hoy con más de 100.000 asistentes al año, convirtiéndose
          así en uno de los clubes nocturnos referentes en Andalucía.
        </h3>
      </div>
    </div>
  );
};

export default NuestraHistoria;
