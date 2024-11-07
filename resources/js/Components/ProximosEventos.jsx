// ProximosEventos.jsx
import React from 'react';
import { Link } from '@inertiajs/react';

const ProximosEventos = () => {
  return (
    <div>
      <h2>PRÓXIMOS EVENTOS</h2>
      <div className="grande">
                    <Link href="/fiesta"><img src="/imagenes/cartel1.png" alt="Cartel de fiestas" /></Link>
                    <Link href="/fiesta"><img src="/imagenes/cartel2.png" alt="Cartel de fiestas" /></Link>
                    <Link href="/fiesta"><img src="/imagenes/cartel3.png" alt="Cartel de fiestas" /></Link>
                    <Link href="/fiesta"><img src="/imagenes/cartel4.png" alt="Cartel de fiestas" /></Link>
                </div>
      </div>
  );
};

export default ProximosEventos;
