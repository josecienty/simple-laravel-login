import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import {
    Label
} from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { } from '@/components/ui/select'

import { route } from 'ziggy-js'
import { NiceAlert } from '@josecienty/nice-alert';

interface User {
    id: number
    name: string
    email: string
}

interface Props {
    user?: User | null
}

export default function UserForm({ user }: Props) {

    const isEdit = !!user

    const form = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
    })

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const {isConfirmed} = await NiceAlert.fire({
            title: '¿Estas seguro?',
            text: `Estas a punto de ${isEdit ? 'editar' : 'registrar'} un usuario`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Si ${isEdit ? 'editar' : 'registrar'}`,
            cancelButtonText: 'Cancelar',
        });

        // No confirmó, entonces no pasó nada
        if(!isConfirmed) return ;

        if (isEdit) {
            form.put(route('users.update', user.id))
            return
        }

        form.post(route('users.store'))
    }

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
                    <hr className="w-[70%] mx-auto" />
                </div>
            </CardHeader>

            <CardContent>

                <form
                    onSubmit={submit}
                    className="space-y-6"
                >

                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Nombre completo
                        </Label>

                        <Input
                            id="name"
                            value={form.data.name}
                            onChange={e =>
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
                        <Label htmlFor="email">
                            Correo electrónico
                        </Label>

                        <Input
                            id="email"
                            type="email"
                            value={form.data.email}
                            onChange={e =>
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
                        <Label htmlFor="email">
                            Perfil de usuario
                        </Label>

                        <select
                            id="email"
                            value={form.data.email}
                            onChange={e =>
                                form.setData('email', e.target.value)
                            }
                            className={cn(
                                "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                            )}
                        >
                            <option value="1">Administrador</option>
                            <option value="2">Super Administrador</option>
                            <option value="3">Cajero</option>
                        </select>

                        {form.errors.email && (
                            <p className="text-sm text-destructive">
                                {form.errors.email}
                            </p>
                        )}
                    </div>


                    <div>
                        <hr className="w-[70%] mx-auto" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">

                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Contraseña
                            </Label>

                            <Input
                                id="password"
                                type="password"
                                value={form.data.password}
                                onChange={e =>
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
                                onChange={e =>
                                    form.setData(
                                        'password_confirmation',
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                    </div>

                    <div className="flex justify-end">

                        <Button
                            disabled={form.processing}
                        >
                            {isEdit
                                ? 'Actualizar usuario'
                                : 'Registrar usuario'}
                        </Button>

                    </div>

                </form>

            </CardContent>

        </Card>
    )
}