import React, { useState, useEffect } from "react";
import axios from "axios";

const CamareroHistorialComandas = ({ nuevaComanda }) => {
    const [comandas, setComandas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventosVisibles, setEventosVisibles] = useState({}); // Control de visibilidad por evento

    useEffect(() => {
        obtenerHistorialComandas();
    }, []);

    useEffect(() => {
        if (nuevaComanda) {
            setComandas((prevComandas) => [...prevComandas, nuevaComanda]);
        }
    }, [nuevaComanda]);

    const obtenerHistorialComandas = async () => {
        try {
            const response = await axios.get("/comandas/historial");
            setComandas(response.data);
        } catch (error) {
            console.error("Error al obtener el historial de comandas:", error);
        } finally {
            setLoading(false);
        }
    };

    // Agrupar comandas por evento
    const comandasPorEvento = comandas.reduce((acc, comanda) => {
        const eventoId = comanda.evento_id;
        const eventoNombre = comanda.evento?.nombre || `Evento ID ${eventoId}`;
        if (!acc[eventoId]) {
            acc[eventoId] = {
                nombre: eventoNombre,
                comandas: [],
            };
        }
        acc[eventoId].comandas.push(comanda);
        return acc;
    }, {});

    const toggleEvento = (eventoId) => {
        setEventosVisibles((prev) => ({
            ...prev,
            [eventoId]: !prev[eventoId],
        }));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-xl font-semibold text-[#860303]">📜 Historial de Comandas</h3>
            <p className="text-lg mb-4">Aquí puedes ver todas las comandas entregadas organizadas por evento.</p>

            {loading ? (
                <p className="text-center text-gray-500">Cargando historial...</p>
            ) : Object.keys(comandasPorEvento).length === 0 ? (
                <p className="text-center text-gray-500">No hay comandas entregadas aún.</p>
            ) : (
                <div className="space-y-4">
                    {Object.entries(comandasPorEvento).map(([eventoId, evento]) => (
                        <div key={eventoId} className="border rounded-lg shadow-md bg-[#e5cc70] p-4">
                            <button
                                onClick={() => toggleEvento(eventoId)}
                                className="w-full text-left font-semibold text-lg flex justify-between text-[#860303] bg-yellow-300 p-2 rounded hover:bg-yellow-400"
                            >
                                {evento.nombre}
                                <span>{eventosVisibles[eventoId] ? "🔽" : "▶️"}</span>
                            </button>

                            {eventosVisibles[eventoId] && (
                                <div className="mt-2 space-y-4">
                                    {evento.comandas.map((comanda) => (
                                        <div key={comanda.id} className="border p-4 rounded bg-white shadow">
                                            <h3 className="text-lg font-semibold text-[#860303]">Mesa {comanda.mesa_id}</h3>
                                            <p className="text-gray-800"><strong>Atendido por:</strong> {comanda.usuario?.name || "Desconocido"}</p>
                                            <p className="text-gray-800"><strong>Fecha:</strong> {new Date(comanda.updated_at).toLocaleString()}</p>
                                            
                                            <h4 className="text-md font-semibold mt-2">🛒 Productos:</h4>
                                            <ul className="list-disc ml-4">
                                                {comanda.productos.map((producto) => (
                                                    <li key={producto.id}>
                                                        {producto.nombre} x {producto.pivot.cantidad} - <strong>{(producto.precio * producto.pivot.cantidad).toFixed(2)}€</strong>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CamareroHistorialComandas;
