<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;

class PedidoController extends Controller
{
    /**
     * Mostrar la lista de todos los pedidos con los datos completos de los usuarios.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function listPedidos()
    {
        // Obtener todos los pedidos con la información del usuario relacionado
        $pedidos = Pedido::with('usuario')->get();

        return response()->json([
            'pedidos' => $pedidos->map(function ($pedido) {
                return [
                    'id_pedido' => $pedido->id_pedido,
                    'total' => $pedido->total,
                    'usuario' => $pedido->usuario ? [
                        'id' => $pedido->usuario->id,
                        'name' => $pedido->usuario->name,
                        'email' => $pedido->usuario->email,
                        'role_id' => $pedido->usuario->role_id,
                        'role_name' => $pedido->usuario->role ? $pedido->usuario->role->name : null,
                        'created_at' => $pedido->usuario->created_at,
                        'updated_at' => $pedido->usuario->updated_at,
                    ] : null,
                    'created_at' => $pedido->created_at,
                    'updated_at' => $pedido->updated_at,
                ];
            }),
        ]);
    }
}

