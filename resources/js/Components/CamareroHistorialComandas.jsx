import React, { useState, useEffect } from "react";
import axios from "axios";

const CamareroHistorialComandas = ({ nuevaComanda }) => {
    const [comandas, setComandas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerHistorialComandas();
    }, []);

    useEffect(() => {
        if (nuevaComanda) {
            setComandas((prevComandas) => [...prevComandas, nuevaComanda]); // Agregar la nueva comanda entregada
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

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-xl font-semibold text-[#860303]">📜 Historial de Comandas</h3>
            <p className="text-lg mb-4">Aquí puedes ver todas las comandas entregadas.</p>

            {loading ? (
                <p className="text-center text-gray-500">Cargando historial...</p>
            ) : comandas.length === 0 ? (
                <p className="text-center text-gray-500">No hay comandas entregadas aún.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {comandas.map((comanda) => (
                        <div key={comanda.id} className="border p-4 rounded shadow-md bg-[#e5cc70]">
                            <h3 className="text-lg font-semibold text-[#860303]">Mesa {comanda.mesa_id}</h3>
                            <p className="text-gray-800"><strong>Atendido por:</strong> {comanda.usuario?.name || "Desconocido"}</p>
                            <p className="text-gray-800"><strong>Fecha:</strong> {new Date(comanda.updated_at).toLocaleString()}</p>
                            
                            <h4 className="text-lg font-semibold mt-2">🛒 Productos:</h4>
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
    );
};

export default CamareroHistorialComandas;
