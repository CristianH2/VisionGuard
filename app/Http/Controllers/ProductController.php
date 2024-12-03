<?php

namespace App\Http\Controllers;
use App\Models\Product;
use Illuminate\Http\Request;





class ProductController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/products",
     *     summary="Obtener todos los productos",
     *     tags={"Productos"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de productos obtenida correctamente",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Producto A"),
     *                 @OA\Property(property="price", type="number", format="float", example=100.50),
     *                 @OA\Property(property="stock", type="integer", example=20),
     *                 @OA\Property(property="category", type="string", example="Electrónica"),
     *                 @OA\Property(property="brand", type="string", example="Marca A")
     *             )
     *         )
     *     )
     * )
     */

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

    /**
     * @OA\Get(
     *     path="/api/products/{id}",
     *     summary="Obtener un producto por su ID",
     *     tags={"Productos"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID del producto",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Producto obtenido correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="Producto A"),
     *             @OA\Property(property="price", type="number", format="float", example=100.50),
     *             @OA\Property(property="stock", type="integer", example=20),
     *             @OA\Property(property="description", type="string", example="Descripción del producto"),
     *             @OA\Property(property="category", type="string", example="Electrónica"),
     *             @OA\Property(property="brand", type="string", example="Marca A")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Producto no encontrado"
     *     )
     * )
     */


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

     /**
     * @OA\Post(
     *     path="/api/products",
     *     summary="Crear un nuevo producto",
     *     tags={"Productos"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="Producto A"),
     *             @OA\Property(property="category", type="string", example="Electrónica"),
     *             @OA\Property(property="brand", type="string", example="Marca A"),
     *             @OA\Property(property="model", type="string", example="Modelo A"),
     *             @OA\Property(property="price", type="number", format="float", example=100.50),
     *             @OA\Property(property="description", type="string", example="Descripción del producto"),
     *             @OA\Property(property="stock", type="integer", example=20),
     *             @OA\Property(property="images", type="array", @OA\Items(type="string", example="https://example.com/image.jpg")),
     *             @OA\Property(property="color", type="string", example="Rojo"),
     *             @OA\Property(property="rating", type="number", format="float", example=4.5),
     *             @OA\Property(property="image", type="string", example="https://example.com/image.jpg")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Producto creado exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Producto creado exitosamente"),
     *             @OA\Property(property="product", type="object", ref="#/components/schemas/Product")
     *         )
     *     )
     * )
     */


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

    /**
     * @OA\Put(
     *     path="/api/products/{id}",
     *     summary="Actualizar un producto existente",
     *     tags={"Productos"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID del producto a actualizar",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="Producto A"),
     *             @OA\Property(property="category", type="string", example="Electrónica"),
     *             @OA\Property(property="brand", type="string", example="Marca A"),
     *             @OA\Property(property="model", type="string", example="Modelo A"),
     *             @OA\Property(property="price", type="number", format="float", example=100.50),
     *             @OA\Property(property="description", type="string", example="Descripción del producto"),
     *             @OA\Property(property="stock", type="integer", example=20),
     *             @OA\Property(property="images", type="array", @OA\Items(type="string", example="https://example.com/image.jpg")),
     *             @OA\Property(property="color", type="string", example="Rojo"),
     *             @OA\Property(property="rating", type="number", format="float", example=4.5),
     *             @OA\Property(property="image", type="string", example="https://example.com/image.jpg")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Producto actualizado exitosamente"
     *     )
     * )
     */


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

    /**
     * @OA\Delete(
     *     path="/api/products/{id}",
     *     summary="Eliminar un producto por su ID",
     *     tags={"Productos"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID del producto a eliminar",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Producto eliminado exitosamente"
     *     )
     * )
     */

    
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

    /**
     * @OA\Put(
     *     path="/api/products/update-stock",
     *     summary="Actualizar el stock de un producto",
     *     tags={"Productos"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"id", "stock"},
     *             @OA\Property(property="id", type="integer", description="ID del producto", example=1),
     *             @OA\Property(property="stock", type="integer", description="Nuevo valor del stock", example=30)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Stock actualizado con éxito",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Stock actualizado con éxito"),
     *             @OA\Property(property="product", ref="#/components/schemas/Product")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Producto no encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Producto no encontrado")
     *         )
     *     )
     * )
     */
    public function updateStock(Request $request)
    {
        // Validar los datos recibidos
        $request->validate([
            'id' => 'required|integer|exists:products,id',
            'stock' => 'required|integer|min:0',
        ]);

        // Buscar el producto por ID
        $product = Product::find($request->input('id'));

        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        // Actualizar el stock del producto
        $product->stock = $request->input('stock');
        $product->save();

        return response()->json([
            'message' => 'Stock actualizado con éxito',
            'product' => $product,
        ], 200);
    }




}
