import { Head, router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

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
import { UsersModuleTabs } from '@/components/users-module-tabs';
import profiles from '@/routes/profiles';
import users from '@/routes/users';

export default function ProfilesCreate() {
    const form = useForm({
        name: '',
        order: 0,
        status: true as boolean,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        form.post(profiles.store().url);
    };

    return (
        <>
            <Head title="Nuevo perfil" />

            <div className="flex w-full">
                <div className="mx-auto w-full space-y-6 p-6 md:max-w-xl">
                    <UsersModuleTabs />

                    <Card>
                        <CardHeader>
                            <CardTitle>Nuevo perfil</CardTitle>

                            <CardDescription>
                                Complete la información del perfil.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre</Label>

                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        onChange={(e) =>
                                            form.setData('name', e.target.value)
                                        }
                                        autoFocus
                                    />

                                    {form.errors.name && (
                                        <p className="text-sm text-destructive">
                                            {form.errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="order">Orden</Label>

                                    <Input
                                        id="order"
                                        type="number"
                                        min={0}
                                        value={form.data.order}
                                        onChange={(e) =>
                                            form.setData(
                                                'order',
                                                Number(e.target.value),
                                            )
                                        }
                                    />

                                    {form.errors.order && (
                                        <p className="text-sm text-destructive">
                                            {form.errors.order}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        id="status"
                                        type="checkbox"
                                        checked={form.data.status}
                                        onChange={(e) =>
                                            form.setData(
                                                'status',
                                                e.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 rounded border-input"
                                    />

                                    <Label htmlFor="status">Activo</Label>

                                    {form.errors.status && (
                                        <p className="text-sm text-destructive">
                                            {form.errors.status}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            router.visit(profiles.index())
                                        }
                                    >
                                        Cancelar
                                    </Button>

                                    <Button disabled={form.processing}>
                                        Guardar
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

ProfilesCreate.layout = {
    breadcrumbs: [
        {
            title: 'Usuarios',
            href: users.index(),
        },
        {
            title: 'Perfiles',
            href: profiles.index(),
        },
        {
            title: 'Nuevo',
            href: profiles.create(),
        },
    ],
};
