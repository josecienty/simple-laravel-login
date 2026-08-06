import { useForm } from '@inertiajs/react';
import { NiceAlert } from '@josecienty/nice-alert';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import type { Profile } from '@/types';

interface User {
    id: number;
    name: string;
    username: string;
    email: string | null;
    profile_id?: number | null;
}

interface Props {
    user?: User | null;
    profiles: Profile[];
}

export default function UserForm({ user, profiles }: Props) {
    const isEdit = !!user;

    const form = useForm({
        name: user?.name ?? '',
        username: user?.username ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
        profile_id: user?.profile_id ?? '',
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { isConfirmed } = await NiceAlert.fire({
            title: '¿Estas seguro?',
            text: `Estas a punto de ${isEdit ? 'editar' : 'registrar'} un usuario`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Si ${isEdit ? 'editar' : 'registrar'}`,
            cancelButtonText: 'Cancelar',
        });

        // No confirmó, entonces no pasó nada
        if (!isConfirmed) {
            return;
        }

        if (isEdit) {
            form.put(route('users.update', user.id));

            return;
        }

        form.post(route('users.store'));
    };

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>
                    {isEdit ? 'Editar usuario' : 'Registrar usuario'}
                </CardTitle>

                <CardDescription>
                    Complete la información del usuario.
                </CardDescription>

                <div>
                    <hr className="mx-auto w-[70%]" />
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo</Label>

                        <Input
                            id="name"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                        />

                        {form.errors.name && (
                            <p className="text-sm text-destructive">
                                {form.errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="username">Nombre de usuario</Label>

                        <Input
                            id="username"
                            autoCapitalize="none"
                            placeholder="Ej: johndoe"
                            value={form.data.username}
                            onChange={(e) =>
                                form.setData('username', e.target.value)
                            }
                        />

                        <p className="text-xs text-muted-foreground">
                            Solo minúsculas, números, guiones y guiones bajos.
                            Se usa para iniciar sesión.
                        </p>

                        {form.errors.username && (
                            <p className="text-sm text-destructive">
                                {form.errors.username}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Correo electrónico{' '}
                            <span className="text-muted-foreground">
                                (opcional)
                            </span>
                        </Label>

                        <Input
                            id="email"
                            type="email"
                            value={form.data.email ?? ''}
                            onChange={(e) =>
                                form.setData('email', e.target.value)
                            }
                        />

                        {form.errors.email && (
                            <p className="text-sm text-destructive">
                                {form.errors.email}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="profile_id">Perfil de usuario</Label>

                        <Select
                            value={String(form.data.profile_id ?? '')}
                            onValueChange={(value) =>
                                form.setData('profile_id', Number(value))
                            }
                        >
                            <SelectTrigger id="profile_id" className="w-full">
                                <SelectValue placeholder="Seleccione un perfil" />
                            </SelectTrigger>

                            <SelectContent>
                                {profiles.map((profile) => (
                                    <SelectItem
                                        key={profile.id}
                                        value={String(profile.id)}
                                    >
                                        {profile.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {form.errors.profile_id && (
                            <p className="text-sm text-destructive">
                                {form.errors.profile_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <hr className="mx-auto w-[70%]" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>

                            <Input
                                id="password"
                                type="password"
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData('password', e.target.value)
                                }
                            />

                            {isEdit && (
                                <p className="text-xs text-muted-foreground">
                                    Déjelo vacío para conservar la contraseña.
                                </p>
                            )}

                            {form.errors.password && (
                                <p className="text-sm text-destructive">
                                    {form.errors.password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">
                                Confirmar contraseña
                            </Label>

                            <Input
                                id="password_confirmation"
                                type="password"
                                value={form.data.password_confirmation}
                                onChange={(e) =>
                                    form.setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button disabled={form.processing}>
                            {isEdit
                                ? 'Actualizar usuario'
                                : 'Registrar usuario'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
