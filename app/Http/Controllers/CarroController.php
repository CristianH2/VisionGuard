<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carro;
use App\Models\Product;
use App\Models\Pedido;
class CarroController extends Controller
{
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

    // Buscar si el producto ya está en el carrito
    $carro = Carro::where('id_usuario', $request->id_usuario)
        ->where('id_producto', $request->id_producto)
        ->first();

    if ($carro) {
        // Actualizar cantidad
        $carro->num_productos += $request->num_productos;
        $carro->save();
    } else {
        // Crear nuevo registro
        Carro::create([
            'id_usuario' => $request->id_usuario,
            'id_producto' => $request->id_producto,
            'num_productos' => $request->num_productos
        ]);
    }

    return response()->json(['message' => 'Producto añadido al carrito'], 200);
}

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

    // Eliminar el registro si solo queda un producto
    
        $carro->delete();
    

    return response()->json(['message' => 'Producto quitado del carrito'], 200);
}

public function vaciarCarro($id_usuario)
{
    Carro::where('id_usuario', $id_usuario)->delete();
    return response()->json(['message' => 'Carrito vaciado'], 200);
}

public function procesarCompra($id_usuario)
{
    // Verificar que el carrito no esté vacío
    $carrito = Carro::where('id_usuario', $id_usuario)->with('producto')->get();

    if ($carrito->isEmpty()) {
        return response()->json(['message' => 'El carrito está vacío'], 400);
    }

    // Calcular el total del pedido
    $total = 0;
    foreach ($carrito as $item) {
        if ($item->producto->stock < $item->num_productos) {
            return response()->json([
                'message' => "Stock insuficiente para el producto: {$item->producto->name}"
            ], 400);
        }
        $total += $item->producto->price * $item->num_productos;
    }

    // Crear el pedido
    $pedido = Pedido::create([
        'id_usuario' => $id_usuario,
        'total' => $total,
    ]);

    // Actualizar el stock de los productos y vaciar el carrito
    foreach ($carrito as $item) {
        // Restar del stock
        $item->producto->decrement('stock', $item->num_productos);

        // Eliminar del carrito
        $item->delete();
    }

    return response()->json([
        'message' => 'Compra procesada exitosamente',
        'pedido_id' => $pedido->id_pedido,
        'total' => $total,
    ], 200);
}


}
