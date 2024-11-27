import React, { useState, useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        over_18: false,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        return () => {
            setData('password', '');
            setData('password_confirmation', '');
        };
    }, []);

    const handleOnChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!data.name.trim()) {
            newErrors.name = 'El nombre es obligatorio.';
        }

        if (!data.email.trim()) {
            newErrors.email = 'El correo electrónico es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'El correo electrónico no es válido.';
        }

        if (!data.password.trim()) {
            newErrors.password = 'La contraseña es obligatoria.';
        } else if (data.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
        }

        if (data.password !== data.password_confirmation) {
            newErrors.password_confirmation = 'Las contraseñas no coinciden.';
        }

        if (!data.over_18) {
            newErrors.over_18 = 'Debes confirmar que eres mayor de 18 años.';
        }

        setErrors(newErrors);

        // Devuelve `true` si no hay errores
        return Object.keys(newErrors).length === 0;
    };

    const submit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            post(route('register'));
        }
    };

    return (
        <GuestLayout>
            <Head title="Registro" />

            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="flex items-center justify-between w-4/5 max-w-7xl">
                    {/* Imagen izquierda */}
                    <img
                        src="/imagenes/logosinfondo.png"
                        alt="Left Decoration"
                        className="hidden md:block w-1/4 h-auto rounded"
                    />

                    {/* Formulario */}
                    <form
                        onSubmit={submit}
                        className="register-form w-full md:w-1/2 bg-[#860303] text-black p-8 rounded-lg shadow-lg"
                    >
                        <h2 className="text-2xl font-bold text-center mb-6">REGISTRO</h2>

                        <div>
                            <InputLabel htmlFor="name" value="Nombre" className="text-black" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={handleOnChange}
                            />
                            {errors.name && <InputError message={errors.name} className="mt-2" />}
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Correo electrónico" className="text-black" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={handleOnChange}
                            />
                            {errors.email && <InputError message={errors.email} className="mt-2" />}
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Contraseña" className="text-black" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={handleOnChange}
                            />
                            {errors.password && <InputError message={errors.password} className="mt-2" />}
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password_confirmation" value="Confirmar contraseña" className="text-black" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={handleOnChange}
                            />
                            {errors.password_confirmation && (
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            )}
                        </div>

                        {/* Checkbox para mayor de 18 */}
                        <div className="mt-4 flex items-center">
                            <input
                                id="over_18"
                                name="over_18"
                                type="checkbox"
                                checked={data.over_18}
                                onChange={handleOnChange}
                                className="mr-2"
                            />
                            <label htmlFor="over_18" className="text-black">
                                Confirmo que soy mayor de 18 años
                            </label>
                            {errors.over_18 && <InputError message={errors.over_18} className="mt-2" />}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <Link
                                href={route('login')}
                                className="underline text-sm text-gray-200 hover:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                ¿Ya tienes cuenta?
                            </Link>
                            <PrimaryButton className="ml-4" disabled={processing}>
                                Registrar
                            </PrimaryButton>
                        </div>
                    </form>

                    {/* Imagen derecha */}
                    <img
                        src="/imagenes/logosinfondo.png"
                        alt="Right Decoration"
                        className="hidden md:block w-1/4 h-auto rounded"
                    />
                </div>
            </div>
        </GuestLayout>
    );
}
