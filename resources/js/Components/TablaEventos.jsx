import React, { useState, useEffect } from 'react';

const TablaEventos = ({ eventos, onCancelEvent }) => {
    const [paginaActual, setPaginaActual] = useState(1);
    const [eventosPaginados, setEventosPaginados] = useState([]);
    const [orden, setOrden] = useState({ campo: 'fecha_evento', ascendente: true });
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroFecha, setFiltroFecha] = useState({ desde: '', hasta: '' });
    const eventosPorPagina = 10;

    // Filtrar eventos por rango de fechas
    const filtrarPorFecha = (eventos) => {
        const { desde, hasta } = filtroFecha;
        if (!desde || !hasta) return eventos;

        const fechaDesde = new Date(desde).setHours(0, 0, 0, 0);
        const fechaHasta = new Date(hasta).setHours(23, 59, 59, 999);

        return eventos.filter(evento => {
            const fechaEvento = new Date(evento.fecha_evento).getTime();
            return fechaEvento >= fechaDesde && fechaEvento <= fechaHasta;
        });
    };

    // Filtrar eventos por nombre
    const filtrarPorNombre = (eventos) => {
        if (!filtroNombre) return eventos;
        return eventos.filter(evento => evento.nombre_evento.toLowerCase().includes(filtroNombre.toLowerCase()));
    };

    // Ordenar eventos
    const ordenarEventos = (campo) => {
        const esAscendente = orden.campo === campo ? !orden.ascendente : true;
        setOrden({ campo, ascendente: esAscendente });

        const eventosOrdenados = [...eventos].sort((a, b) => {
            if (campo === 'fecha_evento') {
                return esAscendente
                    ? new Date(a.fecha_evento) - new Date(b.fecha_evento)
                    : new Date(b.fecha_evento) - new Date(a.fecha_evento);
            } else if (campo === 'nombre_evento') {
                return esAscendente
                    ? a.nombre_evento.localeCompare(b.nombre_evento)
                    : b.nombre_evento.localeCompare(a.nombre_evento);
            }
            return 0;
        });

        setPaginaActual(1);
        setEventosPaginados(eventosOrdenados.slice(0, eventosPorPagina));
    };

    // Paginación y filtros
    useEffect(() => {
        const inicio = (paginaActual - 1) * eventosPorPagina;
        const fin = inicio + eventosPorPagina;

        const eventosFiltrados = filtrarPorNombre(filtrarPorFecha(eventos));
        const eventosOrdenados = [...eventosFiltrados].sort((a, b) => {
            if (orden.campo === 'fecha_evento') {
                return orden.ascendente
                    ? new Date(a.fecha_evento) - new Date(b.fecha_evento)
                    : new Date(b.fecha_evento) - new Date(a.fecha_evento);
            } else if (orden.campo === 'nombre_evento') {
                return orden.ascendente
                    ? a.nombre_evento.localeCompare(b.nombre_evento)
                    : b.nombre_evento.localeCompare(a.nombre_evento);
            }
            return 0;
        });

        setEventosPaginados(eventosOrdenados.slice(inicio, fin));
    }, [eventos, paginaActual, orden, filtroNombre, filtroFecha]);

    const cambiarPagina = (nuevaPagina) => {
        setPaginaActual(nuevaPagina);
    };

    return (
        <div className="tabla-compras-container">
            {/* Barra de búsqueda */}
            <div className="filtro-nombre">
                <label>
                    Buscar:
                    <input
                        type="text"
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                        placeholder="Buscar por nombre"
                    />
                </label>
            </div>

            {/* Filtros de fecha */}
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

            {/* Tabla */}
            <table className="tabla-compras">
                <thead>
                    <tr>
                        <th onClick={() => ordenarEventos('nombre_evento')} className="tabla-compras-header">
                            Nombre {orden.campo === 'nombre_evento' ? (orden.ascendente ? '▲' : '▼') : ''}
                        </th>
                        <th onClick={() => ordenarEventos('fecha_evento')} className="tabla-compras-header">
                            Fecha {orden.campo === 'fecha_evento' ? (orden.ascendente ? '▲' : '▼') : ''}
                        </th>
                        <th className="tabla-compras-header">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {eventosPaginados.length > 0 ? (
                        eventosPaginados.map((evento) => (
                            <tr key={evento.id} className="tabla-compras-row">
                                <td>{evento.nombre_evento}</td>
                                <td>{new Date(evento.fecha_evento).toLocaleDateString()}</td>
                                <td>
                                    <a
                                        href={`/mi-cuenta/eventos/${evento.id}`}
                                        className="tabla-compras-btn"
                                    >
                                        Ver Detalles
                                    </a>
                                    <button
                                        onClick={() => onCancelEvent(evento)}
                                        className="tabla-compras-btn"
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Cancelar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="tabla-compras-vacia">
                                No tienes eventos registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Controles de paginación */}
            <div className="tabla-compras-paginacion">
                {Array.from({ length: Math.ceil(filtrarPorNombre(filtrarPorFecha(eventos)).length / eventosPorPagina) }).map((_, index) => (
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

export default TablaEventos;
