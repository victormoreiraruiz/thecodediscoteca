import React, { useState } from 'react';
import HeaderSinFoto from '../Components/HeaderSinFoto';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { usePage, useForm } from '@inertiajs/react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const Evento = () => {
    const { evento, estadisticas = {} } = usePage().props;

    const { entradas_vendidas = 0, aforo_total = 0, porcentaje_ocupado = 0 } = estadisticas;

    const COLORS = ['#0088FE', '#FF8042'];

    const data = [
        { name: 'Entradas Vendidas', value: entradas_vendidas },
        { name: 'Entradas Disponibles', value: Math.max(aforo_total - entradas_vendidas, 0) },
    ];

    // Configura el formulario con los datos iniciales del evento
    const { data: formData, setData, post, processing, errors } = useForm({
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
                            value={formData.nombre_evento}
                            onChange={(e) => setData('nombre_evento', e.target.value)}
                            className={errors.nombre_evento ? 'input-error' : ''}
                        />
                        {errors.nombre_evento && <p className="error">{errors.nombre_evento}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <textarea
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            className={errors.descripcion ? 'input-error' : ''}
                        ></textarea>
                        {errors.descripcion && <p className="error">{errors.descripcion}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="cartel">Cartel del Evento</label>
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

                <h3>Estadísticas del Evento</h3>
                <ul>
                    <li><h2>Total de Entradas Vendidas: {entradas_vendidas}</h2></li>
                    <li><h2>Capacidad Total de la Sala: {estadisticas.aforo_total > 0 ? estadisticas.aforo_total : 'No disponible'}</h2></li>
                    <li><h2>Porcentaje de Ocupación: {estadisticas.porcentaje_ocupado}%</h2></li>
                </ul>

                <h4>Distribución de Entradas</h4>
                <PieChart width={400} height={400}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </div>
            <Footer />
        </div>
    );
};

export default Evento;
