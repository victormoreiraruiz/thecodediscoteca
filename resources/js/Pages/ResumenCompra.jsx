import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const ResumenCompra = () => {
    const props = usePage().props;
    const { carrito = [], total = 0, user = null, errors = {}, eventos = [] } = props; // Añadido `eventos` a las props
    const [pagarConSaldo, setPagarConSaldo] = useState(false);
    const [pagoRealizado, setPagoRealizado] = useState(false);

    const saldoActual = parseFloat(user?.saldo || 0);
    const saldoRestante = pagarConSaldo ? saldoActual - total : saldoActual;

    const eliminarCarrito = () => {
        Cookies.remove("carrito", { path: "/" });
    };

    const validarDisponibilidad = () => {
        for (const item of carrito) {
            const evento = eventos.find((e) => e.id === item.evento_id);
            if (!evento) continue;

            const entradasVendidas = evento.entradas_vendidas || 0;
            const capacidadRestante = evento.capacidad_total - entradasVendidas;

            if (item.cantidad > capacidadRestante) {
                Swal.fire({
                    icon: "error",
                    title: "Entradas agotadas",
                    text: `No hay suficientes entradas disponibles para el evento "${evento.nombre}". Quedan ${capacidadRestante} entradas disponibles.`,
                    confirmButtonColor: "#860303",
                    customClass: {
                        confirmButton: 'bg-[#860303] text-white px-10 py-2 rounded-lg hover:bg-red-700',
                      },
                });
                return false;
            }
        }
        return true;
    };

    const handleConfirmarCompra = () => {
        if (!user) {
            Swal.fire({
                icon: "warning",
                title: "¡Inicia sesión!",
                text: "Debes iniciar sesión para confirmar tu compra.",
                customClass: {
                    confirmButton: 'bg-[#860303] text-white px-10 py-2 rounded-lg hover:bg-red-700',
                  },
                confirmButtonColor: "#860303",
            });
            return;
        }
    
        if (!pagarConSaldo && !pagoRealizado) {
            Swal.fire({
                icon: "warning",
                title: "Selecciona un método de pago",
                text: "Debes seleccionar un método de pago antes de continuar.",
                confirmButtonColor: "#860303",
                customClass: {
                    confirmButton: 'bg-[#860303] text-white px-10 py-2 rounded-lg hover:bg-red-700',
                  },
            });
            return;
        }
    
        Inertia.post(
            "/confirmar-compra",
            { carrito, total, pagarConSaldo },
            {
                onSuccess: () => {
                    Swal.fire({
                        icon: "success",
                        title: "¡Compra confirmada!",
                        text: "Tu compra se ha realizado con éxito.",
                        confirmButtonColor: "#e5cc70",
                    });
                    eliminarCarrito();
                },
                onError: (errors) => {
                    // Capturar el mensaje de error del backend y mostrarlo en SweetAlert
                    const errorMessage = errors?.response?.data?.error || "Ocurrió un problema al procesar la compra.";
                    Swal.fire({
                        icon: "error",
                        title: "Error en la compra",
                        text: errorMessage,
                        confirmButtonColor: "#860303",
                    });
                },
            }
        );
    };
    

    useEffect(() => {
        if (errors.error) {
            Swal.fire({
                icon: "error",
                title: "Error en la compra",
                text: errors.error,
                confirmButtonColor: "#860303",
            });
        }
    }, [errors]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=AYd5L69B51NLRWuwIDbxKLgC4eQy84SSb_7OSQwBxOBo_gRYowPqkBX5aNtjGxPqsa8Q4Y3ApHXEE2DK&currency=EUR&disable-funding=card`;
        script.async = true;
        script.onload = () => {
            if (window.paypal) {
                window.paypal.Buttons({
                    createOrder: (data, actions) => {
                        if (!user) {
                            Swal.fire({
                                icon: "warning",
                                title: "¡Inicia sesión!",
                                text: "Debes iniciar sesión para proceder con PayPal.",
                                customClass: {
                                    confirmButton: 'bg-[#860303] text-white px-10 py-2 rounded-lg hover:bg-red-700',
                                  },
                                confirmButtonColor: "#860303",
                            });
                            return Promise.reject();
                        }

                        if (!validarDisponibilidad()) {
                            return Promise.reject();
                        }

                        return actions.order.create({
                            purchase_units: [{ amount: { value: total.toFixed(2) } }],
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then((details) => {
                            Swal.fire({
                                icon: "success",
                                title: "¡Pago realizado!",
                                text: `Pago confirmado por ${details.payer.name.given_name}.`,
                                confirmButtonColor: "#e5cc70",
                            });
                            setPagoRealizado(true);
                            Inertia.post("/confirmar-compra", { carrito, total, pagarConSaldo: false }, {
                                onSuccess: () => {
                                    eliminarCarrito();
                                },
                            });
                        });
                    },
                }).render("#paypal-button-container");
            }
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, [total, carrito, user]);

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6 border-4 border-[#e5cc70]">
            <h2 className="text-2xl font-semibold text-[#860303] text-center mb-4">Resumen de Compra</h2>

            <div className="space-y-4">
                {carrito.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-700">
                            {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)} x {item.cantidad}
                        </h3>
                        <p className="text-gray-600">Precio: {(item.precio * item.cantidad).toFixed(2)}€</p>
                    </div>
                ))}
            </div>

            <h2 className="text-xl font-semibold text-[#860303] mt-6">Total a Pagar: {total.toFixed(2)}€</h2>

            <div className="mt-4 p-4 border rounded-lg bg-[#e5cc70]">
                <h3 className="text-lg font-semibold text-[#860303]">Saldo Disponible: {saldoActual.toFixed(2)}€</h3>
                {pagarConSaldo && <h3 className="text-md text-gray-700">Saldo Restante: {saldoRestante.toFixed(2)}€</h3>}

                <label className="flex items-center mt-2">
                    <input
                        type="checkbox"
                        checked={pagarConSaldo}
                        onChange={(e) => setPagarConSaldo(e.target.checked)}
                        disabled={saldoActual < total}
                        className="form-checkbox h-5 w-5 text-[#860303]"
                    />
                    <span className="ml-2 text-gray-700">Pagar con saldo</span>
                </label>

                {saldoActual < total && <p className="text-red-500 text-sm mt-2">Saldo insuficiente para esta compra.</p>}
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    onClick={handleConfirmarCompra}
                    className="bg-[#860303] text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-red-800 transition duration-200"
                >
                    Confirmar Compra
                </button>
            </div>

            <div className="mt-4 flex justify-center">
                <button
                    onClick={() => window.history.back()}
                    className="bg-[#e5cc70] text-black font-bold py-2 px-6 rounded-lg shadow hover:bg-yellow-500 transition duration-200"
                >
                    Volver Atrás
                </button>
            </div>

            <div id="paypal-button-container" className="mt-6 flex justify-center"></div>
        </div>
    );
};

export default ResumenCompra;
