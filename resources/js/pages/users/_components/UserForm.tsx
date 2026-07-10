import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
    user?: {
        id: number
        name: string
        email: string
    }
}

export default function ({ user }: Props) {

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
    })

    function submit(e: React.FormEvent) {
        e.preventDefault()

        if (user) {
            // put(route('users.update', user.id))
        } else {
            // post(route('users.store'))
        }
    }

    return (
        <form
            onSubmit={submit}
            className="space-y-5"
        >

            <div>
                <Input
                    placeholder="Nombre"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                />

                {errors.name && (
                    <p className="text-sm text-red-500">
                        {errors.name}
                    </p>
                )}
            </div>

            <div>
                <Input
                    placeholder="Correo"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                />

                {errors.email && (
                    <p className="text-sm text-red-500">
                        {errors.email}
                    </p>
                )}
            </div>

            <div>
                <Input
                    type="password"
                    placeholder="Contraseña"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                />

                {errors.password && (
                    <p className="text-sm text-red-500">
                        {errors.password}
                    </p>
                )}
            </div>

            <Button disabled={processing}>
                {user ? 'Actualizar' : 'Registrar'}
            </Button>

        </form>
    )
}