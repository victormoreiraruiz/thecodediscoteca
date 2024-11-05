// MiCuenta.jsx
import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import MiCuentaDatos from '../Components/MiCuentaDatos';
import MiCuentaCambiarPass from '../Components/MiCuentaCambiarPass';
import { usePage } from '@inertiajs/react';

export default function MiCuenta() {
    const { user } = usePage().props; // Obtener el usuario desde los props de Inertia

    return (
        <div>
            <Navigation />
            <Header />
            <div className="container mx-auto p-4">
                <MiCuentaDatos user={user} />
                <MiCuentaCambiarPass /> 
            </div>
            <Footer />
        </div>
    );
}
