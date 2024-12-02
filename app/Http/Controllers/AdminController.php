<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Mostrar la lista de todos los usuarios y sus roles.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function listUsers()
    {
        // Obtener todos los usuarios con su rol
        $users = User::with('role')->get();

        return response()->json([
            'users' => $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role_id' => $user->role_id,
                    'role_name' => $user->role ? $user->role->name : null,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ];
            }),
        ]);
    }
}


