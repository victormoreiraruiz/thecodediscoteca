import React, { useEffect, useState } from 'react';
import HeaderSinFoto from '../Components/HeaderSinFoto';
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
            <HeaderSinFoto />
            <Carrito carrito={carrito} setCarrito={setCarrito} mostrarCarrito={mostrarCarrito} setMostrarCarrito={setMostrarCarrito} />
            <NuestraHistoria />
            <RedesSociales />
            <NosotrosLocalizacion />
            <Footer />
        </div>
    );
}
