import React from 'react';
import Navigation from '../Components/Navigation';
import HeaderSinFoto from '../Components/HeaderSinFoto';
import Footer from '../Components/Footer';
import EventosSalaCelebraciones from '../Components/EventosSalaCelebraciones';

export default function SalaPrivada() {
    return (
        <div>
            <Navigation/>
            <HeaderSinFoto/>
            <EventosSalaCelebraciones />
            <Footer />
        </div>
    );
}
