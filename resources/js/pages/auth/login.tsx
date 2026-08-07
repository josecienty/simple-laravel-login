import { Form, Head } from '@inertiajs/react';
import { ArrowRight, LockKeyhole, UserRound } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Iniciar sesión" />

            {status && (
                <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-center text-sm font-medium text-green-700 dark:text-green-400">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="username"
                                    className="text-sm font-medium"
                                >
                                    Usuario o correo electrónico
                                </Label>
                                <div className="relative">
                                    <UserRound className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        type="text"
                                        name="username"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="username"
                                        placeholder="usuario o email@example.com"
                                        className="h-11 pl-10"
                                    />
                                </div>
                                <InputError message={errors.username} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium"
                                    >
                                        Contraseña
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <LockKeyhole className="pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Contraseña"
                                        className="h-11 pl-10"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm text-muted-foreground"
                                >
                                    Recuérdame
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="group mt-1 h-11 w-full text-base font-semibold shadow-sm"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Iniciar sesión
                                {!processing && (
                                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                                )}
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs tracking-wider text-muted-foreground uppercase">
                                <span className="bg-background px-3">o</span>
                            </div>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            ¿No tienes una cuenta?{' '}
                            <TextLink
                                href={register()}
                                tabIndex={6}
                                className="font-medium"
                            >
                                Regístrate gratis
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Inicia sesión en tu cuenta',
    description:
        'Ingresa tu usuario o correo electrónico y contraseña para iniciar sesión',
};
