import React, { useState, useEffect } from "react";
import axios from "axios";

const TablaEventos = ({ eventos }) => {
    const [paginaActual, setPaginaActual] = useState(1);
    const [eventosPaginados, setEventosPaginados] = useState([]);
    const [orden, setOrden] = useState({ campo: "fecha_evento", ascendente: true });
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroFecha, setFiltroFecha] = useState({ desde: "", hasta: "" });
    const eventosPorPagina = 10;

    const filtrarPorFecha = (eventos) => {
        const { desde, hasta } = filtroFecha;
        if (!desde || !hasta) return eventos;

        const fechaDesde = new Date(desde).setHours(0, 0, 0, 0);
        const fechaHasta = new Date(hasta).setHours(23, 59, 59, 999);

        return eventos.filter((evento) => {
            const fechaEvento = new Date(evento.fecha_evento).getTime();
            return fechaEvento >= fechaDesde && fechaEvento <= fechaHasta;
        });
    };

    const filtrarPorNombre = (eventos) => {
        if (!filtroNombre) return eventos;
        return eventos.filter((evento) =>
            evento.nombre_evento.toLowerCase().includes(filtroNombre.toLowerCase())
        );
    };

    const ordenarEventos = (campo) => {
        const esAscendente = orden.campo === campo ? !orden.ascendente : true;
        setOrden({ campo, ascendente: esAscendente });
    };

    useEffect(() => {
        const inicio = (paginaActual - 1) * eventosPorPagina;
        const fin = inicio + eventosPorPagina;

        const eventosFiltrados = filtrarPorNombre(filtrarPorFecha(eventos));
        const eventosOrdenados = [...eventosFiltrados].sort((a, b) => {
            if (orden.campo === "fecha_evento") {
                return orden.ascendente
                    ? new Date(a.fecha_evento) - new Date(b.fecha_evento)
                    : new Date(b.fecha_evento) - new Date(a.fecha_evento);
            } else if (orden.campo === "nombre_evento") {
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

    const handleEliminarEvento = async (eventoId) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            const response = await axios.delete(`/eventos/${eventoId}/cancelar`);
            alert(response.data.message || 'Evento eliminado con éxito.');
            location.reload();
        } catch (error) {
            console.error('Error al eliminar el evento:', error);
            alert(error.response?.data?.error || 'Hubo un problema al eliminar el evento. Inténtalo nuevamente.');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-6 p-4 bg-[#e5cc70] text-[#860303] rounded-lg shadow-lg">
            {/* Barra de búsqueda */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <input
                    type="text"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                    placeholder="Buscar por nombre"
                    className="bg-[#860303] text-[#e5cc70] px-3 py-2 rounded-md focus:outline-none w-full md:w-1/3"
                />

                {/* Filtros de fecha */}
                <div className="flex space-x-4 mt-2 md:mt-0">
                    <input
                        type="date"
                        value={filtroFecha.desde}
                        onChange={(e) => setFiltroFecha({ ...filtroFecha, desde: e.target.value })}
                        className="bg-[#860303] text-[#e5cc70] px-2 py-1 rounded-md focus:outline-none"
                    />
                    <input
                        type="date"
                        value={filtroFecha.hasta}
                        onChange={(e) => setFiltroFecha({ ...filtroFecha, hasta: e.target.value })}
                        className="bg-[#860303] text-[#e5cc70] px-2 py-1 rounded-md focus:outline-none"
                    />
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full border-2 border-[#860303] rounded-lg">
                    <thead>
                        <tr className="bg-[#860303] text-[#e5cc70]">
                            <th
                                className="px-4 py-3 text-left cursor-pointer"
                                onClick={() => ordenarEventos("nombre_evento")}
                            >
                                Nombre {orden.campo === "nombre_evento" ? (orden.ascendente ? "▲" : "▼") : ""}
                            </th>
                            <th
                                className="px-4 py-3 text-left cursor-pointer"
                                onClick={() => ordenarEventos("fecha_evento")}
                            >
                                Fecha {orden.campo === "fecha_evento" ? (orden.ascendente ? "▲" : "▼") : ""}
                            </th>
                            <th className="px-4 py-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#860303] bg-[#e5cc70] text-[#860303]">
                        {eventosPaginados.length > 0 ? (
                            eventosPaginados.map((evento) => (
                                <tr key={evento.id} className="hover:bg-[#f0d77b] transition duration-200">
                                    <td className="px-4 py-3">{evento.nombre_evento}</td>
                                    <td className="px-4 py-3">{new Date(evento.fecha_evento).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 flex space-x-2">
                                        <a
                                            href={`/mi-cuenta/eventos/${evento.id}`}
                                            className="bg-[#860303] text-[#e5cc70] px-3 py-2 rounded-lg shadow-md hover:bg-[#a80505] transition duration-300"
                                        >
                                            Ver Detalles
                                        </a>
                                        <a
                                            href={`/api/reservas/${evento.reserva_id}/factura`}
                                            className="bg-[#860303] text-[#e5cc70] px-3 py-2 rounded-lg shadow-md hover:bg-[#a80505] transition duration-300"
                                        >
                                            Descargar Factura
                                        </a>
                                        <button
                                            onClick={() => handleEliminarEvento(evento.id)}
                                            className="bg-red-600 text-white px-1 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                                        >
                                            Borrar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4">No tienes eventos registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TablaEventos;
