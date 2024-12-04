import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';

const AñadirSaldoComponente = () => {
    const [saldo, setSaldo] = useState('');
    const [paypalLoaded, setPaypalLoaded] = useState(false);

    const handlePayPalScriptLoad = () => {
        if (window.paypal) {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    if (!saldo || parseFloat(saldo) <= 0) {
                        alert('Por favor, introduce un monto válido.');
                        return;
                    }
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: saldo,
                                },
                            },
                        ],
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(() => {
                        // Llamada al servidor para añadir el saldo
                        Inertia.post(route('añadir-saldo'), { saldo }, {
                            onSuccess: () => {
                                alert('Saldo añadido correctamente.');
                                Inertia.visit(route('mi-cuenta')); // Redirige a "Mi Cuenta"
                            },
                            onError: (error) => {
                                console.error(error);
                                alert('Hubo un problema al añadir el saldo.');
                            },
                        });
                    });
                },
                onError: (err) => {
                    console.error('Error en el pago con PayPal:', err);
                    alert('Hubo un problema al procesar el pago con PayPal.');
                },
            }).render('#paypal-button-container');
        }
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=AYd5L69B51NLRWuwIDbxKLgC4eQy84SSb_7OSQwBxOBo_gRYowPqkBX5aNtjGxPqsa8Q4Y3ApHXEE2DK&currency=EUR&disable-funding=card`;
        script.async = true;
        script.onload = () => {
            setPaypalLoaded(true);
            handlePayPalScriptLoad();
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [saldo]);

    return (
        <div className="añadir-saldo-container">
            <h2>Añadir Saldo</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!saldo || parseFloat(saldo) <= 0) {
                        alert('Por favor, introduce un monto válido.');
                        return;
                    }
                }}
                className="añadir-saldo-form"
            >
                <label>
                    Monto a añadir (€):
                    <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={saldo}
                        onChange={(e) => setSaldo(e.target.value)}
                        required
                        className="añadir-saldo-input"
                    />
                </label>
            </form>
            <div id="paypal-button-container" style={{ marginTop: '20px' }}>
                {}
            </div>
        </div>
    );
};

export default AñadirSaldoComponente;
