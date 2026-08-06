<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Muestra el listado de perfiles.
     */
    public function index(): Response
    {
        $profiles = Profile::query()
            ->withCount('users')
            ->orderBy('order')
            ->orderBy('name')
            ->get();

        return Inertia::render('profiles/index', [
            'profiles' => $profiles,
        ]);
    }

    /**
     * Muestra el formulario para crear un perfil.
     */
    public function create(): Response
    {
        return Inertia::render('profiles/create');
    }

    /**
     * Guarda un nuevo perfil.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'order' => ['nullable', 'integer', 'min:0'],
            'status' => ['boolean'],
        ]);

        Profile::create($data);

        return redirect()
            ->route('profiles.index')
            ->with('success', 'Perfil creado correctamente.');
    }

    /**
     * Muestra el formulario para editar un perfil.
     */
    public function edit(Profile $profile): Response
    {
        return Inertia::render('profiles/edit', [
            'profile' => $profile,
        ]);
    }

    /**
     * Actualiza un perfil existente.
     */
    public function update(Request $request, Profile $profile): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'order' => ['nullable', 'integer', 'min:0'],
            'status' => ['boolean'],
        ]);

        $profile->update($data);

        return redirect()
            ->route('profiles.index')
            ->with('success', 'Perfil actualizado correctamente.');
    }

    /**
     * Elimina un perfil.
     */
    public function destroy(Profile $profile): RedirectResponse
    {
        if ($profile->users()->exists()) {
            return redirect()
                ->back()
                ->with('error', 'No se puede eliminar el perfil porque tiene usuarios asignados.');
        }

        $profile->delete();

        return redirect()
            ->route('profiles.index')
            ->with('success', 'Perfil eliminado correctamente.');
    }
}
