import { useEffect } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import { NiceAlert } from '@josecienty/nice-alert'
import '@josecienty/nice-alert/style.css'
import { Button } from '@/components/ui/button'
import { type BreadcrumbItem } from '@/types'

interface Profile {
    id: number
    name: string
    order: number
    status: boolean
}

interface Flash {
    success?: string
    error?: string
}

interface Props {
    profiles: Profile[]
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Perfiles',
        href: '/profiles',
    },
]

export default function ProfilesIndex({ profiles }: Props) {

    const { flash } = usePage<{ flash: Flash }>().props

    // Muestra un toast cuando el backend devuelve un mensaje flash
    // (por ejemplo, después de eliminar un perfil)
    useEffect(() => {
        if (flash?.success) {
            NiceAlert.toast({
                icon: 'success',
                title: flash.success,
            })
        }

        if (flash?.error) {
            NiceAlert.toast({
                icon: 'error',
                title: flash.error,
            })
        }
    }, [flash])

    const handleDelete = async (profile: Profile) => {
        const result = await NiceAlert.fire({
            icon: 'warning',
            title: `¿Eliminar "${profile.name}"?`,
            text: 'Esta acción no se puede deshacer.',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        })

        if (!result.isConfirmed) {
            return
        }

        router.delete(`/profiles/${profile.id}`, {
            preserveScroll: true,
            onError: () => {
                NiceAlert.toast({
                    icon: 'error',
                    title: 'No se pudo eliminar el perfil',
                })
            },
        })
    }

    return <>
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">
                    Perfiles
                </h1>

                <Button asChild>
                    <Link href="/profiles/create">
                        Nuevo perfil
                    </Link>
                </Button>
            </div>

            <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-left">
                        <tr>
                            <th className="px-4 py-3 font-medium">
                                ID
                            </th>
                            <th className="px-4 py-3 font-medium">
                                Nombre
                            </th>
                            <th className="px-4 py-3 font-medium">
                                Orden
                            </th>
                            <th className="px-4 py-3 font-medium">
                                Estado
                            </th>
                            <th className="px-4 py-3 font-medium text-right">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {profiles.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-6 text-center text-muted-foreground"
                                >
                                    No hay perfiles registrados.
                                </td>
                            </tr>
                        )}

                        {profiles.map(profile => (
                            <tr
                                key={profile.id}
                                className="border-t"
                            >
                                <td className="px-4 py-3">
                                    {profile.id}
                                </td>

                                <td className="px-4 py-3">
                                    {profile.name}
                                </td>

                                <td className="px-4 py-3">
                                    {profile.order}
                                </td>

                                <td className="px-4 py-3">
                                    <span
                                        className={
                                            profile.status
                                                ? 'inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }
                                    >
                                        {profile.status ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href={`/profiles/${profile.id}/edit`}>
                                                Editar
                                            </Link>
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(profile)}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>
}
