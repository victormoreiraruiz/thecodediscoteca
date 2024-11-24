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
        Schema::create('reserva_discotecas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('sala_id')->constrained('salas')->onDelete('cascade');
            $table->date('fecha_reserva');
            $table->enum('disponibilidad',['disponible','reservada']);
            $table->integer('asistentes');
            $table->text('descripcion');
            $table->enum('tipo_reserva', ['privada', 'concierto'])->default('privada');
            $table->decimal('precio_entrada', 8, 2)->nullable(); // Solo aplicable a conciertos
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
        Schema::dropIfExists('reserva_discotecas');
    }
};
