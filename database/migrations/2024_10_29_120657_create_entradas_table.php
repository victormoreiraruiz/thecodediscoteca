<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entradas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evento_id')->constrained('eventos')->onDelete('cascade'); // Relación con evento
            $table->enum('tipo', ['normal', 'vip', 'premium', 'mesa']); // Tipo de entrada
            $table->decimal('precio', 10, 2); // Precio de la entrada
            $table->boolean('reservar')->default(false); // Indica si requiere reserva
            $table->string('ubicacion')->nullable(); // Ubicación (solo para mesas, opcional)
            $table->boolean('reservada')->default(false); // Estado de reserva (solo para mesas)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('entradas');
    }
};
