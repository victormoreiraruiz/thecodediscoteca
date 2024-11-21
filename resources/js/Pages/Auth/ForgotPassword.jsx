import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

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
                        <h2 className="text-2xl font-bold text-center mb-6">Recuperar Contraseña</h2>

                        <div className="mb-4 text-sm text-black">
                            ¿Olvidaste tu contraseña? No hay problema. Solo dinos tu dirección de correo y te enviaremos
                            un enlace para restablecer tu contraseña.
                        </div>

                        {status && (
                            <div className="mb-4 font-medium text-sm text-green-600">
                                {status}
                            </div>
                        )}

                        <div>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                isFocused={true}
                                onChange={onHandleChange}
                                placeholder="Correo electrónico"
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            <PrimaryButton className="ml-4" disabled={processing}>
                                Enviar
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
