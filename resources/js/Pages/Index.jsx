import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Carrito from '../Components/Carrito';
import IndexEventosImagenes from '../Components/IndexEventosImagenes';
import IndexEventos from '../Components/IndexEventos';
import Navigation from '../Components/Navigation';

export default function Index() {
    const { eventos } = usePage().props; // Obtener eventos directamente desde Inertia

    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);

    return (
        <div>
            <Navigation />
            <Carrito
                carrito={carrito}
                setCarrito={setCarrito}
                mostrarCarrito={mostrarCarrito}
                setMostrarCarrito={setMostrarCarrito}
            />
            <Header />
            <IndexEventosImagenes />

            {/* Pasar eventos directamente al componente IndexEventos */}
            <IndexEventos eventos={eventos} />

            <Footer />
        </div>
    );
}
