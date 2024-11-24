import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { Link } from '@inertiajs/react';

export default function Conciertos({ conciertos }) {
    return (
        <div>
            <Navigation />
            <Header />
            <h1>Conciertos Disponibles</h1>
            <div className="concerts-grid">
                {conciertos.map((concierto) => (
                    <div key={concierto.id} className="concert-card">
                        <img 
                            src={concierto.cartel || '/imagenes/cartel1.png'} 
                            alt={`Cartel de ${concierto.nombre_evento}`} 
                            className="concert-cartel" 
                        />
                        <h3>{concierto.nombre_evento}</h3>
                        <p>Precio desde: {concierto.entradas?.length > 0 ? `${Math.min(...concierto.entradas.map(e => e.precio))}€` : 'N/A'}</p>
                        <p>Fecha: {concierto.fecha_evento}</p>
                        <p>Hora: {concierto.hora_inicio} - {concierto.hora_final}</p>
                        <Link href={`/conciertos/${concierto.id}`} className="ver-mas">
                            Ver más
                        </Link>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}
