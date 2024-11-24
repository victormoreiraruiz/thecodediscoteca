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
            $table->text('descripcion')->nullable();
            $table->date('fecha_evento');
            $table->time('hora_inicio');
            $table->time('hora_final');
            $table->string('cartel')->nullable();
            $table->foreignId('sala_id')->nullable()->constrained('salas')->onDelete('cascade'); // Relación con salas
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
