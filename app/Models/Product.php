<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Especifica la tabla asociada
    protected $table = 'products';

    // Define los campos asignables
    protected $fillable = [
        'name',
        'category',
        'brand',
        'description',
        'price',
        'stock',
        'images',
        'color',
        'rating',
        'image',
        'model',
    ];

    // (Opcional) Si no usas `created_at` y `updated_at`, puedes deshabilitarlos:
    // public $timestamps = false;
}

