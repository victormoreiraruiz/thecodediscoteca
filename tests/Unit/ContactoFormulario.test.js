import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactoFormulario from '@/Components/ContactoFormulario';

describe('ContactoFormulario', () => {
    test('Muestra errores si se intenta enviar el formulario con campos vacíos', async () => {
        render(<ContactoFormulario />);

        // Simular envío del formulario sin llenar campos
        const submitButton = screen.getByText('ENVIAR');
        fireEvent.click(submitButton);

        // Verificar que los errores se muestran para todos los campos obligatorios usando waitFor
        await waitFor(() => {
            expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument();
            expect(screen.getByText('Los apellidos son obligatorios.')).toBeInTheDocument();
            expect(screen.getByText('El email es obligatorio.')).toBeInTheDocument();
            expect(screen.getByText('El teléfono es obligatorio.')).toBeInTheDocument();
            expect(screen.getByText('El asunto es obligatorio.')).toBeInTheDocument();
            expect(screen.getByText('El mensaje es obligatorio.')).toBeInTheDocument();
        });
    });

    test('No muestra errores si el formulario se completa correctamente', async () => {
        render(<ContactoFormulario />);

        // Rellenar campos con valores válidos
        fireEvent.change(screen.getByLabelText('Nombre:'), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByLabelText('Apellidos:'), { target: { value: 'Pérez' } });
        fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'juan@example.com' } });
        fireEvent.change(screen.getByLabelText('Teléfono:'), { target: { value: '123456789' } });
        fireEvent.change(screen.getByLabelText('Asunto:'), { target: { value: 'Consulta' } });
        fireEvent.change(screen.getByLabelText('Mensaje:'), { target: { value: 'Quiero más información sobre sus servicios.' } });

        // Simular envío del formulario
        const submitButton = screen.getByText('ENVIAR');
        fireEvent.click(submitButton);

        // Verificar que no se muestran errores usando waitFor
        await waitFor(() => {
            expect(screen.queryByText('El nombre es obligatorio.')).not.toBeInTheDocument();
            expect(screen.queryByText('El email no es válido.')).not.toBeInTheDocument();
        });
    });
});
