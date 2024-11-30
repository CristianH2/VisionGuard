<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\TwitterService;

class TwitterController extends Controller
{
    protected $twitterService;

    public function __construct(TwitterService $twitterService)
    {
        $this->twitterService = $twitterService;
    }

    // Publicar un Tweet
    public function postTweet(Request $request)
    {
        $request->validate(['message' => 'required|max:280']);

        $response = $this->twitterService->postTweet($request->message);

        if (isset($response->errors)) {
            return back()->with('error', 'Error al publicar el tweet.');
        }

        return back()->with('success', 'Tweet publicado con éxito.');
    }

    // Obtener Respuestas a Tweets
    public function getReplies()
    {
        $replies = $this->twitterService->getReplies();

        return view('twitter.replies', compact('replies'));
    }
}

