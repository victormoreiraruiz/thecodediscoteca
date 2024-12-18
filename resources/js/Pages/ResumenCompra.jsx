import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import Cookies from 'js-cookie';

const ResumenCompra = () => {
    const props = usePage().props;
    const { carrito = [], total = 0, user = null } = props;
    const [nombre, setNombre] = useState(user ? user.nombre : '');
    const [correo, setCorreo] = useState(user ? user.correo : '');
    const [pagarConSaldo, setPagarConSaldo] = useState(false);
    const [pagoRealizado, setPagoRealizado] = useState(false);

    const saldoActual = parseFloat(user?.saldo || 0);
    const saldoRestante = pagarConSaldo ? saldoActual - total : saldoActual;

    const eliminarCarrito = () => {
        // Forzar eliminación de la cookie de forma manual
        document.cookie = "carrito=; path=/; domain=127.0.0.1; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "carrito=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    
        // Intentar con js-cookie como respaldo
        Cookies.remove('carrito', { path: '/', domain: '127.0.0.1' });
        Cookies.remove('carrito', { path: '/' });
    
        console.log('Intentando eliminar cookie carrito');
        console.log('Estado actual de las cookies:', document.cookie);
    };
    

    const handleConfirmarCompra = () => {
        if (!user) {
            alert('Debes iniciar sesión para confirmar tu compra.');
            Inertia.visit('/login');
            return;
        }
    
        if (!pagarConSaldo && !pagoRealizado) {
            alert('Debes seleccionar un método de pago para confirmar tu compra.');
            return;
        }
    
        Inertia.post('/confirmar-compra', {
            carrito,
            total,
            pagarConSaldo,
        }, {
            onSuccess: () => {
                alert('¡Compra confirmada!');
                eliminarCarrito(); // Llamamos a la función para eliminar la cookie
            },
            onError: (errors) => {
                alert(errors.saldo || errors.error || 'Error al realizar la compra.');
            },
        });
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
                                amount: { value: total.toFixed(2) },
                            }],
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then(details => {
                            alert('¡Pago realizado con éxito por ' + details.payer.name.given_name + '!');
                            setPagoRealizado(true);
                            Inertia.post('/confirmar-compra', { carrito, total, pagarConSaldo: false }, {
                                onSuccess: () => {
                                    eliminarCookieCarrito(); // Elimina la cookie aquí también
                                }
                            });
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

            <div className="opciones-pago">
                <h3>Saldo Actual: {saldoActual.toFixed(2)}€</h3>
                {pagarConSaldo && <h3>Saldo Restante: {saldoRestante.toFixed(2)}€</h3>}
                <label>
                    <input
                        type="checkbox"
                        checked={pagarConSaldo}
                        onChange={(e) => setPagarConSaldo(e.target.checked)}
                        disabled={saldoActual < total}
                    />
                    Pagar con saldo
                </label>
                {saldoActual < total && <p style={{ color: 'red' }}>Saldo insuficiente para esta compra.</p>}
                <button onClick={handleConfirmarCompra} className="confirmar-compra-boton">
                    Confirmar Compra
                </button>
                <br />
                <button onClick={() => window.history.back()} className="volver-atras-boton" style={{ marginTop: '10px' }}>
                    Volver Atrás
                </button>
            </div>

            <div id="paypal-button-container" style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}></div>
        </div>
    );
};

export default ResumenCompra;
