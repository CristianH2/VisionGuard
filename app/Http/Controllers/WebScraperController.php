<?php

namespace App\Http\Controllers;


use Symfony\Component\HttpClient\HttpClient;
use Illuminate\Http\Request;



class WebScraperController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/scrape",
     *     summary="Realizar scraping de productos",
     *     tags={"Web Scraping"},
     *     @OA\Response(
     *         response=200,
     *         description="Scraping realizado con éxito",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Scraping completed successfully."
     *             ),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="title", type="string", example="Cámara de Seguridad Wifi"),
     *                     @OA\Property(property="price", type="string", example="$1,499.00")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error durante el scraping",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Error al realizar scraping."),
     *             @OA\Property(property="error", type="string", example="Descripción del error")
     *         )
     *     )
     * )
     */
    public function scrape(Request $request)
    {
        try {
            // URL a la que deseas hacer scraping
            $url = 'https://www.steren.com.mx/seguridad/camaras-de-seguridad-wifi';


            // Crear un cliente HTTP
            $client = HttpClient::create();
            $response = $client->request('GET', $url);


            // Obtener el contenido de la respuesta
            $content = $response->getContent();


            // Crear el Crawler para analizar el contenido HTML
            $crawler = new \Symfony\Component\DomCrawler\Crawler($content);


            // Crear un array para almacenar los datos
            $products = [];


            // Recorrer los nodos y extraer datos
            $crawler->filter('.product-item-info')->each(function ($node) use (&$products) {
                $title = $node->filter('.product-item-link')->text();
                $price = $node->filter('.price')->text();


                $products[] = [
                    'title' => trim($title),
                    'price' => trim($price),
                ];
            });


            // Retornar los datos como JSON
            return response()->json([
                'message' => 'Scraping completed successfully.',
                'data' => $products,
            ], 200);
        } catch (\Exception $e) {
            // Manejar errores
            return response()->json([
                'message' => 'Error al realizar scraping.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
