import React from 'react';


const TiendaEntradas = () => {
  return (
    <div className="tienda">
      <p>ENTRADAS</p>

      <div className="entrada">
        <h3>ENTRADA ZONA FONDO</h3>
        <br></br>
        <div className="precio">Precio: 10€</div>
        <button className="reservar">COMPRAR</button>
      </div>

      <div className="entrada">
        <h3>ENTRADA ZONA PISTA</h3>
        <br></br>
        <div className="precio">Precio: 15€</div>
        <button className="reservar">COMPRAR</button>
      </div>

      <p>ENTRADAS PREMIUM</p>

      <div className="entrada">
        <h3>ENTRADA VIP</h3>
        <br></br>
        <div className="precio">Precio: 30€</div>
        <button className="reservar">COMPRAR</button>
      </div>

      <div className="entrada">
        <h3>ENTRADA VIP + BARRA LIBRE</h3>
        <br></br>
        <div className="precio">Precio: 50€</div>
        <button className="reservar">COMPRAR</button>
      </div>

      <div className="entrada">
        <h3>ENTRADA VIP + ZONA MEET AND GREET</h3>
        <br></br>
        <div className="precio">Precio: 70€</div>
        <button className="reservar">COMPRAR</button>
      </div>
    </div>
  );
};

export default TiendaEntradas;
