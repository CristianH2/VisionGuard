<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;


class PedidoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/admin/pedidos",
     *     summary="Listar todos los pedidos con los datos de los usuarios",
     *     tags={"Pedidos"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de pedidos obtenida correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="pedidos",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id_pedido", type="integer", example=1),
     *                     @OA\Property(property="total", type="number", format="float", example=150.50),
     *                     @OA\Property(
     *                         property="usuario",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="name", type="string", example="John Doe"),
     *                         @OA\Property(property="email", type="string", example="john.doe@example.com"),
     *                         @OA\Property(property="role_id", type="integer", example=2),
     *                         @OA\Property(property="role_name", type="string", example="Cliente"),
     *                         @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T12:00:00.000000Z"),
     *                         @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T12:00:00.000000Z")
     *                     ),
     *                     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T12:00:00.000000Z"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T12:00:00.000000Z")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Prohibido"
     *     )
     * )
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

