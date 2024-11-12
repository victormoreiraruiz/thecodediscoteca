import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

const ResumenCompra = () => {
    const props = usePage().props;
    const { carrito = [], total = 0, user = null } = props;
    const [nombre, setNombre] = useState(user ? user.nombre : '');
    const [correo, setCorreo] = useState(user ? user.correo : '');
    const [pagarConSaldo, setPagarConSaldo] = useState(false);

    const saldoSuficiente = user && user.saldo >= total;

    useEffect(() => {
        console.log("Saldo del usuario:", user ? user.saldo : "No disponible");
        console.log("Total de la compra:", total);
        console.log("Saldo suficiente:", saldoSuficiente);
    }, [user, total, saldoSuficiente]);

    const handleConfirmarCompra = () => {
        Inertia.post('/checkout', { carrito, nombre, correo, pagarConSaldo }, {
            onSuccess: () => alert('¡Compra confirmada!'),
        });
    };

    const handlePayPalPayment = () => {
        alert("Redirigiendo a PayPal...");
    };

    return (
        <div className="resumen-compra">
            <h2>Resumen de Compra</h2>
            <div className="productos">
                {carrito.map((item, index) => (
                    <div key={index} className="producto">
                        <h3>Entrada {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)} x {item.cantidad} Precio: {(item.precio * item.cantidad).toFixed(2)}€</h3>
                    </div>
                ))}
            </div>

            <h2>Total a Pagar: {total.toFixed(2)}€</h2>

            <div className="datos-comprador">
                <h3>Datos del Comprador</h3>
                <form>
                    <label>
                        Nombre:
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            disabled={!!user}
                        />
                    </label>
                    <label>
                        Correo:
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
                <label style={{ color: 'white' }}>
                    <input
                        type="checkbox"
                        checked={pagarConSaldo}
                        onChange={(e) => setPagarConSaldo(e.target.checked)}
                        disabled={!saldoSuficiente}
                    />
                    Pagar con saldo
                </label>
                {!saldoSuficiente && (
                    <p style={{ color: 'red' }}>Saldo insuficiente para esta compra.</p>
                )}
                <button onClick={handlePayPalPayment} className="paypal-boton">
                    Pagar con PayPal
                </button>
            </div>
            <br></br>

            <button onClick={handleConfirmarCompra} className="confirmar-compra-boton">
                Confirmar Compra
            </button>
        </div>
    );
};

export default ResumenCompra;
