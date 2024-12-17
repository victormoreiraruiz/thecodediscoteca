import React, { useState, useEffect } from 'react';

const TablaCompras = ({ compras }) => {
    const comprasValidas = compras.filter(compra => compra.entradas && compra.entradas.length > 0);

    const [paginaActual, setPaginaActual] = useState(1);
    const [comprasPaginadas, setComprasPaginadas] = useState([]);
    const [orden, setOrden] = useState({ campo: 'fecha_compra', ascendente: true });
    const comprasPorPagina = 10;

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

    // Paginación
    useEffect(() => {
        const inicio = (paginaActual - 1) * comprasPorPagina;
        const fin = inicio + comprasPorPagina;

        const comprasOrdenadas = [...comprasValidas].sort((a, b) => {
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
    }, [comprasValidas, paginaActual, orden]);

    const cambiarPagina = (nuevaPagina) => {
        setPaginaActual(nuevaPagina);
    };

    return (
        <div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
           
                <thead>
                <tr style={{ backgroundColor: '#333', color: '#e5cc70' }}>
                <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => ordenarCompras('fecha_compra')}>
                           
                        
                            Fecha de Compra {orden.campo === 'fecha_compra' ? (orden.ascendente ? '▲' : '▼') : ''}
                        </th>
                        <th
                            style={{ padding: '5px', cursor: 'pointer' }}
                            onClick={() => ordenarCompras('total')}
                        >
                            Importe {orden.campo === 'total' ? (orden.ascendente ? '▲' : '▼') : ''}
                        </th>
                        <th style={{ padding: '5px' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {comprasPaginadas.length > 0 ? (
                        comprasPaginadas.map((compra) => (
                            <tr key={compra.id} style={{ textAlign: 'center', borderBottom: '1px solid #444' }}>
                                <td style={{ padding: '5px', color: '#fff' }}>
                                    {new Date(compra.fecha_compra).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '5px', color: '#fff' }}>
                                    {Number(compra.total || 0).toFixed(2)} €
                                </td>
                                <td style={{ padding: '5px' }}>
                                    <a
                                        href={`/mi-cuenta/compras/${compra.id}/descargar-pdf`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            backgroundColor: '#e5cc70',
                                            color: '#000',
                                            padding: '5px 10px',
                                            textDecoration: 'none',
                                            borderRadius: '5px',
                                        }}
                                    >
                                        Descargar PDF
                                    </a>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ color: '#fff', padding: '5px', textAlign: 'center' }}>
                                No tienes compras registradas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Controles de paginación */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '10px' }}>
                {Array.from({ length: Math.ceil(comprasValidas.length / comprasPorPagina) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => cambiarPagina(index + 1)}
                        style={{
                            padding: '4px 8px',
                            backgroundColor: paginaActual === index + 1 ? '#e5cc70' : '#333',
                            color: paginaActual === index + 1 ? '#000' : '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '3px',
                            fontSize: '0.8rem',
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TablaCompras;
