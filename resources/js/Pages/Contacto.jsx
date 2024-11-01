import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ContactoInformación from '../Components/ContactoInformación';
import ContactoCuadrados from '../Components/ContactoCuadrados';
import ContactoFormulario from '../Components/ContactoFormulario';

export default function Welcome() {
    return (
        <div>
            <Header />
            <ContactoInformación />
            <ContactoCuadrados />
            <ContactoFormulario />
            <Footer />
        </div>
    );
}
