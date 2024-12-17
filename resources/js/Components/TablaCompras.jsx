import React, { useState, useEffect } from 'react';


const TablaCompras = ({ compras }) => {
    const comprasValidas = compras.filter(compra => compra.entradas && compra.entradas.length > 0);

    const [paginaActual, setPaginaActual] = useState(1);
    const [comprasPaginadas, setComprasPaginadas] = useState([]);
    const [orden, setOrden] = useState({ campo: 'fecha_compra', ascendente: true });
    const [filtroFecha, setFiltroFecha] = useState({ desde: '', hasta: '' });
    const comprasPorPagina = 10;

    // Filtrar compras por rango de fechas
    const filtrarPorFecha = (compras) => {
        const { desde, hasta } = filtroFecha;
        if (!desde || !hasta) return compras;

        const fechaDesde = new Date(desde).setHours(0, 0, 0, 0);
        const fechaHasta = new Date(hasta).setHours(23, 59, 59, 999);

        return compras.filter(compra => {
            const fechaCompra = new Date(compra.fecha_compra).getTime();
            return fechaCompra >= fechaDesde && fechaCompra <= fechaHasta;
        });
    };

    // Ordenar compras
    const ordenarCompras = (campo) => {
        const esAscendente = orden.campo === campo ? !orden.ascendente : true;
        setOrden({ campo, ascendente: esAscendente });

        const comprasOrdenadas = [...comprasValidas].sort((a, b) => {
            if (campo === 'fecha_compra') {
                return esAscendente
                    ? new Date(a.fecha_compra) - new Date(b.fecha_compra)
                    : new Date(b.fecha_compra) - new Date(a.fecha_compra);
            } else if (campo === 'total') {
                return esAscendente ? a.total - b.total : b.total - a.total;
            }
            return 0;
        });

        setPaginaActual(1);
        setComprasPaginadas(comprasOrdenadas.slice(0, comprasPorPagina));
    };

    // Paginación y filtro
    useEffect(() => {
        const inicio = (paginaActual - 1) * comprasPorPagina;
        const fin = inicio + comprasPorPagina;

        const comprasFiltradas = filtrarPorFecha(comprasValidas);
        const comprasOrdenadas = [...comprasFiltradas].sort((a, b) => {
            if (orden.campo === 'fecha_compra') {
                return orden.ascendente
                    ? new Date(a.fecha_compra) - new Date(b.fecha_compra)
                    : new Date(b.fecha_compra) - new Date(a.fecha_compra);
            } else if (orden.campo === 'total') {
                return orden.ascendente ? a.total - b.total : b.total - a.total;
            }
            return 0;
        });

        setComprasPaginadas(comprasOrdenadas.slice(inicio, fin));
    }, [comprasValidas, paginaActual, orden, filtroFecha]);

    const cambiarPagina = (nuevaPagina) => {
        setPaginaActual(nuevaPagina);
    };

    return (
        <div className="tabla-compras-container">
            <table className="tabla-compras">
                <thead>
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
                    <tr>
                        <th onClick={() => ordenarCompras('fecha_compra')} className="tabla-compras-header">
                            Fecha de Compra {orden.campo === 'fecha_compra' ? (orden.ascendente ? '▲' : '▼') : ''}
                        </th>
                        <th onClick={() => ordenarCompras('total')} className="tabla-compras-header">
                            Importe {orden.campo === 'total' ? (orden.ascendente ? '▲' : '▼') : ''}
                        </th>
                        <th className="tabla-compras-header">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {comprasPaginadas.length > 0 ? (
                        comprasPaginadas.map((compra) => (
                            <tr key={compra.id} className="tabla-compras-row">
                                <td>{new Date(compra.fecha_compra).toLocaleDateString()}</td>
                                <td>{Number(compra.total || 0).toFixed(2)} €</td>
                                <td>
                                    <a
                                        href={`/mi-cuenta/compras/${compra.id}/descargar-pdf`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="tabla-compras-btn"
                                    >
                                        Descargar PDF
                                    </a>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="tabla-compras-vacia">
                                No tienes compras registradas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Controles de paginación */}
            <div className="tabla-compras-paginacion">
                {Array.from({ length: Math.ceil(filtrarPorFecha(comprasValidas).length / comprasPorPagina) }).map((_, index) => (
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

export default TablaCompras;
