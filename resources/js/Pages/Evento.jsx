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
    const { entradas_vendidas = 0, aforo_total = 0 } = estadisticas;

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
            <div className="container mx-auto px-6 py-8">
                <h2 className="text-3xl font-bold text-center text-[#e5cc70] mb-6">
                    Editar Evento: {evento.nombre_evento}
                </h2>

                <div className="bg-[#860303] p-6 rounded-lg shadow-lg max-w-lg mx-auto">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                        <div>
                            <label className="block text-[#e5cc70] font-semibold">Nombre del Evento:</label>
                            <input
                                type="text"
                                value={formData.nombre_evento}
                                onChange={(e) => setData('nombre_evento', e.target.value)}
                                className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[#e5cc70] font-semibold">Descripción:</label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[#e5cc70] font-semibold">Cartel del Evento:</label>
                            <img
                                src={evento.cartel ? `/storage/${evento.cartel}` : '/imagenes/cartel1.png'}
                                alt={`Cartel del evento ${evento.nombre_evento}`}
                                className="w-full rounded-lg shadow-md"
                            />
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white mt-2"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#e5cc70] text-[#860303] font-semibold py-2 rounded-lg hover:bg-yellow-500"
                            disabled={processing}
                        >
                            {processing ? 'Actualizando...' : 'Actualizar Evento'}
                        </button>
                    </form>
                </div>

                <h3 className="text-2xl font-bold text-center text-[#e5cc70] mt-10">Estadísticas del Evento</h3>

                <div className="flex flex-wrap justify-center gap-8 mt-6">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-center text-[#e5cc70] font-semibold mb-4">Distribución de Entradas</h2>
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

                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-center text-[#e5cc70] font-semibold mb-4">Ingresos Acumulativos</h2>
                        <LineChart width={600} height={300} data={estadisticasVentas}>
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="fecha" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="ingresos_acumulados" stroke="#82ca9d" />
                        </LineChart>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-center text-[#e5cc70] font-semibold mb-4">Ventas de Entradas por Día</h2>
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
