<?php

use App\Http\Controllers\TwitterController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Services\TwitterService;
use App\Http\Controllers\ProductController;



Route::get('/', function () {
    return view('welcome');
});

Route::get('/scrape', [App\Http\Controllers\WebScraperController::class, 'scrape']);


Route::resource('products', \App\Http\Controllers\ProductController::class);

// Ruta para la vista de publicación de tweets
Route::get('/twitter', function () {
    return view('twitter.post');
})->name('twitter.post');

// Ruta para publicar un tweet
Route::post('/twitter', [TwitterController::class, 'postTweet'])->name('twitter.tweet');

// Ruta para ver las respuestas
Route::get('/twitter/replies', [TwitterController::class, 'getReplies'])->name('twitter.replies');

Route::get('/test-twitter-connection', function (TwitterService $twitterService) {
    return response()->json($twitterService->testConnection());
});



Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});




require __DIR__.'/auth.php';
