import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Carrito from '../Components/Carrito';
import IndexEventosImagenes from '../Components/IndexEventosImagenes';
import IndexEventos from '../Components/IndexEventos';
import Navigation from '../Components/Navigation';

export default function Welcome() {
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const [eventos, setEventos] = useState([]); // Estado para almacenar los eventos
    const [cargando, setCargando] = useState(true); // Estado de carga

    useEffect(() => {
        async function fetchEventos() {
            setCargando(true);
            try {
                const response = await fetch('/eventos-proximos'); // Cambiado a /eventos-proximos
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const data = await response.json();
                setEventos(data);
            } catch (error) {
                console.error('Error al cargar los eventos:', error);
            } finally {
                setCargando(false);
            }
        }
    
        fetchEventos();
    }, []);
    

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

            {/* Mostrar estado de carga o el componente de eventos */}
            {cargando ? (
                <p>Cargando eventos...</p>
            ) : (
                <IndexEventos eventos={eventos} />
            )}

            <Footer />
        </div>
    );
}
