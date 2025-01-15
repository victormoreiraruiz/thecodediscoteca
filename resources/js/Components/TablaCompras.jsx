import React, { useState, useEffect } from 'react';

const TablaCompras = ({ compras }) => {
    const comprasValidas = compras.filter(compra => compra.entradas && compra.entradas.length > 0);

    const [paginaActual, setPaginaActual] = useState(1);
    const [comprasPaginadas, setComprasPaginadas] = useState([]);
    const [orden, setOrden] = useState({ campo: 'fecha_compra', ascendente: true });
    const [filtroFecha, setFiltroFecha] = useState({ desde: '', hasta: '' });
    const comprasPorPagina = 10;

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

    const ordenarCompras = (campo) => {
        const esAscendente = orden.campo === campo ? !orden.ascendente : true;
        setOrden({ campo, ascendente: esAscendente });
    };

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
                                onClick={() => ordenarCompras('fecha_compra')}
                            >
                                Fecha de Compra {orden.campo === 'fecha_compra' ? (orden.ascendente ? '▲' : '▼') : ''}
                            </th>
                            <th
                                className="px-4 py-3 text-left cursor-pointer"
                                onClick={() => ordenarCompras('total')}
                            >
                                Importe {orden.campo === 'total' ? (orden.ascendente ? '▲' : '▼') : ''}
                            </th>
                            <th className="px-4 py-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#860303] bg-[#e5cc70] text-[#860303]">
                        {comprasPaginadas.length > 0 ? (
                            comprasPaginadas.map((compra) => (
                                <tr
                                    key={compra.id}
                                    className="hover:bg-[#f0d77b] transition duration-200"
                                >
                                    <td className="px-4 py-3">{new Date(compra.fecha_compra).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">{Number(compra.total || 0).toFixed(2)} €</td>
                                    <td className="px-4 py-3">
                                        <a
                                            href={`/mi-cuenta/compras/${compra.id}/descargar-pdf`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-[#860303] text-[#e5cc70] px-3 py-2 rounded-lg shadow-md hover:bg-[#a80505] transition duration-300"
                                        >
                                            Descargar PDF
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4">No tienes compras registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="mt-4 flex justify-center space-x-2">
                {Array.from({ length: Math.ceil(filtrarPorFecha(comprasValidas).length / comprasPorPagina) }).map((_, index) => (
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

export default TablaCompras;
