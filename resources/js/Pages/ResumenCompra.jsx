import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

const ResumenCompra = () => {
    const { carrito, total, user } = usePage().props;
    const [nombre, setNombre] = useState(user ? user.nombre : '');
    const [correo, setCorreo] = useState(user ? user.correo : '');

    const handleConfirmarCompra = () => {
        Inertia.post('/checkout', { carrito, nombre, correo }, {
            onSuccess: () => alert('¡Compra confirmada!'),
        });
    };

    return (
        <div className="resumen-compra">
            <h1>Resumen de Compra</h1>
            <div className="productos">
                {carrito.map((item, index) => (
                    <div key={index} className="producto">
                        <span>{item.nombre}</span>
                        <span>Cantidad: {item.cantidad}</span>
                        <span>Precio: {(item.precio * item.cantidad).toFixed(2)}€</span>
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

            <button onClick={handleConfirmarCompra} className="confirmar-compra-boton">
                Confirmar Compra
            </button>
        </div>
    );
};

export default ResumenCompra;
