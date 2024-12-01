import React, { useState } from 'react';
import HeaderSinFoto from '../Components/HeaderSinFoto';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { usePage, useForm } from '@inertiajs/react';

const Evento = () => {
    const { evento } = usePage().props;

    // Configura el formulario con los datos iniciales del evento
    const { data, setData, post, processing, errors } = useForm({
        nombre_evento: evento.nombre_evento || '',
        descripcion: evento.descripcion || '',
        cartel: null,
    });

    // Maneja la subida de archivos
    const handleFileChange = (e) => {
        setData('cartel', e.target.files[0]);
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/eventos/${evento.id}/editar`, {
            onSuccess: () => alert('Evento actualizado correctamente'),
        });
    };

    return (
        <div>
            <Navigation />
            <HeaderSinFoto />
            <div className="evento-detalles">
                <h2>Editar Evento: {evento.nombre_evento}</h2>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-group">
                        <label htmlFor="nombre_evento">Nombre del Evento</label>
                        <input
                            type="text"
                            id="nombre_evento"
                            value={data.nombre_evento}
                            onChange={(e) => setData('nombre_evento', e.target.value)}
                            className={errors.nombre_evento ? 'input-error' : ''}
                        />
                        {errors.nombre_evento && <p className="error">{errors.nombre_evento}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <textarea
                            id="descripcion"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            className={errors.descripcion ? 'input-error' : ''}
                        ></textarea>
                        {errors.descripcion && <p className="error">{errors.descripcion}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="cartel"><h2>Cartel del Evento</h2></label>
                        <img
                        src={evento.cartel ? `/storage/${evento.cartel}` : '/imagenes/cartel1.png'}
                        alt={`Cartel del evento ${evento.nombre_evento}`}
                        className="fiestacartel"
                    />
                        <input
                            type="file"
                            id="cartel"
                            onChange={handleFileChange}
                            className={errors.cartel ? 'input-error' : ''}
                        />
                        {errors.cartel && <p className="error">{errors.cartel}</p>}
                    </div>

                    <div className="form-group">
                        <button type="submit" disabled={processing}>
                            {processing ? 'Actualizando...' : 'Actualizar Evento'}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Evento;
