import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import CompraEntradaConcierto from '../Components/CompraEntradaConcierto';

export default function Concierto({ concierto }) {
    if (!concierto) {
        return <div>Cargando información del concierto...</div>;
    }

    return (
        <div>
            <Navigation />
            <Header />
            <div className="concert-details">
                <img 
                    src={concierto.cartel || '/imagenes/cartel1.png'} 
                    alt={`Cartel de ${concierto.nombre_evento}`} 
                    className="concert-cartel"
                />
                <h1>{concierto.nombre_evento}</h1>
                <p>{concierto.descripcion}</p>
                <p>Fecha: {concierto.fecha_evento}</p>
                <p>Hora: {concierto.hora_inicio} - {concierto.hora_final}</p>
                <p>Sala: {concierto.sala?.descripcion || 'No especificada'}</p>
                <CompraEntradaConcierto eventoId={concierto.id} />
            </div>
            <Footer />
        </div>
    );
}
