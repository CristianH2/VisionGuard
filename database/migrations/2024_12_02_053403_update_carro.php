<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('carro', function (Blueprint $table) {
        $table->foreignId('id_usuario')->constrained('users')->onDelete('cascade');
        $table->foreignId('id_producto')->constrained('products')->onDelete('cascade');
        $table->integer('num_productos')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
