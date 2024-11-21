
import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import MapaPersonalizado from './MapaPersonalizado'; // Importa tu componente del mapa


const empiezaMayus = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const FiestaEntradas = () => {

    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const [mostrarMapa, setMostrarMapa] = useState(false); // Estado para controlar la visualización del mapa

    const agregarAlCarrito = (entrada) => {
        const entradaExistente = carrito.find(item => item.tipo === entrada.tipo);
        if (entradaExistente) {
            setCarrito(
                carrito.map(item =>
                    item.tipo === entrada.tipo
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            );
        } else {
            setCarrito([...carrito, { ...entrada, cantidad: 1 }]);
        }
    };

    const eliminarDelCarrito = (tipo) => {
        setCarrito(carrito.filter(item => item.tipo !== tipo));
    };

    const actualizarCantidad = (tipo, cantidad) => {
        setCarrito(
            carrito.map(item =>
                item.tipo === tipo
                    ? { ...item, cantidad: cantidad }
                    : item
            )
        );
    };

    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
    };

    const finalizarCompra = () => {
        Inertia.post('/iniciar-compra', { carrito });
    };

    // Entradas disponibles para compra
    const entradas = [
        { tipo: 'normal', precio: 10, id: 1 },
        { tipo: 'vip', precio: 30, id: 2 },
        { tipo: 'premium', precio: 50, id: 3 },
    ];

    // Entrada reservada
    const reservada = { tipo: 'mesa', precio: 150 };

    return (
        <div className="tienda">
            <p>ENTRADAS</p>

            {entradas.map(entrada => (
                <div key={entrada.tipo} className="entrada">
                    <h3>Entrada {empiezaMayus(entrada.tipo)}</h3>
                    <br />
                    <div className="precio">Precio: {entrada.precio}€</div>
                    <button className="reservar" onClick={() => agregarAlCarrito(entrada)}>
                        COMPRAR
                    </button>
                </div>
            ))}

            <p>RESERVADOS</p>

            <div className="entrada">
                <h3>Entrada {empiezaMayus(reservada.tipo)}</h3>
                <br />
                <div className="precio">Precio: {reservada.precio}€</div>
                <button className="reservar" onClick={() => setMostrarMapa(true)}>
                    RESERVAR
                </button>
            </div>

            {mostrarCarrito && (
                <div className="carrito-panel">
                    <button className="cerrar-carrito" onClick={() => setMostrarCarrito(false)}>✖</button>
                    <h2>Carrito de Compras</h2>
                    {carrito.length === 0 ? (
                        <p>El carrito está vacío</p>
                    ) : (
                        <ul>
                            {carrito.map(item => (
                                <li key={item.tipo} className="carrito-item">
                                    <span>{item.tipo}</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.cantidad}
                                        onChange={(e) => actualizarCantidad(item.tipo, parseInt(e.target.value))}
                                    />
                                    <button className="eliminar" onClick={() => eliminarDelCarrito(item.tipo)}>
                                        🗑️
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="total">
                        <h3>Total: {calcularTotal().toFixed(2)}€</h3>
                    </div>

                    <div className="carrito-botones">
                        <button onClick={() => setCarrito([])}>Vaciar Carrito</button>
                        <button onClick={finalizarCompra}>Finalizar Compra</button>
                    </div>
                </div>
            )}

            {/* Mostrar mapa en un modal */}
            {mostrarMapa && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            width: '620px',
                            height: '650px',
                        }}
                    >
                        <button
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'red',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                cursor: 'pointer',
                                textAlign: 'center',
                            }}
                            onClick={() => setMostrarMapa(false)}
                        >
                            ✖
                        </button>
                        <MapaPersonalizado onMesaSeleccionada={(mesa) => console.log(`Mesa seleccionada: ${mesa.nombre}`)} />
                    </div>
                </div>
            )}
        </div>

    );
    if (entradaExistente) {
      setCarrito(
        carrito.map((item) =>
          item.tipo === entrada.tipo && item.id === entrada.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...entrada, cantidad: 1 }]);
    }
  };

  const agregarMesaAlCarrito = (mesa) => {
    const mesaEnCarrito = carrito.find(
      (item) => item.id === mesa.id && item.tipo === "mesa"
    );
    if (mesaEnCarrito) {
      alert("Esta mesa ya está en el carrito.");
      return;
    }
    setCarrito([...carrito, { ...mesa, tipo: "mesa", cantidad: 1 }]);
  };

  const eliminarDelCarrito = (id, tipo) => {
    setCarrito(carrito.filter((item) => item.id !== id || item.tipo !== tipo));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    setMostrarCarrito(false);
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  const finalizarCompra = () => {
    Inertia.post("/iniciar-compra", { carrito });
  };

  const entradas = [
    { tipo: "normal", precio: 10, id: 1 },
    { tipo: "vip", precio: 30, id: 2 },
    { tipo: "premium", precio: 50, id: 3 },
  ];

  const reservado = { tipo: "reservado", precio: 150, id: 4, capacidad: 5 };

  const confirmarReservaMesa = () => {
    if (!mesaSeleccionada) {
      alert("Por favor, selecciona una mesa.");
      return;
    }

    agregarMesaAlCarrito({ ...mesaSeleccionada, precio: reservado.precio });
    setMesaSeleccionada(null);
    setMostrarMapa(false);
  };

  return (
    <div className="tienda">
      <p>ENTRADAS</p>

      {/* Entradas disponibles */}
      {entradas.map((entrada) => (
        <div key={entrada.id} className="entrada">
          <h3>Entrada {empiezaMayus(entrada.tipo)}</h3>
          <div className="precio">Precio: {entrada.precio}€</div>
          <br></br>
          <button className="reservar" onClick={() => agregarAlCarrito(entrada)}>
            Comprar
          </button>
        </div>
      ))}

      {/* Sección Reservados */}
      <p>RESERVADOS</p>
      <div className="entrada">
        <h3>Reservado para {reservado.capacidad} personas</h3>
        <div className="precio">Precio: {reservado.precio}€</div>
        <br></br>
        <button className="reservar" onClick={() => setMostrarMapa(true)}>
          Reservar
        </button>
      </div>

      {/* Mostrar mapa si se hace clic en reservar */}
      {mostrarMapa && (
        <div className="entrada">
          <h3>Selecciona tu mesa en el mapa:</h3>
          <MapaPersonalizado onMesaSeleccionada={(mesa) => setMesaSeleccionada(mesa)} />
          {mesaSeleccionada && (
            <div className="confirmacion">
              <p>Mesa Seleccionada: {mesaSeleccionada.nombre}</p>
              <br></br>
              <br></br>
              <br></br>
              <button className="reservar" onClick={confirmarReservaMesa}>
                Confirmar Reserva
              </button>
            </div>
          )}
        </div>
      )}

      {/* Carrito */}
      {carrito.length > 0 && (
        <div className="carrito-icono" onClick={() => setMostrarCarrito(!mostrarCarrito)}>
          🛒 <span>Carrito ({carrito.length})</span>
        </div>
      )}

      {mostrarCarrito && (
        <div className="carrito-panel">
          <button className="cerrar-carrito" onClick={() => setMostrarCarrito(false)}>
            ✖
          </button>
          <h2>Carrito de Compras</h2>
          {carrito.length === 0 ? (
            <p>El carrito está vacío</p>
          ) : (
            <ul>
              {carrito.map((item) => (
                <li key={`${item.tipo}-${item.id}`} className="carrito-item">
                  <span>
                    {item.tipo === "mesa" ? ` ${item.nombre}` : `Entrada ${item.tipo}`} -{" "}
                    {item.precio}€
                  </span>
                  <button
                    className="eliminar"
                    onClick={() => eliminarDelCarrito(item.id, item.tipo)}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="total">
            <h3>Total: {calcularTotal().toFixed(2)}€</h3>
          </div>

          <div className="carrito-botones">
            <button onClick={vaciarCarrito}>Vaciar Carrito</button>
            <button onClick={finalizarCompra}>Finalizar Compra</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiestaEntradas;
