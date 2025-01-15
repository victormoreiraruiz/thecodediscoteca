import React, { useState, useEffect } from 'react';

const TablaNotificaciones = ({ notificaciones }) => {
    const [paginaActual, setPaginaActual] = useState(1);
    const [notificacionesPaginadas, setNotificacionesPaginadas] = useState([]);
    const [orden, setOrden] = useState({ campo: 'fecha', ascendente: true });
    const [filtroFecha, setFiltroFecha] = useState({ desde: '', hasta: '' });
    const notificacionesPorPagina = 10;

    const filtrarPorFecha = (notificaciones) => {
        const { desde, hasta } = filtroFecha;
        if (!desde || !hasta) return notificaciones;

        const fechaDesde = new Date(desde).setHours(0, 0, 0, 0);
        const fechaHasta = new Date(hasta).setHours(23, 59, 59, 999);

        return notificaciones.filter(notificacion => {
            const fechaNotificacion = new Date(notificacion.created_at).getTime();
            return fechaNotificacion >= fechaDesde && fechaNotificacion <= fechaHasta;
        });
    };

    const ordenarNotificaciones = (campo) => {
        const esAscendente = orden.campo === campo ? !orden.ascendente : true;
        setOrden({ campo, ascendente: esAscendente });
    };

    useEffect(() => {
        const inicio = (paginaActual - 1) * notificacionesPorPagina;
        const fin = inicio + notificacionesPorPagina;

        const notificacionesFiltradas = filtrarPorFecha(notificaciones);
        const notificacionesOrdenadas = [...notificacionesFiltradas].sort((a, b) => {
            if (orden.campo === 'fecha') {
                return orden.ascendente
                    ? new Date(a.created_at) - new Date(b.created_at)
                    : new Date(b.created_at) - new Date(a.created_at);
            } else if (orden.campo === 'leido') {
                return orden.ascendente ? a.leido - b.leido : b.leido - a.leido;
            }
            return 0;
        });

        setNotificacionesPaginadas(notificacionesOrdenadas.slice(inicio, fin));
    }, [notificaciones, paginaActual, orden, filtroFecha]);

    const cambiarPagina = (nuevaPagina) => {
        setPaginaActual(nuevaPagina);
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-6 p-4 bg-[#e5cc70] text-[#860303] rounded-lg shadow-lg">
            {/* Filtros de fecha */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                    <label className="flex flex-col">
                        Desde:
                        <input
                            type="date"
                            value={filtroFecha.desde}
                            onChange={(e) => setFiltroFecha({ ...filtroFecha, desde: e.target.value })}
                            className="bg-[#860303] text-[#e5cc70] px-2 py-1 rounded-md focus:outline-none"
                        />
                    </label>
                    <label className="flex flex-col">
                        Hasta:
                        <input
                            type="date"
                            value={filtroFecha.hasta}
                            onChange={(e) => setFiltroFecha({ ...filtroFecha, hasta: e.target.value })}
                            className="bg-[#860303] text-[#e5cc70] px-2 py-1 rounded-md focus:outline-none"
                        />
                    </label>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full border-2 border-[#860303] rounded-lg">
                    <thead>
                        <tr className="bg-[#860303] text-[#e5cc70]">
                            <th
                                className="px-4 py-3 text-left cursor-pointer"
                                onClick={() => ordenarNotificaciones('fecha')}
                            >
                                Fecha {orden.campo === 'fecha' ? (orden.ascendente ? '▲' : '▼') : ''}
                            </th>
                            <th className="px-4 py-3 text-left">Mensaje</th>
                            <th
                                className="px-4 py-3 text-left cursor-pointer"
                                onClick={() => ordenarNotificaciones('leido')}
                            >
                                Estado {orden.campo === 'leido' ? (orden.ascendente ? '▲' : '▼') : ''}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#860303] bg-[#e5cc70] text-[#860303]">
                        {notificacionesPaginadas.length > 0 ? (
                            notificacionesPaginadas.map((notificacion) => (
                                <tr
                                    key={notificacion.id}
                                    className="hover:bg-[#f0d77b] transition duration-200"
                                >
                                    <td className="px-4 py-3">{new Date(notificacion.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">{notificacion.mensaje}</td>
                                    <td className="px-4 py-3">
                                        {notificacion.leido ? 'Leído' : 'No leído'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4">No tienes notificaciones registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="mt-4 flex justify-center space-x-2">
                {Array.from({ length: Math.ceil(filtrarPorFecha(notificaciones).length / notificacionesPorPagina) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => cambiarPagina(index + 1)}
                        className={`px-3 py-2 rounded-lg ${
                            paginaActual === index + 1
                                ? 'bg-[#860303] text-[#e5cc70] font-bold'
                                : 'bg-[#e5cc70] text-[#860303] border border-[#860303] hover:bg-[#f0d77b] transition'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TablaNotificaciones;
