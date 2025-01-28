import React, { useState } from 'react';
import Swal from 'sweetalert2';
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
        
        // Validar nombre completo
        if (!formData.nombre_completo.trim()) {
            newErrors.nombre_completo = 'El nombre completo es obligatorio.';
        }
        
        // Validar documento fiscal
        if (!formData.documento_fiscal.trim()) {
            newErrors.documento_fiscal = 'El documento fiscal es obligatorio.';
        } else if (!validarDNI(formData.documento_fiscal)) {
            newErrors.documento_fiscal = 'El documento fiscal no es válido.';
        }
        
        // Validar dirección
        if (!formData.direccion.trim()) {
            newErrors.direccion = 'La dirección es obligatoria.';
        }
        
        // Validar teléfono
        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es obligatorio.';
        } else if (!/^\d{9}$/.test(formData.telefono)) {
            newErrors.telefono = 'El teléfono debe tener 9 dígitos numéricos.';
        }
        
        // Validar información bancaria (opcional)
        if (formData.informacion_bancaria.trim()) {
            if (!/^[A-Z]{2}\d{30}$/.test(formData.informacion_bancaria)) {
                newErrors.informacion_bancaria = 'La información bancaria debe contener 2 letras seguidas de 30 números.';
            }
        }
    
        return newErrors;
    };

    const handleSubmit = async (e) => {
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
                Swal.fire({
                    title: '¡Éxito!',
                    text: '¡Has conseguido cambiar tu rol a promotor!',
                    icon: 'success',
                    confirmButtonText: 'Volver',
                    confirmButtonColor: '#e5cc70',
                    customClass: {
                        confirmButton: 'bg-[#860303] text-white px-10 py-2 rounded-lg hover:bg-red-700',
                    },
                }).then(() => {
                    window.location.href = '/eventos';
                });
                if (onComplete) onComplete();
            },
            onError: (serverErrors) => {
                setErrors(serverErrors);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al convertirte en promotor. Por favor, inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Cerrar',
                    confirmButtonColor: '#860303',
                });
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
                        className={`w-full p-2 rounded-md border ${errors.informacion_bancaria ? 'border-[#860303]' : 'border-[#e5cc70]'} bg-gray-800 text-white`}
                    />
                    {errors.informacion_bancaria && <p className="text-[#860303] text-sm mt-1">{errors.informacion_bancaria}</p>}
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
