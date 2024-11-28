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

    return (
        <div>
            <Navigation />
            <Header />
            <FiestaCartel />
            <FiestaEntradas carrito={carrito} setCarrito={setCarrito} />
            <Carrito carrito={carrito} setCarrito={setCarrito} mostrarCarrito={mostrarCarrito} setMostrarCarrito={setMostrarCarrito} />
            <Footer />
        </div>
    );
}
