<?php

namespace App\Models;

use Database\Factories\ProfileFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Profile extends Model
{
    /** @use HasFactory<ProfileFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'order',
        'status',
    ];

    /**
     * Relación: un perfil puede tener muchos usuarios.
     *
     * @return HasMany<User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'status' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Genera el slug automáticamente a partir de "name".
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Profile $profile) {
            $profile->slug = static::generateUniqueSlug($profile->name);
        });

        static::updating(function (Profile $profile) {
            if ($profile->isDirty('name')) {
                $profile->slug = static::generateUniqueSlug(
                    $profile->name,
                    $profile->id
                );
            }
        });
    }

    /**
     * Genera un slug único, agregando un sufijo numérico si ya existe.
     */
    protected static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $suffix = 1;

        while (
            static::query()
                ->where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
