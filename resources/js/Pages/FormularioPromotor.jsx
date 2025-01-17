import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

const FormularioPromotor = ({ onComplete }) => {
    const [formData, setFormData] = useState({
        nombre_completo: '',
        documento_fiscal: '',
        direccion: '',
        telefono: '',
        informacion_bancaria: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleVolverAtras = () => {
        window.history.back();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const letrasDNI = "TRWAGMYFPDXBNJZSQVHLCKE";

    const validarDNI = (dni) => {
        const numero = dni.slice(0, -1); // Extrae los números
        const letra = dni.slice(-1).toUpperCase(); // Extrae la letra y la convierte a mayúscula
        if (!/^\d{8}[A-Z]$/.test(dni)) {
            return false; // Validación básica de formato
        }
        const letraEsperada = letrasDNI[numero % 23]; // Calcula la letra esperada
        return letra === letraEsperada; // Compara la letra ingresada con la esperada
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre_completo.trim()) {
            newErrors.nombre_completo = 'El nombre completo es obligatorio.';
        }
        if (!formData.documento_fiscal.trim()) {
            newErrors.documento_fiscal = 'El documento fiscal es obligatorio.';
        } else if (!validarDNI(formData.documento_fiscal)) {
            newErrors.documento_fiscal = 'El documento fiscal no es válido.';
        }
        if (!formData.direccion.trim()) {
            newErrors.direccion = 'La dirección es obligatoria.';
        }
        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es obligatorio.';
        } else if (!/^\d{9}$/.test(formData.telefono)) {
            newErrors.telefono = 'El teléfono debe tener 9 dígitos numéricos.';
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        Inertia.post(route('convertir-promotor.post'), formData, {
            onSuccess: () => {
                alert('¡Ahora eres promotor!');
                if (onComplete) onComplete();
                window.location.href = route('eventos.index');
            },
            onError: (serverErrors) => {
                setErrors(serverErrors);
                alert('Hubo un error al convertirte en promotor.');
            },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow-lg border border-[#e5cc70]">
            <h2 className="text-2xl font-bold text-[#e5cc70] text-center mb-4">Formulario de Promotor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre Completo */}
                <div>
                    <label className="block text-[#e5cc70] font-semibold">Nombre Completo:</label>
                    <input
                        type="text"
                        name="nombre_completo"
                        value={formData.nombre_completo}
                        onChange={handleChange}
                        className={`w-full p-2 rounded-md border ${errors.nombre_completo ? 'border-[#860303]' : 'border-[#e5cc70]'} bg-gray-800 text-white`}
                        required
                    />
                    {errors.nombre_completo && <p className="text-[#860303] text-sm mt-1">{errors.nombre_completo}</p>}
                </div>

                {/* Documento Fiscal */}
                <div>
                    <label className="block text-[#e5cc70] font-semibold">Documento Fiscal:</label>
                    <input
                        type="text"
                        name="documento_fiscal"
                        value={formData.documento_fiscal}
                        onChange={handleChange}
                        className={`w-full p-2 rounded-md border ${errors.documento_fiscal ? 'border-[#860303]' : 'border-[#e5cc70]'} bg-gray-800 text-white`}
                        required
                    />
                    {errors.documento_fiscal && <p className="text-[#860303] text-sm mt-1">{errors.documento_fiscal}</p>}
                </div>

                {/* Otros campos */}
                {/* Dirección */}
                <div>
                    <label className="block text-[#e5cc70] font-semibold">Dirección:</label>
                    <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        className={`w-full p-2 rounded-md border ${errors.direccion ? 'border-[#860303]' : 'border-[#e5cc70]'} bg-gray-800 text-white`}
                        required
                    />
                    {errors.direccion && <p className="text-[#860303] text-sm mt-1">{errors.direccion}</p>}
                </div>

                {/* Teléfono */}
                <div>
                    <label className="block text-[#e5cc70] font-semibold">Teléfono:</label>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className={`w-full p-2 rounded-md border ${errors.telefono ? 'border-[#860303]' : 'border-[#e5cc70]'} bg-gray-800 text-white`}
                        required
                    />
                    {errors.telefono && <p className="text-[#860303] text-sm mt-1">{errors.telefono}</p>}
                </div>

                {/* Información Bancaria */}
                <div>
                    <label className="block text-[#e5cc70] font-semibold">Información Bancaria (Opcional):</label>
                    <input
                        type="text"
                        name="informacion_bancaria"
                        value={formData.informacion_bancaria}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md border border-[#e5cc70] bg-gray-800 text-white"
                    />
                </div>

                {/* Botones */}
                <div className="flex justify-between">
                    <button 
                        type="button" 
                        className="bg-[#860303] hover:bg-[#6d0202] text-white font-bold py-2 px-4 rounded-md transition duration-300"
                        onClick={handleVolverAtras}
                    >
                        Volver Atrás
                    </button>
                    <button 
                        type="submit" 
                        className="bg-[#e5cc70] hover:bg-[#d4b34a] text-black font-bold py-2 px-4 rounded-md transition duration-300"
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : 'Aceptar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioPromotor;
