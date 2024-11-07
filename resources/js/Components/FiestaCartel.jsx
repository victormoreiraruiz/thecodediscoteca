import React from 'react';

const HalloweenParty = () => {
  return (
    <div>
      <h1>THE CODE HALLOWEEN PARTY, 4 DE OCTUBRE</h1>
      <div className="fiesta">
        <img src="/imagenes/cartel1.png" alt="Cartel de la fiesta" className="fiestacartel" />
        <div className="fiestatexto">
          <h2>
            La verdad que para cuando entregue este trabajo ya se habrá acabado
            Halloween, pero bueno, para el año que viene. No es necesario venir
            disfrazado, pero habrá concurso de disfraces, y al disfraz más feo le
            regalaremos dos consumiciones para que no pase tanta vergüenza. Los
            menores de edad, no os intentéis colar con un dni falso, que el
            portero no es tonto y encima sabe taekwondo.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default HalloweenParty;
