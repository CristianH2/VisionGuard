<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Rol;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): jsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->string('password')),
        ]);

        event(new Registered($user));

        Auth::login($user);
        
        $token= $user->createToken('API token')->plainTextToken;

        $clienteRoleId = Rol::where('name','cliente')->first()->id;

        return response()->json([
            'message' => 'User registered successfully.',
            'user' => $user,
            'role_id'=>$clienteRoleId,
            'token' => $token,
        ], 201);

    }

    public function getUserRole(Request $request)
    {
        // Validar el cuerpo del JSON
        $request->validate([
            'user_id' => 'required|exists:users,id', // Asegúrate de que el user_id exista en la tabla users
        ]);

        // Buscar el usuario
        $user = User::with('role')->findOrFail($request->input('user_id'));

        // Responder con el role_id y el nombre del rol
        return response()->json([
            'user_id' => $user->id,
            'role_id' => $user->role_id,
            'role_name' => $user->role ? $user->role->name : null, // Verificar si tiene un rol
        ]);


}

}