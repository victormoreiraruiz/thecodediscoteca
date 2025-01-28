import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';

const AñadirSaldoComponente = () => {
    const [saldo, setSaldo] = useState(''); // maneja la cantidad ingresada
    const [paypalLoaded, setPaypalLoaded] = useState(false);   // verifica si el script de paypal se carga

    const handlePayPalScriptLoad = () => {  // Función que se ejecuta cuando el script de PayPal se carga
        if (window.paypal) { // Comprueba si la biblioteca de PayPal está disponible
            window.paypal.Buttons({ // Configura y renderiza los botones de PayPal
                createOrder: (data, actions) => {      // Función para crear la orden de compra
                    if (!saldo || parseFloat(saldo) <= 0) {
                        alert('Por favor, introduce un monto válido.');
                        return;
                    }
                    return actions.order.create({  // Crea una orden de PayPal con la cantidad ingresada
                        purchase_units: [
                            {
                                amount: {
                                    value: saldo,
                                },
                            },
                        ],
                    });
                },
                onApprove: (data, actions) => {  // Función que se ejecuta cuando el pago es aprobado
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

    useEffect(() => {  // useEffect para cargar el script de PayPal dinámicamente al cargar el componente
        const script = document.createElement('script');  // Crea un script para cargar el SDK de PayPal
        script.src = `https://www.paypal.com/sdk/js?client-id=AYd5L69B51NLRWuwIDbxKLgC4eQy84SSb_7OSQwBxOBo_gRYowPqkBX5aNtjGxPqsa8Q4Y3ApHXEE2DK&currency=EUR&disable-funding=card`;
        script.async = true; // Carga el script de manera asíncrona
        script.onload = () => {
            setPaypalLoaded(true);  // Marca que el script se ha cargado correctamente
            handlePayPalScriptLoad(); // Configura los botones de PayPal
        };
        document.body.appendChild(script); // Añade el script al cuerpo del documento

        return () => { // Limpia el script al desmontar el componente
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
                        alert('Por favor, introduce una cantidad válida.');
                        return;
                    }
                }}
                className="añadir-saldo-form"
            >
                <label>
                    Saldo a añadir (€):
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
