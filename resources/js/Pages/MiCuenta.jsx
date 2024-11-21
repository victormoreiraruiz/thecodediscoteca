MiCuenta.jsx
import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import MiCuentaInfo from '../Components/MiCuentaInfo';
import MiCuentaCambiarPass from '../Components/MiCuentaCambiarPass';
import { usePage } from '@inertiajs/react';

export default function MiCuenta() {
    const { user, compras, reservas } = usePage().props;

    console.log('Props recibidas:', { user, compras, reservas });

    return (
        <div>
            <Navigation />
            <Header />
            <div className="container mx-auto p-4">
                <MiCuentaInfo />
                <MiCuentaCambiarPass />
            </div>
            <Footer />
        </div>
    );
}
