import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const handleOnChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
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
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Email" className="text-black" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={handleOnChange}
                                required
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
                                autoComplete="new-password"
                                onChange={handleOnChange}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" className="text-black" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={handleOnChange}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
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
