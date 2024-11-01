// MiCuenta.jsx
import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import MiCuentaDatos from '../Components/MiCuentaDatos';
import { usePage } from '@inertiajs/react';

export default function MiCuenta() {
    const { user } = usePage().props; // Obtener el usuario desde los props de Inertia

    return (
        <div>
            <Navigation/>
            <Header />
            <MiCuentaDatos user={user} /> {/* Pasar el usuario como prop */}
            <Footer />
        </div>
    );
}
