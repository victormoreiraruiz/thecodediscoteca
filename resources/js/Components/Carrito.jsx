import React, { useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import { usePage } from "@inertiajs/react";
import Swal from "sweetalert2";

const Carrito = ({ carrito, setCarrito, mostrarCarrito, setMostrarCarrito }) => {
    const { auth, aforoEventos = {} } = usePage().props; // Recibe aforoEventos con la capacidad máxima de cada evento

    useEffect(() => {
        const carritoGuardado = Cookies.get("carrito");
        if (carritoGuardado) {
            const parsedCarrito = JSON.parse(carritoGuardado);
            if (parsedCarrito.userId !== auth.user?.id) {
                Cookies.remove("carrito", { path: "/" });
                setCarrito([]);
            } else {
                setCarrito(parsedCarrito.items || []);
            }
        }
    }, [auth.user?.id, setCarrito]);

    useEffect(() => {
        if (carrito.length > 0) {
            Cookies.set(
                "carrito",
                JSON.stringify({ userId: auth.user?.id, items: carrito }),
                { expires: 7, path: "/" }
            );
        } else {
            Cookies.remove("carrito", { path: "/" });
        }
    }, [carrito, auth.user?.id]);

    const eliminarDelCarrito = (tipo, eventoId) => {
        setCarrito(carrito.filter((item) => !(item.tipo === tipo && item.eventoId === eventoId)));
    };

    const actualizarCantidad = (tipo, eventoId, cantidad) => {
        const aforoMaximo = aforoEventos[eventoId] || Infinity; // Aforo máximo del evento
        const entradasVendidas = carrito
            .filter((item) => item.eventoId === eventoId)
            .reduce((sum, item) => sum + item.cantidad, 0);

        if (cantidad > aforoMaximo) {
            Swal.fire({
                icon: "warning",
                title: "Aforo Máximo Alcanzado",
                text: `Solo se pueden vender ${aforoMaximo} entradas para este evento.`,
                confirmButtonColor: "#860303",
            });
            return;
        }

        if (entradasVendidas + cantidad > aforoMaximo) {
            Swal.fire({
                icon: "warning",
                title: "No hay suficientes entradas",
                text: `Solo quedan ${aforoMaximo - entradasVendidas} entradas disponibles.`,
                confirmButtonColor: "#860303",
            });
            return;
        }

        setCarrito(
            carrito.map((item) =>
                item.tipo === tipo && item.eventoId === eventoId
                    ? { ...item, cantidad }
                    : item
            )
        );
    };

    const agregarAlCarrito = (nuevoItem) => {
        const aforoMaximo = aforoEventos[nuevoItem.eventoId] || Infinity;
        const entradasVendidas = carrito
            .filter((item) => item.eventoId === nuevoItem.eventoId)
            .reduce((sum, item) => sum + item.cantidad, 0);

        if (entradasVendidas + nuevoItem.cantidad > aforoMaximo) {
            Swal.fire({
                icon: "error",
                title: "No hay suficientes entradas",
                text: `Solo quedan ${aforoMaximo - entradasVendidas} entradas disponibles.`,
                confirmButtonColor: "#860303",
            });
            return;
        }

        setCarrito([...carrito, nuevoItem]);
    };

    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
    };

    const finalizarCompra = () => {
        Inertia.post("/iniciar-compra", { carrito });
        setMostrarCarrito(false);
    };

    const calcularCantidadTotal = () => {
        return carrito.reduce((total, item) => total + item.cantidad, 0);
    };

    return (
        <>
            {carrito.length > 0 && (
                <div className="fixed bottom-5 right-5 bg-[#e5cc70] text-[#860303] p-3 rounded-full shadow-lg cursor-pointer hover:bg-yellow-500 transition duration-200" onClick={() => setMostrarCarrito(true)}>
                    🛒
                    <span className="ml-2 font-bold">{calcularCantidadTotal()}</span>
                </div>
            )}

            {mostrarCarrito && (
                <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-6 overflow-y-auto border-l-4 border-[#e5cc70]">
                    <button className="text-[#860303] text-xl absolute top-4 right-4" onClick={() => setMostrarCarrito(false)}>
                        ✖
                    </button>
                    <h2 className="text-xl font-semibold text-[#860303] mb-4">Carrito de Compras</h2>

                    {carrito.length === 0 ? (
                        <p className="text-gray-600">El carrito está vacío</p>
                    ) : (
                        <ul className="space-y-4">
                            {carrito.map((item) => (
                                <li key={`${item.tipo}-${item.eventoId}`} className="flex justify-between items-center p-2 border-b border-gray-300">
                                    <span className="text-gray-800">
                                        {item.nombre_evento || "Evento desconocido"} - {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                                    </span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.cantidad}
                                        onChange={(e) => actualizarCantidad(item.tipo, item.eventoId, parseInt(e.target.value))}
                                        className="w-16 border rounded text-center"
                                    />
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => eliminarDelCarrito(item.tipo, item.eventoId)}
                                    >
                                        ❌
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="mt-4">
                        <h3 className="text-lg font-semibold text-[#860303]">Total: {calcularTotal().toFixed(2)}€</h3>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setCarrito([])}>
                            Vaciar Carrito
                        </button>
                        <button className="bg-[#860303] text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200" onClick={finalizarCompra}>
                            Tramitar Compra
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Carrito;
