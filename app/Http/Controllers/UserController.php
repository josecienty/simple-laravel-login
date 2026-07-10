<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Listado de usuarios.
     */
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('users/listado', [
            'users' => $users,
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }


    /**
     * Formulario crear usuario.
     */
    public function create()
    {
        return Inertia::render('users/create');
    }


    /**
     * Guardar usuario.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
            ],
        ]);


        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);


        return redirect()
            ->route('users.index')
            ->with('success', 'Usuario creado correctamente.');
    }


    /**
     * Editar usuario.
     */
    public function edit(User $user)
    {
        if(!$user) abort(404);

        return Inertia::render('users/edit', [
            'user' => $user,
        ]);
    }


    /**
     * Actualizar usuario.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email,' . $user->id,
            ],
        ]);


        $user->update($validated);


        return redirect()
            ->route('users.index')
            ->with('success', 'Usuario actualizado correctamente.');
    }


    /**
     * Eliminar usuario.
     */
    public function destroy(User $user)
    {
        $user->delete();


        return redirect()
            ->route('users.index')
            ->with('success', 'Usuario eliminado correctamente.');
    }
}