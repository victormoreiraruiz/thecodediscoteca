import React from 'react';
import HeaderSinFoto from '../Components/HeaderSinFoto';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { usePage } from '@inertiajs/react';

const Evento = () => {
    const { evento } = usePage().props;

    return (
        <div>
             <Navigation />
             <HeaderSinFoto />
             <div className="evento-detalles">
           
            <h2>{evento.nombre_evento}</h2>
         
           
        </div>
        <Footer/>
        </div>
       
    );
};

export default Evento;
