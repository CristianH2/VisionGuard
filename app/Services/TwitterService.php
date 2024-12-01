<?php

namespace App\Services;

use Abraham\TwitterOAuth\TwitterOAuth;

class TwitterService
{
    protected $connection;

    public function __construct()
    {
        $this->connection = new TwitterOAuth(
            env('TWITTER_API_KEY'),
            env('TWITTER_API_SECRET'),
            env('TWITTER_ACCESS_TOKEN'),
            env('TWITTER_ACCESS_SECRET')
        );
    }

    // Publicar un Tweet
    public function postTweet($message)
    {
        $response = $this->connection->post("statuses/update", ["status" => $message]);
        if ($this->connection->getLastHttpCode() == 200) {
            return $response;
        } else {
            // Manejo de errores
            return [
                'error' => true,
                'message' => 'Error al publicar el tweet',
                'details' => $response
            ];
        }
    }

    // Obtener respuestas (mentions) a un Tweet
    public function getReplies($sinceId = null)
    {
        $params = [];
        if ($sinceId) {
            $params['since_id'] = $sinceId;
        }
        $response = $this->connection->get("statuses/mentions_timeline", $params);
        if ($this->connection->getLastHttpCode() == 200) {
            return $response;
        } else {
            // Manejo de errores
            return [
                'error' => true,
                'message' => 'Error al obtener respuestas',
                'details' => $response
            ];
        }
    }

    // Probar la conexión a la API de Twitter
    public function testConnection()
    {
        $response = $this->connection->get("account/verify_credentials");
        if ($this->connection->getLastHttpCode() == 200) {
            return 'Conexión exitosa';
        } else {
            return [
                'error' => true,
                'message' => 'Error en la conexión',
                'details' => $response
            ];
        }
    }
}

