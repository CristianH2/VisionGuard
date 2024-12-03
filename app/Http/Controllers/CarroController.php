<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carro;
use App\Models\Product;
use App\Models\Pedido;


class CarroController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/carro/{id_usuario}",
     *     summary="Consultar el carrito de un usuario",
     *     tags={"Carrito"},
     *     @OA\Parameter(
     *         name="id_usuario",
     *         in="path",
     *         description="ID del usuario",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Carrito consultado correctamente",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id_producto", type="integer", example=101),
     *                 @OA\Property(property="num_productos", type="integer", example=2),
     *                 @OA\Property(property="nombre_producto", type="string", example="Producto A"),
     *                 @OA\Property(property="precio", type="number", format="float", example=29.99)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Carrito vacío"
     *     )
     * )
     */
    public function consultarCarro($id_usuario)
    {
        $carrito = Carro::where('id_usuario', $id_usuario)
            ->with('producto')
            ->get();

        if ($carrito->isEmpty()) {
            return response()->json(['message' => 'El carrito está vacío'], 200);
        }

        return response()->json($carrito, 200);
    }

    /**
     * @OA\Post(
     *     path="/api/carro",
     *     summary="Añadir un producto al carrito",
     *     tags={"Carrito"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="id_usuario", type="integer", example=1),
     *             @OA\Property(property="id_producto", type="integer", example=101),
     *             @OA\Property(property="num_productos", type="integer", example=3)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Producto añadido al carrito correctamente"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Stock insuficiente"
     *     )
     * )
     */
    public function anadirAlCarro(Request $request)
    {
        $request->validate([
            'id_usuario' => 'required|exists:users,id',
            'id_producto' => 'required|exists:products,id',
            'num_productos' => 'required|integer|min:1'
        ]);

        $producto = Product::findOrFail($request->id_producto);

        if ($producto->stock < $request->num_productos) {
            return response()->json(['message' => 'Stock insuficiente'], 400);
        }

        $carro = Carro::where('id_usuario', $request->id_usuario)
            ->where('id_producto', $request->id_producto)
            ->first();

        if ($carro) {
            $carro->num_productos += $request->num_productos;
            $carro->save();
        } else {
            Carro::create([
                'id_usuario' => $request->id_usuario,
                'id_producto' => $request->id_producto,
                'num_productos' => $request->num_productos
            ]);
        }

        return response()->json(['message' => 'Producto añadido al carrito'], 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/carro",
     *     summary="Quitar un producto del carrito",
     *     tags={"Carrito"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="id_usuario", type="integer", example=1),
     *             @OA\Property(property="id_producto", type="integer", example=101)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Producto quitado del carrito correctamente"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="El producto no está en el carrito"
     *     )
     * )
     */
    public function quitarDelCarro(Request $request)
    {
        $request->validate([
            'id_usuario' => 'required|exists:users,id',
            'id_producto' => 'required|exists:products,id'
        ]);

        $carro = Carro::where('id_usuario', $request->id_usuario)
            ->where('id_producto', $request->id_producto)
            ->first();

        if (!$carro) {
            return response()->json(['message' => 'El producto no está en el carrito'], 404);
        }

        $carro->delete();

        return response()->json(['message' => 'Producto quitado del carrito'], 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/carro/vaciar/{id_usuario}",
     *     summary="Vaciar el carrito de un usuario",
     *     tags={"Carrito"},
     *     @OA\Parameter(
     *         name="id_usuario",
     *         in="path",
     *         description="ID del usuario",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Carrito vaciado correctamente"
     *     )
     * )
     */
    public function vaciarCarro($id_usuario)
    {
        Carro::where('id_usuario', $id_usuario)->delete();
        return response()->json(['message' => 'Carrito vaciado'], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/carro/procesar-compra/{id_usuario}",
     *     summary="Procesar la compra del carrito",
     *     tags={"Carrito"},
     *     @OA\Parameter(
     *         name="id_usuario",
     *         in="path",
     *         description="ID del usuario",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Compra procesada exitosamente"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Stock insuficiente o carrito vacío"
     *     )
     * )
     */
    public function procesarCompra($id_usuario)
    {
        $carrito = Carro::where('id_usuario', $id_usuario)->with('producto')->get();

        if ($carrito->isEmpty()) {
            return response()->json(['message' => 'El carrito está vacío'], 400);
        }

        $total = 0;
        foreach ($carrito as $item) {
            if ($item->producto->stock < $item->num_productos) {
                return response()->json([
                    'message' => "Stock insuficiente para el producto: {$item->producto->name}"
                ], 400);
            }
            $total += $item->producto->price * $item->num_productos;
        }

        $pedido = Pedido::create([
            'id_usuario' => $id_usuario,
            'total' => $total,
        ]);

        foreach ($carrito as $item) {
            $item->producto->decrement('stock', $item->num_productos);
            $item->delete();
        }

        return response()->json([
            'message' => 'Compra procesada exitosamente',
            'pedido_id' => $pedido->id_pedido,
            'total' => $total,
        ], 200);
    }


    /**
     * @OA\Put(
     *     path="/api/carro/decrement-product",
     *     summary="Quitar un producto del carrito",
     *     tags={"Carrito"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"id"},
     *             @OA\Property(property="id", type="integer", description="ID del carro", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Producto removido con éxito",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Producto removido con éxito"),
     *             @OA\Property(property="carro", ref="#/components/schemas/Carro")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Carro no encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Carro no encontrado")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="No se puede reducir el número de productos por debajo de 0",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="El carrito ya está vacío")
     *         )
     *     )
     * )
     */
    public function decrementProduct(Request $request)
    {
        // Validar los datos recibidos
        $request->validate([
            'id' => 'required|integer|exists:carro,id',
        ]);

        // Buscar el carrito por ID
        $carro = Carro::find($request->input('id'));

        if (!$carro) {
            return response()->json(['message' => 'Carro no encontrado'], 404);
        }

        // Verificar que el número de productos no sea menor que 1
        if ($carro->num_productos <= 0) {
            return response()->json(['message' => 'El carrito ya está vacío'], 400);
        }

        // Reducir el número de productos en 1
        $carro->num_productos -= 1;
        $carro->save();

        return response()->json([
            'message' => 'Producto removido con éxito',
            'carro' => $carro,
        ], 200);
    }



}
