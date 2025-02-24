import React, { useState } from 'react';
import HeaderSinFoto from '../Components/HeaderSinFoto';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import Carrito from '../Components/Carrito';
import { Link } from '@inertiajs/react';

export default function Conciertos({ conciertos }) {
   const [carrito, setCarrito] = useState([]);
   const [mostrarCarrito, setMostrarCarrito] = useState(false);

   // Filtrar los conciertos cuyo estado es "apto"
   const conciertosAprobados = conciertos.filter(concierto => concierto.estado === 'apto');

   return (
      <div>
         <Navigation />
         <HeaderSinFoto />
         <h2>Conciertos Disponibles</h2>
         <div className="concerts-container">
            {conciertosAprobados.length > 0 ? (
               conciertosAprobados.map((concierto) => (
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
               ))
            ) : (
               <p>No hay eventos disponibles actualmente.</p>
            )}
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
