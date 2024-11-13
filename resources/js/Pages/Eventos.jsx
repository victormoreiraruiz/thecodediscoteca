import React from 'react';
import HeaderSinFoto from '../Components/HeaderSinFoto';
import Footer from '../Components/Footer';
import EventosInformacion from '../Components/EventosInformacion';
import EventosReservas from '../Components/EventosReservas';
import Navigation from '../Components/Navigation';


export default function Welcome() {
    return (
        <div>
            <Navigation />
            <HeaderSinFoto />
            <EventosInformacion/>
            <EventosReservas/>
            <Footer />
        </div>
    );
}
