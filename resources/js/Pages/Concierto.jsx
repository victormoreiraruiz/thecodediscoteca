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
                    src={
                        concierto.cartel
                            ? `/storage/${concierto.cartel}`
                            : '/imagenes/cartel1.png' // Imagen predeterminada si no hay cartel
                    }
                    alt={`Cartel del concierto ${concierto.nombre_evento}`}
                    className="concierto-cartel"
                />
                <h2>{concierto.nombre_evento}</h2>
                <h3>{concierto.descripcion}</h3>
                <h3>Fecha: {concierto.fecha_evento}</h3>
                <h3>Hora: {concierto.hora_inicio} - {concierto.hora_final}</h3>
                <h3>Sala: {concierto.sala?.descripcion || 'No especificada'}</h3>
                <CompraEntradaConcierto eventoId={concierto.id} />
            </div>
            <Footer />
        </div>
    );
}
