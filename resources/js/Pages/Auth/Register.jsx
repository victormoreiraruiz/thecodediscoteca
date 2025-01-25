import React, { useState, useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        over_18: false,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        return () => {
            setData("password", "");
            setData("password_confirmation", "");
        };
    }, []);

    const handleOnChange = (event) => {
        setData(
            event.target.name,
            event.target.type === "checkbox" ? event.target.checked : event.target.value
        );
    };

    const validateForm = () => {
        const newErrors = {};

        if (!data.name.trim()) {
            newErrors.name = "El nombre es obligatorio.";
        }

        if (!data.email.trim()) {
            newErrors.email = "El correo electrónico es obligatorio.";
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = "El correo electrónico no es válido.";
        }

        if (!data.password.trim()) {
            newErrors.password = "La contraseña es obligatoria.";
        } else if (data.password.length < 8) {
            newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
        }

        if (data.password !== data.password_confirmation) {
            newErrors.password_confirmation = "Las contraseñas no coinciden.";
        }

        if (!data.over_18) {
            newErrors.over_18 = "Debes confirmar que eres mayor de 18 años.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const submit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            post(route("register"));
        }
    };

    return (
        <GuestLayout>
            <Head title="Registro" />

            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="flex flex-col md:flex-row items-center justify-between w-11/12 max-w-7xl gap-8">
                    {/* Imagen izquierda */}
                    <img
                        src="/imagenes/logosinfondo.png"
                        alt="Left Decoration"
                        className="hidden md:block w-1/4 h-auto rounded"
                    />
<form
    onSubmit={submit}
    className="w-full md:w-1/2 bg-[#860303] text-white p-10 rounded-lg shadow-lg"
>
    <h2 className="text-4xl font-bold text-center mb-6">REGISTRO</h2>

    <div>
        <InputLabel
            htmlFor="name"
            value="Nombre"
            className="text-white text-xl font-bold"
        />
        <input
            id="name"
            name="name"
            value={data.name}
            placeholder="Ingresa tu nombre"
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg text-lg text-black bg-white placeholder-gray-500"
            autoComplete="name"
            onChange={handleOnChange}
        />
        {errors.name && <InputError message={errors.name} className="mt-2" />}
    </div>

    <div className="mt-6">
        <InputLabel
            htmlFor="email"
            value="Correo electrónico"
            className="text-white text-xl font-bold"
        />
        <input
            id="email"
            type="email"
            name="email"
            value={data.email}
            placeholder="Ingresa tu correo electrónico"
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg text-lg text-black bg-white placeholder-gray-500"
            autoComplete="username"
            onChange={handleOnChange}
        />
        {errors.email && <InputError message={errors.email} className="mt-2" />}
    </div>

    <div className="mt-6">
        <InputLabel
            htmlFor="password"
            value="Contraseña"
            className="text-white text-xl font-bold"
        />
        <input
            id="password"
            type="password"
            name="password"
            value={data.password}
            placeholder="Ingresa tu contraseña"
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg text-lg text-black bg-white placeholder-gray-500"
            autoComplete="new-password"
            onChange={handleOnChange}
        />
        {errors.password && <InputError message={errors.password} className="mt-2" />}
    </div>

    <div className="mt-6">
        <InputLabel
            htmlFor="password_confirmation"
            value="Confirmar contraseña"
            className="text-white text-xl font-bold"
        />
        <input
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            placeholder="Repite tu contraseña"
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg text-lg text-black bg-white placeholder-gray-500"
            autoComplete="new-password"
            onChange={handleOnChange}
        />
        {errors.password_confirmation && (
            <InputError message={errors.password_confirmation} className="mt-2" />
        )}
    </div>

    {/* Checkbox para mayor de 18 */}
    <div className="mt-6 flex items-center">
        <input
            id="over_18"
            name="over_18"
            type="checkbox"
            checked={data.over_18}
            onChange={handleOnChange}
            className="mr-2"
        />
        <label
            htmlFor="over_18"
            className="text-white text-lg font-bold"
        >
            Confirmo que soy mayor de 18 años
        </label>
    </div>
    {errors.over_18 && <InputError message={errors.over_18} className="mt-2" />}

    <div className="flex items-center justify-between mt-8">
        <Link
            href={route("login")}
            className="underline text-lg text-white hover:text-gray-200"
        >
            ¿Ya tienes cuenta?
        </Link>
        <button
            type="submit"
            className="ml-4 px-6 py-3 bg-black text-white text-lg font-bold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-500 flex items-center justify-center"
            disabled={processing}
        >
            Registrar
        </button>
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
