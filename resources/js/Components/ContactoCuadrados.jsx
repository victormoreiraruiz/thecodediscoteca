import React from 'react';

const ContactoCuadrados = () => {
  return (
    <div className="contenedor-cuadrados">
      <div className="cuadrado amarillo">
        <ul className="listacuadros">
          <li><h4>Objetos Perdidos</h4></li>
          <li><h5>Si desea recuperar algún objeto perdido en nuestras instalaciones, por favor comuníquese con nuestra atención al cliente.</h5></li>
          <li><h4>Teléfono</h4></li>
          <li><h5>+34 666 666 666</h5></li>
          <li><h4>Email</h4></li>
          <li><h5>objetosperdidos@thecode.com</h5></li>
        </ul>
      </div>
      
      <div className="cuadrado rojo">
        <ul className="listacuadros">
          <li><h4>Eventos Privados</h4></li>
          <li><h5>¿Quieres organizar tu evento privado en The Code? Escríbenos, estamos disponibles para usted.</h5></li>
          <li><h4>Teléfono</h4></li>
          <li><h5>+34 666 666 666</h5></li>
          <li><h4>Email</h4></li>
          <li><h5>comercial@thecode.com</h5></li>
        </ul>
      </div>
    </div>
  );
};

export default ContactoCuadrados;
