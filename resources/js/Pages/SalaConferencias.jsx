import React from 'react';
import Navigation from '../Components/Navigation';
import HeaderSinFoto from '../Components/HeaderSinFoto';
import Footer from '../Components/Footer';
import EventosSalaConferencias from '../Components/EventosSalaConferencias';

export default function SalaPrivada() {
    return (
        <div>
            <Navigation/>
            <HeaderSinFoto/>
            <EventosSalaConferencias />
            <Footer />
        </div>
    );
}
