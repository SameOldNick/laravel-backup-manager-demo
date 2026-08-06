import { Head, usePage } from '@inertiajs/react';
import backup from '@/routes/backup';
import CreateMonitorContainer from './components/monitors/actions/create/container';
import EditMonitorContainer from './components/monitors/actions/edit/container';
import MonitorsListContainer from './components/monitors/actions/list/container';

import type { BackupMonitorsPageProps } from './types';

const Monitors = () => {
    const { action } = usePage<BackupMonitorsPageProps>().props;

    return (
        <>
            <Head title="Backup Monitors" />

            {action === 'list' && <MonitorsListContainer />}
            {action === 'create' && <CreateMonitorContainer />}
            {action === 'edit' && <EditMonitorContainer />}
        </>
    );
};

Monitors.layout = {
    breadcrumbs: [
        {
            title: 'Backup Monitors',
            href: backup.monitors.index(),
        },
    ],
};

export default Monitors;
