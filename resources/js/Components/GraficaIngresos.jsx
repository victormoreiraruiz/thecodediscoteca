import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Registrar los componentes necesarios
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraficaIngresos = ({ ingresos }) => {
    const data = {
        labels: ingresos.map((ingreso) => ingreso.fecha), // Ejemplo: ["2024-11-01", "2024-11-02"]
        datasets: [
            {
                label: 'Ingresos por Fecha',
                data: ingresos.map((ingreso) => ingreso.total), // Ejemplo: [50, 75]
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Gráfica de Ingresos',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Fecha',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Ingresos (€)',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default GraficaIngresos;
