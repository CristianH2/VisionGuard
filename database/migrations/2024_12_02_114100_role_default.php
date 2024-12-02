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
        Schema::table('users', function (Blueprint $table) {
            // Eliminar temporalmente la restricción de llave foránea
            $table->dropForeign(['role_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            // Modificar la columna role_id para agregar un valor predeterminado
            $table->unsignedBigInteger('role_id')->default(2)->change();
        });

        Schema::table('users', function (Blueprint $table) {
            // Volver a agregar la restricción de llave foránea
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Eliminar la llave foránea
            $table->dropForeign(['role_id']);

            // Revertir la columna a su estado anterior
            $table->unsignedBigInteger('role_id')->nullable()->change();

            // Volver a agregar la llave foránea
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
        });

        

    }


    

};
