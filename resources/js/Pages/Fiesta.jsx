import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import FiestaCartel from '../Components/FiestaCartel';
import FiestaEntradas from '../Components/FiestaEntradas';
import Navigation from '../Components/Navigation';

export default function Welcome() {
    return (
        <div>
            <Navigation />
            <Header />
            <FiestaCartel />
            <FiestaEntradas />
            <Footer />
        </div>
    );
}
