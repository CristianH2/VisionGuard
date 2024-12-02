<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table = 'pedidos';
    protected $primaryKey = 'id_pedido';
    protected $fillable = ['id_usuario', 'total'];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id'); // Relación con usuarios
    }


}
