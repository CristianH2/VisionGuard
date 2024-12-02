<?php

namespace App\Http\Controllers;

use Symfony\Component\HttpClient\HttpClient;
use Illuminate\Http\Request;

class WebScraperController extends Controller
{
    public function scrape(Request $request)
    {
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
        ]);
    }
}
