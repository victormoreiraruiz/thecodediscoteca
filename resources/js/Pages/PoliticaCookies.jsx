import React from 'react';
import Footer from '../Components/Footer';

export default function PoliticaCookies() {
    const handleVolver = () => {
        window.history.back(); // Vuelve a la página anterior
    };

    return (
        <div className="container mx-auto px-6 py-12 text-gray-300">
            <h1 className="text-4xl font-bold text-[#e5cc70] text-center mb-8">Política de Cookies</h1>

            <p className="mb-6">
                En <strong className="text-white">The Code</strong>, utilizamos cookies para mejorar la experiencia del usuario en nuestro sitio web. 
                A continuación, explicamos qué son las cookies, cómo las utilizamos y cómo puede gestionarlas.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">1. ¿Qué son las cookies?</h2>
            <p className="mb-6">
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. 
                Sirven para recordar información sobre su navegación y preferencias, mejorando así su experiencia en el sitio.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">2. Tipos de cookies que utilizamos</h2>
            <ul className="list-disc list-inside mb-6">
                <li><strong className="text-[#e5cc70]">Cookies esenciales:</strong> Necesarias para el funcionamiento del sitio web, como las que permiten el inicio de sesión y la compra de entradas.</li>
                <li><strong className="text-[#e5cc70]">Cookies de rendimiento:</strong> Nos ayudan a analizar cómo los usuarios interactúan con nuestro sitio para mejorar su funcionamiento.</li>
                <li><strong className="text-[#e5cc70]">Cookies de funcionalidad:</strong> Permiten recordar sus preferencias, como el idioma y la configuración de la cuenta.</li>
                <li><strong className="text-[#e5cc70]">Cookies de publicidad:</strong> Se utilizan para mostrar anuncios relevantes basados en su comportamiento de navegación.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">3. Cómo gestionar las cookies</h2>
            <p className="mb-6">
                Puede configurar su navegador para aceptar, rechazar o eliminar cookies en cualquier momento. 
                A continuación, se indican los enlaces para gestionar las cookies en los navegadores más populares:
            </p>
            <ul className="list-disc list-inside mb-6">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#e5cc70] hover:text-yellow-500">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-[#e5cc70] hover:text-yellow-500">Mozilla Firefox</a></li>
                <li><a href="https://support.microsoft.com/es-es/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer" className="text-[#e5cc70] hover:text-yellow-500">Internet Explorer</a></li>
                <li><a href="https://support.apple.com/es-es/HT201265" target="_blank" rel="noopener noreferrer" className="text-[#e5cc70] hover:text-yellow-500">Safari</a></li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">4. Cambios en la política de cookies</h2>
            <p className="mb-6">
                Nos reservamos el derecho de actualizar esta política de cookies en cualquier momento. 
                Le recomendamos revisar esta página periódicamente para mantenerse informado sobre cómo utilizamos las cookies.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">5. Contacto</h2>
            <p className="mb-6">
                Si tiene alguna pregunta sobre nuestra política de cookies, puede contactarnos en <a href="mailto:contacto@thecode.com" className="text-[#e5cc70] hover:text-yellow-500">contacto@thecode.com</a>.
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
