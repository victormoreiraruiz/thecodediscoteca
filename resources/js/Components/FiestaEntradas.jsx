import React, { useState } from 'react';

const TiendaEntradas = () => {
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  const agregarAlCarrito = (entrada) => {
    const entradaExistente = carrito.find(item => item.nombre === entrada.nombre);
    if (entradaExistente) {
      setCarrito(
        carrito.map(item =>
          item.nombre === entrada.nombre
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...entrada, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (nombre) => {
    setCarrito(carrito.filter(item => item.nombre !== nombre));
  };

  const actualizarCantidad = (nombre, cantidad) => {
    setCarrito(
      carrito.map(item =>
        item.nombre === nombre
          ? { ...item, cantidad: cantidad }
          : item
      )
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const entradas = [
    { nombre: 'Entrada General', precio: 10 },
    { nombre: 'Entrada VIP', precio: 30 },
    { nombre: 'Entrada Premium', precio: 50 },
  ];

  return (
    <div className="tienda">
      <p>ENTRADAS</p>
      {entradas.map(entrada => (
        <div key={entrada.nombre} className="entrada">
          <h3>{entrada.nombre}</h3>
          <br></br>
          <div className="precio">Precio: {entrada.precio}€</div>
          <button className="reservar" onClick={() => agregarAlCarrito(entrada)}>
            COMPRAR
          </button>
        </div>
      ))}

      <button onClick={() => setMostrarCarrito(!mostrarCarrito)}>
        {mostrarCarrito ? 'Cerrar Carrito' : 'Ver Carrito'}
      </button>

      {mostrarCarrito && (
        <div className="carrito">
          <h2>Carrito de Compras</h2>
          {carrito.length === 0 ? (
            <p>El carrito está vacío</p>
          ) : (
            <ul>
              {carrito.map(item => (
                <li key={item.nombre}>
                  {item.nombre} - {item.precio}€ x {item.cantidad}
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) => actualizarCantidad(item.nombre, parseInt(e.target.value))}
                  />
                  <button onClick={() => eliminarDelCarrito(item.nombre)}>
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button onClick={vaciarCarrito}>Vaciar Carrito</button>
          <button onClick={() => alert('Compra finalizada')}>Finalizar Compra</button>
        </div>
      )}
    </div>
  );
};

export default TiendaEntradas;
