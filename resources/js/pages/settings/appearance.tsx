import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

const TITLE = "Configuraciones de Apariencia";

export default function Appearance() {
    return (
        <>
            <Head title={TITLE} />

            <h1 className="sr-only">{TITLE}</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={TITLE}
                    description="Modifica la apariencia de tu cuenta"
                />
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: TITLE,
            href: editAppearance(),
        },
    ],
};
