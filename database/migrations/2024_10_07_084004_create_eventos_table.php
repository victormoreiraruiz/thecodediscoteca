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
        Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_evento');
            $table->text('descripcion')->nullable(); // Descripción opcional del evento
            $table->date('fecha_evento'); // Fecha del evento
            $table->time('hora_inicio'); // Hora de inicio del evento
            $table->time('hora_final'); // Hora de inicio del evento
            $table->string('cartel')->nullable();
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
        Schema::dropIfExists('eventos');
    }
};
