MiCuenta.jsx
import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import Carrito from '../Components/Carrito';
import MiCuentaInfo from '../Components/MiCuentaInfo';
import MiCuentaCambiarPass from '../Components/MiCuentaCambiarPass';
import { usePage } from '@inertiajs/react';

export default function MiCuenta() {
    const { user, compras, reservas } = usePage().props;
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);

    console.log('Props recibidas:', { user, compras, reservas });

    return (
        <div>
            <Navigation />
            <Header />
            <Carrito carrito={carrito} setCarrito={setCarrito} mostrarCarrito={mostrarCarrito} setMostrarCarrito={setMostrarCarrito} />
            <div className="container mx-auto p-4">
                <MiCuentaInfo />
                <MiCuentaCambiarPass />
            </div>
            <Footer />
        </div>
    );
}
