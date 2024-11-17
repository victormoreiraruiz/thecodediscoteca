<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('reservas_mesas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade'); // Relación con el usuario
            $table->string('mesa_nombre'); // Nombre de la mesa
            $table->decimal('precio', 8, 2); // Precio de la mesa reservada
            $table->dateTime('fecha_reserva'); // Fecha y hora de la reserva
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('reservas_mesas');
    }
};
