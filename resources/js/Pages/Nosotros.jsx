import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import NuestraHistoria from '../Components/NuestraHistoria';
import RedesSociales from '../Components/RedesSociales';
import Carrito from '../Components/Carrito';
import NosotrosLocalizacion from '../Components/NosotrosLocalizacion';
import Navigation from '../Components/Navigation';

export default function Welcome() {
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    return (
        <div>
            <Navigation />
            <Header />
            <Carrito carrito={carrito} setCarrito={setCarrito} mostrarCarrito={mostrarCarrito} setMostrarCarrito={setMostrarCarrito} />
            <NuestraHistoria />
            <RedesSociales />
            <NosotrosLocalizacion />
            <Footer />
        </div>
    );
}
