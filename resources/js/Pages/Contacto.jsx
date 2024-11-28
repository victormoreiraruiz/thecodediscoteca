import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Carrito from '../Components/Carrito';
import ContactoInformación from '../Components/ContactoInformación';
import ContactoCuadrados from '../Components/ContactoCuadrados';
import ContactoFormulario from '../Components/ContactoFormulario';
import Navigation from '../Components/Navigation';

export default function Welcome() {
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    return (
        <div>
            <Navigation />
            <Carrito carrito={carrito} setCarrito={setCarrito} mostrarCarrito={mostrarCarrito} setMostrarCarrito={setMostrarCarrito} />
            <Header />
            <ContactoInformación />
            <ContactoCuadrados />
            <ContactoFormulario />
            <Footer />
        </div>
    );
}
