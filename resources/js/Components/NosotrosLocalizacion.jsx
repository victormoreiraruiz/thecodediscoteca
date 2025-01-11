import React from 'react';

const NosotrosLocalizacion = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-[#e5cc70] mb-4">Nuestra Localización</h2>
      <hr className="w-1/3 border-t-2 border-[#e5cc70] mb-8" />

      <div className="w-full">
        <img
          src="/imagenes/mapa.png"
          alt="Ubicación The Code"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default NosotrosLocalizacion;
