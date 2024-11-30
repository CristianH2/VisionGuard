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

Route::middleware(['auth'])->group(function () {
    Route::get('products', [\App\Http\Controllers\ProductController::class, 'index'])->name('products.index');
    Route::get('products/create', [\App\Http\Controllers\ProductController::class, 'create'])->name('products.create');
    Route::post('products', [\App\Http\Controllers\ProductController::class, 'store'])->name('products.store');
    Route::get('products/{product}', [\App\Http\Controllers\ProductController::class, 'show'])->name('products.show');
    Route::get('products/{product}/edit', [\App\Http\Controllers\ProductController::class, 'edit'])->name('products.edit');
    Route::put('products/{product}', [\App\Http\Controllers\ProductController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [\App\Http\Controllers\ProductController::class, 'destroy'])->name('products.destroy');
});



Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

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


require __DIR__.'/auth.php';
