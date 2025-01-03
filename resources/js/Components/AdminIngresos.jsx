import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminIngresos = () => {
    const [ingresos, setingresos] = useState(0); // Aseguramos que el estado inicial es un número

    useEffect(() => {
        const obtenerIngresos = async () => {
            try {
                const response = await axios.get("/admin/ingresos");

                // Convertimos el ingresos a número para evitar errores con `toFixed`
                const ingresosNumerico = Number(response.data.ingresos) || 0;
                
                setingresos(ingresosNumerico);
            } catch (error) {
                console.error("Error al obtener los ingresos:", error);
                setingresos(0); // Si hay error, establecemos el ingresos en 0
            }
        };

        obtenerIngresos();
    }, []);

    return (
        <div>
            <h2>Ingresos de la Discoteca</h2>
            <h3>ingresos actual en la cuenta del administrador: <strong>{ingresos.toFixed(2)}€</strong></h3>
        </div>
    );
};

export default AdminIngresos;
