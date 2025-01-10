import React from 'react';
import Footer from '../Components/Footer';

export default function PoliticaDevoluciones() {
    const handleVolver = () => {
        window.history.back(); // Vuelve a la página anterior
    };

    return (
        <div className="container mx-auto px-6 py-12 text-gray-300">
            <h1 className="text-4xl font-bold text-[#e5cc70] text-center mb-8">Política de Devoluciones</h1>

            <p className="mb-6">
                En <strong className="text-white">The Code</strong>, establecemos la siguiente política de devoluciones para garantizar la claridad y transparencia en nuestras transacciones.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">1. Devolución de entradas</h2>
            <p className="mb-6">
                No se realizarán devoluciones por la compra de entradas, excepto en los siguientes casos:
            </p>
            <ul className="list-disc list-inside mb-6">
                <li><strong className="text-[#e5cc70]">Causas de fuerza mayor:</strong> Desastres naturales, emergencias sanitarias u otras circunstancias imprevistas.</li>
                <li><strong className="text-[#e5cc70]">Cancelación del evento por parte del promotor:</strong> En este caso, los clientes recibirán el reembolso completo de su entrada.</li>
                <li><strong className="text-[#e5cc70]">Cancelación del evento por parte de un administrador:</strong> Se procederá al reembolso total del dinero de las entradas.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">2. Devolución a promotores por cancelación de eventos</h2>
            <p className="mb-6">
                En caso de que un promotor decida cancelar su evento, se aplicará la siguiente política de reembolso:
            </p>
            <ul className="list-disc list-inside mb-6">
                <li>Se reembolsará solo el <strong className="text-[#e5cc70]">30%</strong> del precio de la reserva de la sala.</li>
                <li>El 70% restante no será reembolsado para cubrir los costos operativos y administrativos.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">3. Cancelación de eventos por parte de la administración</h2>
            <p className="mb-6">
                Si un evento es cancelado por <strong className="text-white">The Code</strong> por motivos organizativos o de seguridad, se realizará el reembolso total tanto a los clientes como al promotor del evento.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">4. Procedimiento para solicitar devoluciones</h2>
            <p className="mb-6">
                El reembolso se hará de manera automática junto con una notificación del motivo en caso de que se cumpla los requisitos previamente nombrados.
            </p>

            {/* Botón de Volver */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={handleVolver}
                    className="bg-[#e5cc70] text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-500 transition-transform transform hover:scale-105"
                >
                    VOLVER
                </button>
            </div>

            <Footer />
        </div>
    );
}
