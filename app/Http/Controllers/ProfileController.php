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
            ->orderBy('order')
            ->orderBy('name')
            ->get();

        return Inertia::render('profiles/index', [
            'profiles' => $profiles,
        ]);
    }

    /**
     * Guarda un nuevo perfil.
     * (La vista de creación aún no está implementada, solo el endpoint).
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
     * Actualiza un perfil existente.
     * (La vista de edición aún no está implementada, solo el endpoint).
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
        $profile->delete();

        return redirect()
            ->route('profiles.index')
            ->with('success', 'Perfil eliminado correctamente.');
    }
}
