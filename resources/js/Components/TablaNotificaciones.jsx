import React, { useState, useEffect } from 'react';

const TablaNotificaciones = ({ notificaciones }) => {
    const [paginaActual, setPaginaActual] = useState(1);
    const [notificacionesPaginadas, setNotificacionesPaginadas] = useState([]);
    const [orden, setOrden] = useState({ campo: 'fecha', ascendente: true });
    const [filtroFecha, setFiltroFecha] = useState({ desde: '', hasta: '' });
    const notificacionesPorPagina = 10;

    // Filtrar notificaciones por rango de fechas
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

    // Ordenar notificaciones
    const ordenarNotificaciones = (campo) => {
        const esAscendente = orden.campo === campo ? !orden.ascendente : true;
        setOrden({ campo, ascendente: esAscendente });
    };

    // Actualizar las notificaciones paginadas al cambiar filtros, orden o página
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
        <div className="tabla-compras-container">
            <table className="tabla-compras">
                <thead>
                    {/* Filtro de fechas en la parte superior de la tabla */}
                    <tr>
                        <th colSpan="3" className="tabla-compras-filtro">
                            <div className="filtro-fechas">
                                <label>
                                    Desde:
                                    <input
                                        type="date"
                                        value={filtroFecha.desde}
                                        onChange={(e) => setFiltroFecha({ ...filtroFecha, desde: e.target.value })}
                                    />
                                </label>
                                <label>
                                    Hasta:
                                    <input
                                        type="date"
                                        value={filtroFecha.hasta}
                                        onChange={(e) => setFiltroFecha({ ...filtroFecha, hasta: e.target.value })}
                                    />
                                </label>
                            </div>
                        </th>
                    </tr>
                    {/* Encabezados de la tabla */}
                    <tr>
                        <th
                            onClick={() => ordenarNotificaciones('fecha')}
                            className="tabla-compras-header"
                        >
                            Fecha {orden.campo === 'fecha' ? (orden.ascendente ? '▲' : '▼') : ''}
                        </th>
                        <th className="tabla-compras-header">Mensaje</th>
                        <th
                            onClick={() => ordenarNotificaciones('leido')}
                            className="tabla-compras-header"
                        >
                            Estado {orden.campo === 'leido' ? (orden.ascendente ? '▲' : '▼') : ''}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {notificacionesPaginadas.length > 0 ? (
                        notificacionesPaginadas.map((notificacion) => (
                            <tr key={notificacion.id} className="tabla-compras-row">
                                <td>{new Date(notificacion.created_at).toLocaleDateString()}</td>
                                <td>{notificacion.mensaje}</td>
                                <td>{notificacion.leido ? 'Leído' : 'No leído'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="tabla-compras-vacia">
                                No tienes notificaciones registradas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Controles de paginación */}
            <div className="tabla-compras-paginacion">
                {Array.from({ length: Math.ceil(filtrarPorFecha(notificaciones).length / notificacionesPorPagina) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => cambiarPagina(index + 1)}
                        className={`paginacion-btn ${paginaActual === index + 1 ? 'activo' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TablaNotificaciones;
