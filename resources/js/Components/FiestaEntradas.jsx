import React from 'react';

const FiestaEntradas = ({ carrito, setCarrito, nombreEvento }) => {
    const entradas = [
        { tipo: 'normal', precio: 10, id: 1 },
        { tipo: 'vip', precio: 30, id: 2 },
        { tipo: 'premium', precio: 50, id: 3 },
    ];

    const agregarAlCarrito = (entrada) => {
        const entradaExistente = carrito.find(
            item => item.tipo === entrada.tipo && item.nombre_evento === nombreEvento
        );
        if (entradaExistente) {
            setCarrito(
                carrito.map(item =>
                    item.tipo === entrada.tipo && item.nombre_evento === nombreEvento
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            );
        } else {
            setCarrito([...carrito, { ...entrada, cantidad: 1, nombre_evento: nombreEvento }]);
        }
    };

    return (
        <div className="tienda">
           <h2> ENTRADAS</h2>

            {entradas.map(entrada => (
                <div key={entrada.tipo} className="entrada">
                    <h3>Entrada {entrada.tipo.charAt(0).toUpperCase() + entrada.tipo.slice(1)}</h3>
                    <br></br>
                    <div className="precio">Precio: {entrada.precio}€</div>
                    <button
                        className="reservar"
                        onClick={() => agregarAlCarrito(entrada)}
                    >
                        Añadir
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FiestaEntradas;
