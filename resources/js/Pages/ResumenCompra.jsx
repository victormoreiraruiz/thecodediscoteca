import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

const ResumenCompra = () => {
    const props = usePage().props;
    const { carrito = [], total = 0, user = null, compraId } = props; // Recibe compraId aquí
    const [nombre, setNombre] = useState(user ? user.nombre : '');
    const [correo, setCorreo] = useState(user ? user.correo : '');
    const [pagarConSaldo, setPagarConSaldo] = useState(false);

    const handleConfirmarCompra = () => {
        Inertia.post('/confirmar-compra', {
            compraId, // Enviar compraId en la solicitud
            carrito,
            total,
            pagarConSaldo,
        }, {
            onSuccess: () => alert('¡Compra confirmada!'),
            onError: (errors) => alert(errors.saldo || errors.error || 'Error al realizar la compra.'),
        });
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
                        disabled={user?.saldo < total}
                    />
                    Pagar con saldo
                </label>
                {user?.saldo < total && (
                    <p style={{ color: 'red' }}>Saldo insuficiente para esta compra.</p>
                )}
                <button onClick={handleConfirmarCompra} className="confirmar-compra-boton">
                    Confirmar Compra
                </button>
            </div>
        </div>
    );
};

export default ResumenCompra;
