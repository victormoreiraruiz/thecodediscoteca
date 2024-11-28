import React, { useEffect, useState } from 'react';
import HeaderSinFoto from '../Components/HeaderSinFoto';
import Carrito from '../Components/Carrito';
import Footer from '../Components/Footer';
import EventosInformacion from '../Components/EventosInformacion';
import EventosReservas from '../Components/EventosReservas';
import Navigation from '../Components/Navigation';


export default function Welcome() {
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    return (
        <div>
            <Navigation />
            <Carrito carrito={carrito} setCarrito={setCarrito} mostrarCarrito={mostrarCarrito} setMostrarCarrito={setMostrarCarrito} />
            <HeaderSinFoto />
            <EventosInformacion/>
            <EventosReservas/>
            <Footer />
        </div>
    );
}
