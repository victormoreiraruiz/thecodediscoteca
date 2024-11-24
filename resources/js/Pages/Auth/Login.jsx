import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const handleOnChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

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
                        className="w-full md:w-1/2 bg-[#860303] text-black p-8 rounded-lg shadow-lg"
                    >
                        {status && (
                            <div className="mb-4 font-medium text-sm text-green-600">
                                {status}
                            </div>
                        )}

                        <h2 className="text-2xl font-bold text-center mb-6">INICIAR SESIÓN</h2>

                        <div>
                            <InputLabel htmlFor="email" value="Email" className="text-black" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={handleOnChange}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Contraseña" className="text-black" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={handleOnChange}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="block mt-4">
                            <label className="flex items-center text-black">
                                <Checkbox name="remember" value={data.remember} onChange={handleOnChange} />
                                <span className="ml-2 text-sm">Recuérdame</span>
                            </label>
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="underline text-sm text-gray-200 hover:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}

                            <PrimaryButton className="ml-4" disabled={processing}>
                                Iniciar sesión
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
