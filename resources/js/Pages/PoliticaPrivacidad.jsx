import React from 'react';
import Footer from '../Components/Footer';

export default function PoliticaPrivacidad() {
    const handleVolver = () => {
        window.history.back(); // Vuelve a la página anterior
    };

    return (
        <div className="container mx-auto px-6 py-12 text-gray-300">
            <h1 className="text-4xl font-bold text-[#e5cc70] text-center mb-8">Política de Privacidad</h1>

            <p className="mb-6">
                En <strong className="text-white">The Code</strong>, nos comprometemos a proteger la privacidad y los datos personales de nuestros clientes y usuarios. 
                Esta política de privacidad describe cómo recopilamos, usamos y protegemos su información cuando accede a nuestros servicios, incluyendo la compra de entradas, 
                alquiler del local y participación en nuestra galería de imágenes.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">1. Información que recopilamos</h2>
            <ul className="list-disc list-inside mb-6">
                <li><strong className="text-[#e5cc70]">Información personal:</strong> Nombre, dirección de correo electrónico, número de teléfono y otros datos que nos proporcione al registrarse, comprar entradas o reservar productos y servicios.</li>
                <li><strong className="text-[#e5cc70]">Información de compra:</strong> Detalles sobre sus compras, incluyendo la cantidad, fecha y lugar de la transacción.</li>
                <li><strong className="text-[#e5cc70]">Información de navegación:</strong> Datos sobre su actividad en nuestro sitio web, como las páginas que visita y las acciones que realiza.</li>
                <li><strong className="text-[#e5cc70]">Imágenes:</strong> Las imágenes que envía para la galería de fotos, que serán revisadas y aprobadas antes de su publicación.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">2. Cómo utilizamos su información</h2>
            <ul className="list-disc list-inside mb-6">
                <li><strong className="text-[#e5cc70]">Procesamiento de transacciones:</strong> Para gestionar sus compras y reservas.</li>
                <li><strong className="text-[#e5cc70]">Atención al cliente:</strong> Para responder a sus consultas y proporcionarle el mejor servicio posible.</li>
                <li><strong className="text-[#e5cc70]">Promociones y descuentos:</strong> Enviar notificaciones sobre ofertas especiales, eventos o beneficios de nuestro sistema de puntos de fidelidad.</li>
                <li><strong className="text-[#e5cc70]">Galería de imágenes:</strong> Publicar imágenes autorizadas en nuestra galería de fotos.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">3. Compartir información con terceros</h2>
            <p className="mb-6">No compartimos sus datos personales con terceros, salvo en las siguientes circunstancias:</p>
            <ul className="list-disc list-inside mb-6">
                <li>Cuando es necesario para completar una transacción, como los pagos procesados por nuestros proveedores de servicios.</li>
                <li>Si lo exige la ley o para proteger los derechos y la seguridad de <strong className="text-white">The Code</strong>.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">4. Seguridad de su información</h2>
            <p className="mb-6">
                Adoptamos medidas de seguridad adecuadas para proteger su información personal. 
                Sin embargo, tenga en cuenta que ningún sistema es completamente seguro y no podemos garantizar la protección absoluta de sus datos.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">5. Derechos de los usuarios</h2>
            <p className="mb-4">Usted tiene derecho a:</p>
            <ul className="list-disc list-inside mb-6">
                <li>Acceder a sus datos personales almacenados por nosotros.</li>
                <li>Solicitar la corrección de información incorrecta o incompleta.</li>
                <li>Solicitar la eliminación de su información personal, en conformidad con las leyes aplicables.</li>
            </ul>
            <p className="mb-6">
                Para ejercer estos derechos, contáctenos en <a href="mailto:contacto@thecode.com" className="text-[#e5cc70] hover:text-yellow-500">contacto@thecode.com</a>.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">6. Cambios en la política de privacidad</h2>
            <p className="mb-6">
                Podemos actualizar esta política de privacidad periódicamente. Publicaremos cualquier cambio en esta página y le notificaremos si es necesario.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">7. Contacto</h2>
            <p className="mb-6">
                Si tiene alguna pregunta o inquietud sobre nuestra política de privacidad, no dude en contactarnos en <a href="mailto:contacto@thecode.com" className="text-[#e5cc70] hover:text-yellow-500">contacto@thecode.com</a>.
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
