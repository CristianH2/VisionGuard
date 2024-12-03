<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Carro",
 *     type="object",
 *     title="Carro",
 *     description="Representación de un carrito",
 *     required={"id", "id_usuario", "id_producto", "num_productos"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="id_usuario", type="integer", example=1),
 *     @OA\Property(property="id_producto", type="integer", example=2),
 *     @OA\Property(property="num_productos", type="integer", example=5),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-02T00:00:00Z")
 * )
 */


class Carro extends Model
{
    protected $table = 'carro';
    protected $primaryKey = 'id';
    protected $fillable = ['id_usuario', 'id_producto', 'num_productos'];

    public function producto()
    {
        return $this->belongsTo(Product::class, 'id_producto');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }
}

