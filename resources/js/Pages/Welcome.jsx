import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import EventosVideos from '../Components/EventosVideos';
import ProximosEventos from '../Components/ProximosEventos';

export default function Welcome() {
    return (
        <div>
            <Header />
            <EventosVideos />
            <ProximosEventos />
            <Footer />
        </div>
    );
}
