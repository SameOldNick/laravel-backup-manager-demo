import { Head, usePage } from '@inertiajs/react';
import backup from '@/routes/backup';
import CreateDestinationContainer from './components/destinations/actions/create/container';
import EditDestinationContainer from './components/destinations/actions/edit/container';
import DestinationsListContainer from './components/destinations/actions/list/container';

import type { BackupDestinationsPageProps } from './types';

const Destinations = () => {
    const { action } = usePage<BackupDestinationsPageProps>().props;

    return (
        <>
            <Head title="Backup Destinations" />

            {action === 'list' && <DestinationsListContainer />}
            {action === 'create' && <CreateDestinationContainer />}
            {action === 'edit' && <EditDestinationContainer />}
        </>
    );
};

Destinations.layout = {
    breadcrumbs: [
        {
            title: 'Backup Destinations',
            href: backup.destinations.index(),
        },
    ],
};

export default Destinations;
