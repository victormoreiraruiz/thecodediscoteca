// MiCuenta.jsx
import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import MiCuentaDatos from '../Components/MiCuentaDatos';
import MiCuentaCambiarPass from '../Components/MiCuentaCambiarPass';
import MiCuentaHistorial from '../Components/MiCuentaHistorial';
import { usePage } from '@inertiajs/react';

export default function MiCuenta() {
    const { user } = usePage().props;

    return (
        <div>
            <Navigation />
            <Header />
            <div className="container mx-auto p-4">
                <MiCuentaDatos user={user} />
                <MiCuentaCambiarPass />
                <MiCuentaHistorial />
            </div>
            <Footer />
        </div>
    );
}
