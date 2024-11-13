import React from 'react';
import Navigation from '../Components/Navigation';
import HeaderSinFoto from '../Components/HeaderSinFoto';
import Footer from '../Components/Footer';
import EventosSalaPrivada from '../Components/EventosSalaPrivada';

export default function SalaPrivada() {
    return (
        <div>
            <Navigation/>
            <HeaderSinFoto/>
            <EventosSalaPrivada />
            <Footer />
        </div>
    );
}
