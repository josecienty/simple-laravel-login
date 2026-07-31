import { FormEvent } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'

import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { type BreadcrumbItem } from '@/types'

interface Profile {
    id: number
    name: string
    order: number
    status: boolean
}

interface Props {
    profile: Profile
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Perfiles',
        href: '/profiles',
    },
    {
        title: 'Editar',
        href: '#',
    },
]

export default function ProfilesEdit({ profile }: Props) {

    const form = useForm({
        name: profile.name,
        order: profile.order,
        status: profile.status,
    })

    const submit = (e: FormEvent) => {
        e.preventDefault()

        form.put(`/profiles/${profile.id}`)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar perfil" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

                <Card className="max-w-xl">

                    <CardHeader>
                        <CardTitle>
                            Editar perfil
                        </CardTitle>

                        <CardDescription>
                            Actualice la información del perfil.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>

                        <form
                            onSubmit={submit}
                            className="space-y-6"
                        >

                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Nombre
                                </Label>

                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={e =>
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
                                <Label htmlFor="order">
                                    Orden
                                </Label>

                                <Input
                                    id="order"
                                    type="number"
                                    min={0}
                                    value={form.data.order}
                                    onChange={e =>
                                        form.setData(
                                            'order',
                                            Number(e.target.value)
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
                                    onChange={e =>
                                        form.setData('status', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-input"
                                />

                                <Label htmlFor="status">
                                    Activo
                                </Label>

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
                                    asChild
                                >
                                    <Link href="/profiles">
                                        Cancelar
                                    </Link>
                                </Button>

                                <Button disabled={form.processing}>
                                    Actualizar
                                </Button>
                            </div>

                        </form>

                    </CardContent>

                </Card>

            </div>
        </AppLayout>
    )
}
