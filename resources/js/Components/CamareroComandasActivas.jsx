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

    const seleccionarComanda = (comanda) => {
        setComandaSeleccionada(comanda);
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

            setComandaSeleccionada(null);
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
                        className="border p-4 rounded shadow-md bg-[#e5cc70] cursor-pointer hover:bg-yellow-500"
                        onClick={() => seleccionarComanda(comanda)}
                    >
                        <h3 className="text-lg font-semibold">Mesa {comanda.mesa_id}</h3>
                        <p className="text-gray-800">Estado: <strong>{comanda.estado}</strong></p>
                        <p className="text-gray-600">Usuario: {comanda.usuario?.name || "Desconocido"}</p>
                    </div>
                ))}
            </div>

            {comandaSeleccionada && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold text-center">Detalles de la Comanda</h3>
                        <p className="text-lg mt-2"><strong>Mesa:</strong> {comandaSeleccionada.mesa_id}</p>
                        <p className="text-lg"><strong>Estado:</strong> {comandaSeleccionada.estado}</p>
                        <h4 className="text-lg font-semibold mt-4">Productos:</h4>
                        <ul>
                            {comandaSeleccionada.productos.map((producto) => (
                                <li key={producto.id} className="flex justify-between border-b py-2">
                                    <span>{producto.nombre} x {producto.pivot.cantidad}</span>
                                    <span>{(producto.precio * producto.pivot.cantidad).toFixed(2)}€</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={() => actualizarEstado(comandaSeleccionada.id, "preparando")}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Preparando
                            </button>
                            <button
                                onClick={() => actualizarEstado(comandaSeleccionada.id, "entregado")}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Entregado
                            </button>
                        </div>

                        <button
                            onClick={() => setComandaSeleccionada(null)}
                            className="bg-red-500 text-white px-4 py-2 rounded w-full mt-4 hover:bg-red-700"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CamareroComandasActivas;
