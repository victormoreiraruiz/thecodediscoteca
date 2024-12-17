import React, { useState, useEffect } from 'react';
import {
    PieChart, Pie, Tooltip, Cell,
    LineChart, Line, CartesianGrid, XAxis, YAxis,
    BarChart, Bar, Legend
} from 'recharts';
import HeaderSinFoto from '../Components/HeaderSinFoto';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { usePage, useForm } from '@inertiajs/react';
import axios from 'axios';

const Evento = () => {
    const { evento, estadisticas = {} } = usePage().props;

    const { entradas_vendidas = 0, aforo_total = 0, porcentaje_ocupado = 0 } = estadisticas;

    const COLORS = ['#0088FE', '#FF8042'];

    const data = [
        { name: 'Entradas Vendidas', value: entradas_vendidas },
        { name: 'Entradas Disponibles', value: Math.max(aforo_total - entradas_vendidas, 0) },
    ];

    const { data: formData, setData, post, processing, errors } = useForm({
        nombre_evento: evento.nombre_evento || '',
        descripcion: evento.descripcion || '',
        cartel: null,
    });

    const handleFileChange = (e) => {
        setData('cartel', e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/eventos/${evento.id}/editar`, {
            onSuccess: () => alert('Evento actualizado correctamente'),
        });
    };

    const [estadisticasVentas, setEstadisticasVentas] = useState([]);

    useEffect(() => {
        const fetchEstadisticasVentas = async () => {
            try {
                const response = await axios.get(`/eventos/${evento.id}/estadisticas-ventas`);
                setEstadisticasVentas(response.data);
            } catch (error) {
                console.error('Error al obtener estadísticas de ventas:', error);
            }
        };
        fetchEstadisticasVentas();
    }, [evento.id]);

    
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

                {/* Contenedor para alinear gráficas horizontalmente */}
                <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h2>Distribución de Entradas</h2>
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

                    <div>
                        <h2>Ingresos Acumulativos</h2>
                        <LineChart width={600} height={300} data={estadisticasVentas}>
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="fecha" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="ingresos_acumulados" stroke="#82ca9d" />
                        </LineChart>
                    </div>

                    <div>
                        <h2>Ventas de Entradas por Día</h2>
                        <BarChart width={600} height={300} data={estadisticasVentas}>
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="fecha" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total_ventas" fill="#82ca9d" />
                        </BarChart>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Evento;
