import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const CamareroComandasActivas = ({ onComandaEntregada }) => {
    const [comandas, setComandas] = useState([]);
    const [comandaSeleccionada, setComandaSeleccionada] = useState(null);

    useEffect(() => {
        obtenerComandas();
    }, []);

    const obtenerComandas = async () => {
        try {
            const response = await axios.get("/comandas/activas");
            setComandas(response.data);
        } catch (error) {
            console.error("Error al obtener comandas:", error);
        }
    };

    const actualizarEstado = async (id, nuevoEstado) => {
        try {
            await axios.put(`/comandas/${id}/estado`, { estado: nuevoEstado });

            Swal.fire("Éxito", `Comanda marcada como ${nuevoEstado}`, "success");

            if (nuevoEstado === "entregado") {
                // Obtener la comanda actualizada y enviarla al historial
                const comandaEntregada = comandas.find((c) => c.id === id);
                onComandaEntregada(comandaEntregada);

                // Remover la comanda de la lista activa
                setComandas((prevComandas) => prevComandas.filter((c) => c.id !== id));
            } else {
                obtenerComandas(); // Recargar las comandas activas
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo actualizar la comanda", "error");
            console.error("Error al actualizar estado:", error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-6 text-[#860303]">Comandas Activas</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comandas.map((comanda) => (
                    <div 
                        key={comanda.id} 
                        className={`border p-4 rounded shadow-md cursor-pointer ${
                            comanda.estado === "pendiente" ? "bg-[#e5cc70]" : "bg-yellow-500"
                        }`}
                    >
                        <h3 className="text-lg font-bold text-[#860303]">Mesa {comanda.mesa_id}</h3>
                        <p className="text-gray-800"><strong>Estado:</strong> {comanda.estado}</p>
                        <p className="text-gray-600"><strong>Usuario:</strong> {comanda.usuario?.name || "Desconocido"}</p>
                        
                        <h4 className="text-md font-semibold mt-3">🛒 Productos:</h4>
                        <ul className="list-disc ml-4">
                            {comanda.productos.map((producto) => (
                                <li key={producto.id} className="text-gray-800">
                                    {producto.nombre} x {producto.pivot.cantidad} - <strong>{(producto.precio * producto.pivot.cantidad).toFixed(2)}€</strong>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={() => actualizarEstado(comanda.id, "preparando")}
                                className="bg-blue-500 text-white px-1 py-2 rounded hover:bg-blue-700"
                            >
                                Preparando
                            </button>
                            <button
                                onClick={() => actualizarEstado(comanda.id, "entregado")}
                                className="bg-green-500 text-white px-1 py-2 rounded hover:bg-green-700"
                            >
                                Entregado
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CamareroComandasActivas;
