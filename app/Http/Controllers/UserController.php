<?php

namespace App\Http\Controllers;

use App\Models\Profile;
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
            ->with('profile')
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
        return Inertia::render('users/create', [
            'profiles' => $this->activeProfiles(),
        ]);
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

            'profile_id' => [
                'required',
                'exists:profiles,id',
            ],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'profile_id' => $validated['profile_id'],
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
        $profiles = $this->activeProfiles();

        // Si el usuario tiene asignado un perfil que fue desactivado,
        // lo incluimos para que el formulario muestre su valor actual.
        if ($user->profile_id && ! $profiles->contains('id', $user->profile_id)) {
            $profiles->push($user->profile);
        }

        return Inertia::render('users/edit', [
            'user' => $user->load('profile'),
            'profiles' => $profiles,
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
                'unique:users,email,'.$user->id,
            ],

            'profile_id' => [
                'required',
                'exists:profiles,id',
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

    /**
     * Perfiles activos ordenados para los formularios.
     */
    private function activeProfiles()
    {
        return Profile::query()
            ->where('status', true)
            ->orderBy('order')
            ->orderBy('name')
            ->get();
    }
}
