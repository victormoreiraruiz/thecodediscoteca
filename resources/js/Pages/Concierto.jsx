import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import CompraEntradaConcierto from '../Components/CompraEntradaConcierto';
import Carrito from '../Components/Carrito';

export default function Concierto({ concierto }) {
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);

    if (!concierto) {
        return <div>Cargando información del concierto...</div>;
    }

    return (
        <div>
            <Navigation />
            <Header />
            <div className="fiesta">
                <img
                    src={concierto.cartel ? `/storage/${concierto.cartel}` : '/imagenes/cartel1.png'}
                    alt={`Cartel del concierto ${concierto.nombre_evento}`}
                    className="fiestacartel"
                />
                <div className="fiestatexto">
                    <h2>Concierto de {concierto.nombre_evento}</h2>
                    <h3>{concierto.descripcion}</h3>
                    <h3>Fecha: {concierto.fecha_evento}</h3>
                    <h3>Hora: {concierto.hora_inicio} - {concierto.hora_final}</h3>
                    <h3>Sala: {concierto.sala?.descripcion || 'No especificada'}</h3>
                </div>
            </div>
            <CompraEntradaConcierto eventoId={concierto.id} carrito={carrito} setCarrito={setCarrito} />
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
