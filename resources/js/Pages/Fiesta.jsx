import Header from '../Components/Header';
import Footer from '../Components/Footer';
import FiestaCartel from '../Components/FiestaCartel';
import FiestaEntradas from '../Components/FiestaEntradas';
import Carrito from '../Components/Carrito';
import Navigation from '../Components/Navigation';
import React, { useState } from 'react';

export default function Welcome() {
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const nombreEvento = 'Fiesta de Año Nuevo';

    return (
        <div>
            <Navigation />
            <Header />
            <FiestaCartel />
            <FiestaEntradas carrito={carrito} setCarrito={setCarrito}  nombreEvento={nombreEvento} />

            <Carrito carrito={carrito} setCarrito={setCarrito} mostrarCarrito={mostrarCarrito} setMostrarCarrito={setMostrarCarrito} />
            <Footer />
        </div>
    );
}
