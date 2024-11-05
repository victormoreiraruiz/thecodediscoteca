import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

const MiCuentaCambiarPass = () => {
    const [values, setValues] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.put(route('password.update'), values, {
            onSuccess: () => {
                setValues({ current_password: '', password: '', password_confirmation: '' });
                alert('Contraseña actualizada correctamente');
            },
            onError: () => alert('Hubo un problema al actualizar la contraseña.'),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="current_password" className="text-red-600">Contraseña actual</label>
                <input
                    type="password"
                    id="current_password"
                    name="current_password"
                    value={values.current_password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div>
                <label htmlFor="password" className="text-red-600">Nueva contraseña</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div>
                <label htmlFor="password_confirmation" className="text-red-600">Confirmar nueva contraseña</label>
                <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    value={values.password_confirmation}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <button type="submit" className="p-2 bg-blue-500 text-white rounded">
                Actualizar contraseña
            </button>
        </form>
    );
};

export default MiCuentaCambiarPass;
