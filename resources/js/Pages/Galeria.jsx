import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import GaleriaImagenes from '../Components/GaleriaImagenes';
import Navigation from '../Components/Navigation';


export default function Welcome() {
    return (
        <div>
            <Navigation />
            <Header />
            <GaleriaImagenes/>
            <Footer />
        </div>
    );
}
