<?php

namespace App\Http\Controllers;

use Symfony\Component\HttpClient\HttpClient;
use Illuminate\Http\Request;

class WebScraperController extends Controller
{
    public function scrape(Request $request)
    {
        $url = 'https://www.steren.com.mx/seguridad/camaras-de-seguridad-wifi';
        $client = HttpClient::create();
        $response = $client->request('GET', $url);

        $content = $response->getContent();
        $crawler = new \Symfony\Component\DomCrawler\Crawler($content);

        $crawler->filter('.product-item-info')->each(function ($node) {
            $title = $node->filter('.product-item-link')->text();
            $price = $node->filter('.price')->text();
            echo "Title: $title, Price: $price <br>";
        });
    }
}

