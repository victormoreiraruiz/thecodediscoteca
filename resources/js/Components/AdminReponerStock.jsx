import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminReponerStock = () => {
    const [productos, setProductos] = useState([]);
    const [cantidades, setCantidades] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        obtenerProductos();
    }, []);

    const obtenerProductos = async () => {
        try {
            const response = await axios.get("/admin/productos");
            setProductos(response.data);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    };

    const manejarCambioCantidad = (id, cantidad) => {
        setCantidades({ ...cantidades, [id]: cantidad });
    };

    const confirmarCompra = async () => {
        const compras = productos
            .filter((producto) => cantidades[producto.id] > 0)
            .map((producto) => ({
                id: producto.id,
                cantidad: parseInt(cantidades[producto.id], 10),
                precioCompra: (producto.precio * 0.3).toFixed(2), // 30% del precio original
            }));

        if (compras.length === 0) {
            Swal.fire("Atención", "No has seleccionado ningún producto para reponer", "warning");
            return;
        }

        // Calcular el total de la compra
        const totalCompra = compras.reduce((acc, item) => acc + item.cantidad * item.precioCompra, 0).toFixed(2);

        Swal.fire({
            title: "¿Confirmar compra de stock?",
            html: `
                <p><strong>Total a pagar:</strong> ${totalCompra}€</p>
                <br/>
                ${compras
                    .map(
                        (c) =>
                            `<strong>${c.cantidad}x</strong> de ${productos.find((p) => p.id === c.id).nombre} a <strong>${c.precioCompra}€</strong> cada uno`
                    )
                    .join("<br>")}
            `,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, confirmar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    await axios.post("/admin/reponer-stock", { compras, totalCompra });

                    Swal.fire("Éxito", "El stock ha sido repuesto correctamente", "success");
                    setCantidades({});
                    obtenerProductos(); // Recargar la lista de productos
                } catch (error) {
                    console.error("Error al reponer stock:", error);
                    Swal.fire("Error", "No se pudo reponer el stock", "error");
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-6 text-[#860303]">📦 Reposición de Stock</h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-[#860303] text-white">
                            <th className="p-3 border">Producto</th>
                            <th className="p-3 border">Stock Actual</th>
                            <th className="p-3 border">Precio Venta</th>
                            <th className="p-3 border">Precio Compra (30%)</th>
                            <th className="p-3 border">Cantidad a Reponer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id} className="border text-center bg-[#e5cc70]">
                                <td className="p-3 border">{producto.nombre}</td>
                                <td className="p-3 border">{producto.stock}</td>
                                <td className="p-3 border">{producto.precio}€</td>
                                <td className="p-3 border">{(producto.precio * 0.3).toFixed(2)}€</td>
                                <td className="p-3 border">
                                    <input
                                        type="number"
                                        min="0"
                                        value={cantidades[producto.id] || ""}
                                        onChange={(e) => manejarCambioCantidad(producto.id, e.target.value)}
                                        className="border rounded px-2 py-1 w-20 text-center"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                onClick={confirmarCompra}
                className="bg-[#860303] text-white font-semibold px-6 py-3 rounded mt-6 block mx-auto hover:bg-red-700"
                disabled={loading}
            >
                {loading ? "Procesando..." : "Confirmar Reposición"}
            </button>
        </div>
    );
};

export default AdminReponerStock;
