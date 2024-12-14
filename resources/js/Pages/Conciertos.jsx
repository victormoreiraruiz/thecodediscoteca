import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import Carrito from '../Components/Carrito';
import { Link } from '@inertiajs/react';

export default function Conciertos({ conciertos }) {
   const [carrito, setCarrito] = useState([]);
      const [mostrarCarrito, setMostrarCarrito] = useState(false);
  return (
    <div>
      <Navigation />
      <Header />
      <h2>Conciertos Disponibles</h2>
      <div className="concerts-container">
        {conciertos.map((concierto) => (
          <div key={concierto.id} className="concert-card">
            <img
              src={
                concierto.cartel
                  ? `/storage/${concierto.cartel}`
                  : '/imagenes/cartel1.png'
              }
              alt={`Cartel del concierto ${concierto.nombre_evento}`}
            />
            <div className="info">
              <h2 className="concert-name">{concierto.nombre_evento}</h2>
              <p className="concert-date">Fecha: {concierto.fecha_evento}</p>
              <p className="concert-description">{concierto.descripcion}</p>
            </div>
            <Link href={`/conciertos/${concierto.id}`} className="ver-mas">
              Ver más
            </Link>
          </div>
        ))}
      </div>
      <Carrito
                carrito={carrito}
                setCarrito={setCarrito}
                mostrarCarrito={mostrarCarrito}
                setMostrarCarrito={setMostrarCarrito}
            />
      <Footer />
    </div>
  );
}
