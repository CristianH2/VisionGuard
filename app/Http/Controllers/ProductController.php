<?php

namespace App\Http\Controllers;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Método para obtener todos los productos
    public function index()
    {
        try {
            // Obtener todos los productos de la base de datos
            $products = Product::all();

            // Devolver los productos en formato JSON
            return response()->json($products, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener los productos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Método para obtener un solo producto por su ID
    public function show($id)
    {
        try {
            // Buscar el producto por su ID
            $product = Product::find($id);

            // Si no se encuentra el producto
            if (!$product) {
                return response()->json([
                    'message' => 'Producto no encontrado',
                ], 404);
            }

            // Si el producto se encuentra, devolverlo
            return response()->json([
                'success' => true,
                'product' => $product         
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener el producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Agregar un producto
    public function store(Request $request)
    {
        // Validación de los datos recibidos
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'stock' => 'required|integer|min:0',
            'images' => 'required|array',
            'color' => 'required|string|max:255',
            'rating' => 'required|numeric|min:0|max:5',
            'image' => 'required|string|max:255'
        ]);

        try {
            // Crear un nuevo producto con los datos validados
            $product = new Product();
            $product->name = $request->name;
            $product->category = $request->category;
            $product->brand = $request->brand;
            $product->model = $request->model;
            $product->price = $request->price;
            $product->description = $request->description;
            $product->stock = $request->stock;
            $product->images = json_encode($request->images);  // Convierte el array de imágenes a JSON
            $product->color = $request->color;
            $product->rating = $request->rating;
            $product->image = $request->image;

            $product->save();

            return response()->json([
                'success' => true,
                'message' => 'Producto creado exitosamente',
                'product' => $product
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear el producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Editar un producto
    public function update(Request $request, $id)
    {
        try {
            // Buscar el producto por su ID
            $product = Product::findOrFail($id);

            // Validar los datos que vienen en la solicitud (puedes agregar más validaciones si es necesario)
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'brand' => 'required|string|max:255',
                'model' => 'required|string|max:255',
                'price' => 'required|numeric',
                'description' => 'required|string',
                'stock' => 'required|integer',
                'images' => 'nullable|array', // Permite un arreglo de imágenes
                'images.*' => 'nullable|string', // Cada imagen debe ser una cadena
                'color' => 'required|string|max:255',
                'rating' => 'nullable|numeric|min:0|max:5',
                'image' => 'nullable|string',
            ]);

            // Actualizar el producto con los datos validados
            $product->update($validated);

            // Responder con el producto actualizado
            return response()->json([
                'success'=> true,
                "product" => $product], 200);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Producto no encontrado o error al actualizar'], 500);
        }
    }

    // Eliminar un producto
    public function destroy($id)
    {
        try {
            // Buscar el producto
            $product = Product::findOrFail($id);
            $product->delete();

            return response()->json([
                'message' => 'Producto eliminado con éxito.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Hubo un error al eliminar el producto.',
                'error' => $e->getMessage()
            ], 500); // Error interno del servidor
        }
    }
}