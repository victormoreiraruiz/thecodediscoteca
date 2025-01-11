import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const AdminIngresos = () => {
    const [historial, setHistorial] = useState([]);
    const [totalIngresos, setTotalIngresos] = useState(0); // Estado para almacenar la cantidad total

    useEffect(() => {
        const obtenerHistorialIngresos = async () => {
            try {
                const response = await axios.get("/admin/historial-ingresos");
                const data = response.data;

                let acumulado = 0;
                const historialAcumulado = data.map((ingreso) => {
                    acumulado += parseFloat(ingreso.cantidad);
                    return { 
                        ...ingreso, 
                        acumulado, 
                        fecha: new Date(ingreso.created_at).toLocaleString() 
                    };
                });

                setHistorial(historialAcumulado);
                setTotalIngresos(acumulado); // Guardamos la cantidad total
            } catch (error) {
                console.error("Error al obtener el historial de ingresos:", error);
                setHistorial([]);
                setTotalIngresos(0);
            }
        };

        obtenerHistorialIngresos();
    }, []);

    // Datos para la gráfica
    const data = {
        labels: historial.map((ingreso) => ingreso.fecha),
        datasets: [
            {
                label: "Ingresos Totales (€)",
                data: historial.map((ingreso) => ingreso.acumulado),
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ],
    };

    // Configuración de las opciones para los tooltips
    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const ingreso = historial[context.dataIndex];
                        return [
                            `💰 Ingreso: ${ingreso.cantidad}€`,
                            `📅 Fecha: ${ingreso.fecha}`,
                            `📝 Motivo: ${ingreso.motivo}`,
                            `📊 Total acumulado: ${ingreso.acumulado.toFixed(2)}€`
                        ];
                    },
                },
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-xl font-semibold text-[#860303]">📈 Historial de Ingresos</h3>
            <p className="text-lg mb-4">Esta gráfica muestra los ingresos acumulados a lo largo del tiempo.</p>

            {/* Mostrar la cantidad total de ingresos */}
            <h2 className="text-2xl font-bold text-[#008000] mb-4">💰 Total ingresos: {totalIngresos.toFixed(2)}€</h2>

            {historial.length > 0 ? (
                <Line data={data} options={options} />
            ) : (
                <p className="text-center text-gray-500">No hay datos de ingresos aún.</p>
            )}
        </div>
    );
};

export default AdminIngresos;
