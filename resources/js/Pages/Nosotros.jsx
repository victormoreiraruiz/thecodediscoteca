import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import NuestraHistoria from '../Components/NuestraHistoria';
import RedesSociales from '../Components/RedesSociales';
import NosotrosLocalizacion from '../Components/NosotrosLocalizacion';

export default function Welcome() {
    return (
        <div>
            <Header />
            <NuestraHistoria />
            <RedesSociales />
            <NosotrosLocalizacion />
            <Footer />
        </div>
    );
}
