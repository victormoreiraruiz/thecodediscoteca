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
    const [errors, setErrors] = useState({}); // Estado para los errores de validación

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre_completo.trim()) {
            newErrors.nombre_completo = 'El nombre completo es obligatorio.';
        }
        if (!formData.documento_fiscal.trim()) {
            newErrors.documento_fiscal = 'El documento fiscal es obligatorio.';
        }
        if (!formData.direccion.trim()) {
            newErrors.direccion = 'La dirección es obligatoria.';
        }
        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es obligatorio.';
        } else if (!/^\d{9}$/.test(formData.telefono)) {
            newErrors.telefono = 'El teléfono debe tener 9 dígitos.';
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({}); // Resetear los errores previos

        // Validar el formulario
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        // Enviar los datos si todo está correcto
        Inertia.post(route('convertir-promotor.post'), formData, {
            onSuccess: () => {
                alert('¡Ahora eres promotor!');
                if (onComplete) onComplete();
                window.location.href = route('eventos.index'); // Redirigir a la página de eventos
            },
            onError: (serverErrors) => {
                setErrors(serverErrors);
                alert('Hubo un error al convertirte en promotor.');
            },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label><h2>Nombre Completo:</h2></label>
                <input
                    type="text"
                    name="nombre_completo"
                    value={formData.nombre_completo}
                    onChange={handleChange}
                    required
                />
                {errors.nombre_completo && <p style={{ color: 'red' }}>{errors.nombre_completo}</p>}
            </div>
            <div>
                <label><h2>Documento Fiscal:</h2></label>
                <input
                    type="text"
                    name="documento_fiscal"
                    value={formData.documento_fiscal}
                    onChange={handleChange}
                    required
                />
                {errors.documento_fiscal && <p style={{ color: 'red' }}>{errors.documento_fiscal}</p>}
            </div>
            <div>
                <label><h2>Dirección:</h2></label>
                <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                />
                {errors.direccion && <p style={{ color: 'red' }}>{errors.direccion}</p>}
            </div>
            <div>
                <label><h2>Teléfono:</h2></label>
                <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                />
                {errors.telefono && <p style={{ color: 'red' }}>{errors.telefono}</p>}
            </div>
            <div>
                <label><h2>Información Bancaria (opcional):</h2></label>
                <input
                    type="text"
                    name="informacion_bancaria"
                    value={formData.informacion_bancaria}
                    onChange={handleChange}
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Procesando...' : 'Convertirme en Promotor'}
            </button>
        </form>
    );
};

export default FormularioPromotor;
