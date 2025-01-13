<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('historial_ingresos', function (Blueprint $table) {
            $table->id();
            $table->decimal('cantidad', 10, 2);
            $table->string('motivo');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('historial_ingresos');
    }
};
