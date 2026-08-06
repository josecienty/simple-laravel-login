<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->after('name');
        });

        // Rellenar un username para los usuarios existentes a partir de su correo.
        DB::table('users')->orderBy('id')->whereNull('username')->get()->each(function ($user) {
            $local = (string) explode('@', (string) $user->email)[0];
            $base = Str::lower(Str::ascii($local));
            $base = preg_replace('/[^a-z0-9_-]+/', '-', $base) ?: '';
            $base = trim((string) $base, '-');
            $base = $base === '' ? 'usuario' : Str::limit($base, 30, '');

            $username = $base;
            $suffix = 1;

            while (DB::table('users')->where('username', $username)->exists()) {
                $username = $base.$suffix;
                $suffix++;
            }

            DB::table('users')->where('id', $user->id)->update(['username' => $username]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable(false)->change();
            $table->unique('username');
            $table->string('email')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['username']);
            $table->dropColumn('username');
            $table->string('email')->nullable(false)->change();
        });
    }
};
