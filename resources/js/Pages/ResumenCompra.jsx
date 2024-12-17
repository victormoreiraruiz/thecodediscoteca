import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

const ResumenCompra = () => {
    const props = usePage().props;
    const { carrito = [], total = 0, user = null } = props;
    const [nombre, setNombre] = useState(user ? user.nombre : '');
    const [correo, setCorreo] = useState(user ? user.correo : '');
    const [pagarConSaldo, setPagarConSaldo] = useState(false);

    // Calcular el saldo actual y el saldo restante asegurando valores válidos
    const saldoActual = parseFloat(user?.saldo || 0); // Asegurarse de que siempre sea un número
    const saldoRestante = pagarConSaldo ? saldoActual - total : saldoActual;

    const handleConfirmarCompra = () => {
        if (!user) {
            alert('Debes iniciar sesión para confirmar tu compra.');
            Inertia.visit('/login'); // Redirige a la página de registro
            return;
        }

        Inertia.post('/confirmar-compra', {
            carrito,
            total,
            pagarConSaldo,
        }, {
            onSuccess: () => alert('¡Compra confirmada!'),
            onError: (errors) => alert(errors.saldo || errors.error || 'Error al realizar la compra.'),
        });
    };

    const handleVolverAtras = () => {
        window.history.back(); // Regresa a la página anterior
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=AYd5L69B51NLRWuwIDbxKLgC4eQy84SSb_7OSQwBxOBo_gRYowPqkBX5aNtjGxPqsa8Q4Y3ApHXEE2DK&currency=EUR&disable-funding=card`;
        script.async = true;
        script.onload = () => {
            if (window.paypal) {
                window.paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: total.toFixed(2),
                                },
                            }],
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then(details => {
                            alert('¡Pago realizado con éxito por ' + details.payer.name.given_name + '!');
                            Inertia.post('/confirmar-compra', { carrito, total, pagarConSaldo: false });
                        });
                    },
                    onError: (err) => {
                        console.error('Error en el pago de PayPal:', err);
                        alert('Hubo un error al procesar el pago con PayPal.');
                    },
                }).render('#paypal-button-container');
            }
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [total, carrito]);

    return (
        <div className="resumen-compra">
            <h2>Resumen de Compra</h2>
            <div className="productos">
                {carrito.map((item, index) => (
                    <div key={index} className="producto">
                        <h3>
                            Entrada {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)} x {item.cantidad} 
                            Precio: {(item.precio * item.cantidad).toFixed(2)}€
                        </h3>
                    </div>
                ))}
            </div>

            <h2>Total a Pagar: {total.toFixed(2)}€</h2>

            <div className="datos-comprador">
                <h3>Datos del Comprador</h3>
                <form>
                    <label>
                        <h6>Nombre:</h6>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            disabled={!!user}
                        />
                    </label>
                    <label>
                        <h6>Correo:</h6>
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                            disabled={!!user}
                        />
                    </label>
                </form>
            </div>

            <div className="opciones-pago">
                <h3>Saldo Actual: {saldoActual.toFixed(2)}€</h3>
                {pagarConSaldo && (
                    <h3>Saldo Restante: {saldoRestante.toFixed(2)}€</h3>
                )}
                <label>
                    <input
                        type="checkbox"
                        checked={pagarConSaldo}
                        onChange={(e) => setPagarConSaldo(e.target.checked)}
                        disabled={saldoActual < total}
                    />
                    Pagar con saldo
                </label>
                {saldoActual < total && (
                    <p style={{ color: 'red' }}>Saldo insuficiente para esta compra.</p>
                )}
                <button onClick={handleConfirmarCompra} className="confirmar-compra-boton">
                    Confirmar Compra
                </button>
                <br />
                <button onClick={handleVolverAtras} className="volver-atras-boton" style={{ marginTop: '10px' }}>
                    Volver Atrás
                </button>
            </div>

            {/* Contenedor del botón PayPal */}
            <div id="paypal-button-container" style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* Botón de PayPal */}
            </div>
        </div>
    );
};

export default ResumenCompra;
