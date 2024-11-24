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
            <div className="concerts-list">
                {conciertos.map((concierto) => (
                    <div key={concierto.id} className="concert-card">
                        <h2>{concierto.nombre_evento}</h2>
                        <img
                            src={
                                concierto.cartel
                                    ? `/storage/${concierto.cartel}` // Ruta al cartel almacenado
                                    : '/imagenes/cartel1.png' // Imagen predeterminada
                            }
                            alt={`Cartel del concierto ${concierto.nombre_evento}`}
                            className="concert-cartel"
                        />
                        <p>{concierto.descripcion}</p>
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
