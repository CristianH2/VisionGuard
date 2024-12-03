<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Product",
 *     type="object",
 *     title="Producto",
 *     description="Representación de un producto",
 *     required={"name", "price", "stock"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Producto A"),
 *     @OA\Property(property="category", type="string", example="Electrónica"),
 *     @OA\Property(property="brand", type="string", example="Marca X"),
 *     @OA\Property(property="price", type="number", format="float", example=99.99),
 *     @OA\Property(property="description", type="string", example="Descripción del producto"),
 *     @OA\Property(property="stock", type="integer", example=50),
 *     @OA\Property(
 *         property="images",
 *         type="array",
 *         @OA\Items(type="string", example="https://example.com/image1.jpg")
 *     ),
 *     @OA\Property(property="color", type="string", example="Rojo"),
 *     @OA\Property(property="rating", type="number", format="float", example=4.5),
 *     @OA\Property(property="image", type="string", example="https://example.com/main.jpg"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-02T00:00:00Z")
 * )
 */

class Product extends Model
{
    use HasFactory;

    // Especifica la tabla asociada
    protected $table = 'products';
    protected $primaryKey = 'id';
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

    
    // public $timestamps = false;
}

