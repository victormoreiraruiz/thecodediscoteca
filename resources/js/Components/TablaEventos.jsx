import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const TablaEventos = ({ eventos }) => {
    const [paginaActual, setPaginaActual] = useState(1);
    const [eventosPaginados, setEventosPaginados] = useState([]); // almacena los eventos que se mostrarán en la página actual
    const [orden, setOrden] = useState({ campo: "fecha_evento", ascendente: true });
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroFecha, setFiltroFecha] = useState({ desde: "", hasta: "" });
    const eventosPorPagina = 10;

      // Función para filtrar eventos por el rango de fechas especificado
    const filtrarPorFecha = (eventos) => {
        const { desde, hasta } = filtroFecha;
        if (!desde || !hasta) return eventos; // Si no se han especificado fechas en el filtro, devolver todos los eventos
         // Convertir las fechas del filtro a valores numéricos para comparación
        const fechaDesde = new Date(desde).setHours(0, 0, 0, 0);
        const fechaHasta = new Date(hasta).setHours(23, 59, 59, 999);

        return eventos.filter((evento) => { // Filtrar eventos dentro del rango de fechas
            const fechaEvento = new Date(evento.fecha_evento).getTime();
            return fechaEvento >= fechaDesde && fechaEvento <= fechaHasta;
        });
    };

    const filtrarPorNombre = (eventos) => {  // Función para filtrar eventos por nombre
        if (!filtroNombre) return eventos;  // Si no hay filtro por nombre, devolver todos los eventos
        return eventos.filter((evento) => // buscar por nombre
            evento.nombre_evento.toLowerCase().includes(filtroNombre.toLowerCase())
        );
    };
    // Función para cambiar el campo o la dirección del orden
    const ordenarEventos = (campo) => {
        const esAscendente = orden.campo === campo ? !orden.ascendente : true;
        setOrden({ campo, ascendente: esAscendente });
    };

    useEffect(() => {  // Calcular el índice de inicio y fin para la paginación
        const inicio = (paginaActual - 1) * eventosPorPagina;
        const fin = inicio + eventosPorPagina;

        const eventosFiltrados = filtrarPorNombre(filtrarPorFecha(eventos));  // Aplicar los filtros por fecha y nombre
        const eventosOrdenados = [...eventosFiltrados].sort((a, b) => {     // Ordenar los eventos filtrados según el campo y la dirección especificados
            if (orden.campo === "fecha_evento") {
                return orden.ascendente
                    ? new Date(a.fecha_evento) - new Date(b.fecha_evento)
                    : new Date(b.fecha_evento) - new Date(a.fecha_evento);
            } else if (orden.campo === "nombre_evento") {
                return orden.ascendente
                    ? a.nombre_evento.localeCompare(b.nombre_evento)
                    : b.nombre_evento.localeCompare(a.nombre_evento);
            }
            return 0; // Si el campo no coincide, no cambiar el orden
        });
         // Establecer los eventos que se mostrarán en la página actual
        setEventosPaginados(eventosOrdenados.slice(inicio, fin));
    }, [eventos, paginaActual, orden, filtroNombre, filtroFecha]); // Recalcular cuando cambien estos valores
     // Función para cambiar a una nueva página
    const cambiarPagina = (nuevaPagina) => {
        setPaginaActual(nuevaPagina);
    };

    const handleEliminarEvento = async (eventoId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer. ¿Deseas continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'bg-red-600 text-white font-bold py-2 px-8 rounded-md hover:bg-red-700',
                cancelButton: 'bg-gray-300 text-black font-bold py-2 px-8 rounded-md hover:bg-gray-400',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`/eventos/${eventoId}/cancelar`);
                    Swal.fire({
                        title: 'Evento eliminado',
                        text: response.data.message || 'Evento eliminado con éxito.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'bg-green-600 text-white font-bold py-2 px-8 rounded-md hover:bg-green-700',
                        },
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: error.response?.data?.error || 'Hubo un problema al eliminar el evento. Inténtalo nuevamente.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'bg-red-600 text-white font-bold py-2 px-8 rounded-md hover:bg-red-700',
                        },
                    });
                }
            }
        });
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
