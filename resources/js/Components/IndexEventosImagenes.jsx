import React from 'react';
import { Link } from '@inertiajs/react';

const IndexEventosImagenes = () => {
  return (
    <div className="conciertosyeventos flex space-x-4">
      {/* Redirige a la página de eventos */}
      <Link href="/eventos">
        <img src="/imagenes/eventos.png" alt="Cartel de eventos" className="cursor-pointer" />
      </Link>

      {/* Redirige a la página de conciertos */}
      <Link href="/conciertos">
        <img src="/imagenes/conciertos.png" alt="Cartel de conciertos" className="cursor-pointer" />
      </Link>
    </div>
  );
};

export default IndexEventosImagenes;
