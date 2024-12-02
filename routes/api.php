<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\WebScraperController;
use App\Http\Controllers\CarroController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\AdminController;




Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});



Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/getrole', [RegisteredUserController::class, 'getUserRole']);

// Ruta para listar usuarios
Route::get('/admin/users', [AdminController::class, 'listUsers']);


// Ruta para listar pedidos
Route::get('/admin/pedidos', [PedidoController::class, 'listPedidos']);

Route::post('/login', [AuthenticatedSessionController::class, 'store']);



Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest')
    ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest')
    ->name('password.store');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth', 'signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.send');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
 ->middleware('auth:sanctum');

 //producto
 Route::get('products', [ProductController::class, 'index']); // Obtener todos los productos
Route::get('/products/{id}', [ProductController::class, 'show']); // Obtener un solo producto por su ID
Route::post('products', [ProductController::class, 'store']); // Agregar producto
Route::put('products/{id}', [ProductController::class, 'update']); // Modificar producto por su ID
Route::delete('products/{id}', [ProductController::class, 'destroy']); // Eliminar producto por

//scraping
Route::get('/scrape', [WebScraperController::class, 'scrape']);

//carro
Route::get('/carro/{id_usuario}', [CarroController::class, 'consultarCarro']);
Route::post('/carro', [CarroController::class, 'anadirAlCarro']);
Route::delete('/carro', [CarroController::class, 'quitarDelCarro']);
Route::delete('/carro/vaciar/{id_usuario}', [CarroController::class, 'vaciarCarro']);
Route::post('/carro/procesar-compra/{id_usuario}', [CarroController::class, 'procesarCompra']);
