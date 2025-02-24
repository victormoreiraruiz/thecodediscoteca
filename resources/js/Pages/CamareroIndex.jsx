import React, { useState } from "react";
import CamareroPanel from "../Components/CamareroPanel";
import CamareroComandasActivas from "../Components/CamareroComandasActivas";
import CamareroHistorialComandas from "../Components/CamareroHistorialComandas";
import Navigation from '../Components/Navigation';

const CamareroIndex = () => {
    const [historialComandas, setHistorialComandas] = useState([]);

    const agregarAlHistorial = (comanda) => {
        setHistorialComandas((prev) => [...prev, comanda]);
    };

    return (
        <div>
             <Navigation/>
            <CamareroPanel />
            <CamareroComandasActivas onComandaEntregada={agregarAlHistorial} />
            <CamareroHistorialComandas historial={historialComandas} />
        </div>
    );
};

export default CamareroIndex;
