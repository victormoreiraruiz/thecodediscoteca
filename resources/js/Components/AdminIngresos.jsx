import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const AdminIngresos = () => {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerHistorialIngresos = async () => {
            try {
                const response = await axios.get("/admin/historial-ingresos");

                // Asegurar que los datos sean numéricos
                const datosHistorial = response.data.map(item => ({
                    fecha: new Date(item.created_at).toLocaleString(), // Convertir fecha
                    cantidad: parseFloat(item.cantidad), // Convertir a número
                    motivo: item.motivo
                }));

                setHistorial(datosHistorial);
            } catch (error) {
                console.error("Error al obtener el historial de ingresos:", error);
            } finally {
                setLoading(false);
            }
        };

        obtenerHistorialIngresos();
    }, []);

    // 📊 Datos para la gráfica
    const data = {
        labels: historial.map(item => item.fecha), // Etiquetas con fechas
        datasets: [
            {
                label: "Ingresos (€)",
                data: historial.map(item => item.cantidad), // Cantidad en cada fecha
                fill: false,
                borderColor: "rgb(134, 3, 3)", // Color de la línea
                tension: 0.1,
                pointBackgroundColor: "rgb(229, 204, 112)", // Color de los puntos
                pointRadius: 5, // Tamaño de los puntos
            }
        ]
    };

    // 🛠️ Opciones para la gráfica
    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const index = tooltipItem.dataIndex;
                        return `€${tooltipItem.raw} - ${historial[index].motivo}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Fecha y Hora",
                    color: "#860303",
                    font: { size: 14, weight: "bold" }
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Ingresos (€)",
                    color: "#860303",
                    font: { size: 14, weight: "bold" }
                }
            }
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-[#860303] mb-4">
                Ingresos de la Discoteca
            </h2>

            {loading ? (
                <p className="text-center text-gray-500">Cargando datos...</p>
            ) : historial.length === 0 ? (
                <p className="text-center text-gray-500">No hay ingresos registrados.</p>
            ) : (
                <Line data={data} options={options} />
            )}
        </div>
    );
};

export default AdminIngresos;
