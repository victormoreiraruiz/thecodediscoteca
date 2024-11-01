import React from 'react';

const RedesSociales = () => {
  return (
    <div>
      <h2>Siguenos en:</h2>
      <div className="lista">
        <ul className="listaredes">
          <li>
            <img src="/imagenes/facebooklogo.png" className="logoslista" alt="logofacebook" />
            <p>&nbsp; The Code Night Club</p>
          </li>
          <li>
            <img src="/imagenes/instagramlogo.png" className="logoslista" alt="logoinstagram" />
            <p>&nbsp; TheCodeSanlucar</p>
          </li>
          <li>
            <img src="/imagenes/twitterlogo.png" className="logoslista" alt="logotwitter" />
            <p>&nbsp; TheCodeSanlucar</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RedesSociales;
