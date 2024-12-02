<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

