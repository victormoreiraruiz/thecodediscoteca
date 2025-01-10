import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const HacerComanda = ({ eventoId }) => {
    const [mesa, setMesa] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [paso, setPaso] = useState(1); // 1: Ingresar mesa, 2: Seleccionar categoría, 3: Agregar productos

    useEffect(() => {
        axios.get("/categorias")
            .then((response) => {
                setCategorias(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener las categorías:", error);
            });
    }, []);

    const seleccionarCategoria = async (categoriaId) => {
        setCategoriaSeleccionada(categoriaId);
        setPaso(3); // Pasar a la selección de productos

        try {
            const response = await axios.get(`/productos?categoria_id=${categoriaId}`);
            setProductos(response.data);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    };

    const agregarAlCarrito = (producto) => {
        setCarrito((prev) => {
            const existe = prev.find((p) => p.id === producto.id);
            if (existe) {
                return prev.map((p) =>
                    p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
                );
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });
    };

    // **Función para eliminar productos del carrito**
    const eliminarDelCarrito = (id) => {
        setCarrito((prev) => prev.filter((p) => p.id !== id));
    };

    const enviarComanda = async () => {
        if (!mesa) {
            Swal.fire("Error", "Por favor ingresa tu número de mesa.", "error");
            return;
        }

        const datosComanda = {
            evento_id: eventoId,
            mesa_id: parseInt(mesa),
            productos: carrito.map((p) => ({ id: p.id, cantidad: p.cantidad })),
        };

        console.log("Enviando comanda:", datosComanda); // Ver qué se está enviando

        try {
            await axios.post("/comandas", datosComanda);

            Swal.fire("Éxito", "Comanda enviada con éxito", "success");
            setCarrito([]);
            setPaso(1);
            setMesa("");
        } catch (error) {
            if (error.response) {
                console.error("Error en la comanda:", error.response.data);
                Swal.fire("Error", error.response.data.message || "No se pudo enviar la comanda", "error");
            } else {
                Swal.fire("Error", "Error de conexión con el servidor", "error");
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-6 text-[#860303]">🍹 Comienza tu pedido 🍹</h2>

            {/* Paso 1: Ingresar número de mesa */}
            {paso === 1 && (
                <div className="bg-[#e5cc70] p-6 shadow-md rounded-md text-center">
                    <h3 className="text-xl font-semibold mb-4 text-[#860303]">Indica tu número de mesa</h3>
                    <input
                        type="number"
                        value={mesa}
                        onChange={(e) => setMesa(e.target.value)}
                        className="border p-2 w-full mb-4 text-center rounded-md"
                        placeholder="Ejemplo: 12"
                    />
                    <button
                        onClick={() => setPaso(2)}
                        className="bg-[#860303] text-white px-4 py-2 rounded w-full hover:bg-red-800 font-bold"
                    >
                        Confirmar
                    </button>
                </div>
            )}

            {/* Paso 2: Seleccionar categoría */}
            {paso === 2 && (
                <div className="bg-[#e5cc70] p-6 shadow-md rounded-md">
                    <h3 className="text-xl font-semibold mb-4 text-[#860303]">Selecciona una categoría</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {categorias.map((categoria) => (
                            <button
                                key={categoria.id}
                                onClick={() => seleccionarCategoria(categoria.id)}
                                className="border p-4 rounded bg-gray-100 hover:bg-gray-300 text-lg font-medium text-[#860303]"
                            >
                                {categoria.nombre}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Paso 3: Mostrar productos */}
            {paso === 3 && (
                <div className="bg-[#e5cc70] p-6 shadow-md rounded-md">
                    <h3 className="text-xl font-semibold mb-4 text-[#860303]">Selecciona productos</h3>
                    <button
                        onClick={() => setPaso(2)}
                        className="bg-gray-500 text-white px-3 py-1 rounded mb-4"
                    >
                        🔙 Volver a categorías
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                        {productos.map((producto) => (
                            <div key={producto.id} className="border p-4 flex justify-between bg-gray-50 rounded-lg">
                                <span className="text-lg font-medium text-[#860303]">{producto.nombre} - {producto.precio}€</span>
                                <button
                                    onClick={() => agregarAlCarrito(producto)}
                                    className="bg-[#860303] text-white px-3 py-1 rounded hover:bg-red-800"
                                >
                                    ➕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Carrito con resumen antes de confirmar */}
            {carrito.length > 0 && (
                <div className="bg-[#e5cc70] p-6 shadow-md rounded-md mt-6">
                    <h3 className="text-xl font-semibold mb-4 text-[#860303]">🛒 Tu pedido</h3>
                    <ul>
                        {carrito.map((item) => (
                            <li key={item.id} className="flex justify-between border-b py-2 text-[#860303]">
                                <span className="text-lg font-medium">
                                    {item.nombre} x {item.cantidad} - <strong>{(item.cantidad * item.precio).toFixed(2)}€</strong>
                                </span>
                                <button
                                    onClick={() => eliminarDelCarrito(item.id)}
                                    className="bg-[#860303] text-white px-2 py-1 rounded hover:bg-red-800"
                                >
                                    ❌
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={enviarComanda}
                        className="bg-[#860303] text-white px-4 py-2 rounded w-full hover:bg-red-800 mt-4 font-bold"
                    >
                        Confirmar Pedido
                    </button>
                </div>
            )}
        </div>
    );
};

export default HacerComanda;
