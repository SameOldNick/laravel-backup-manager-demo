import { Head, usePage } from '@inertiajs/react';
import backup from '@/routes/backup';
import CreateBackupScheduleContainer from './components/schedules/actions/create/backup/container';
import CreateCleanupScheduleContainer from './components/schedules/actions/create/cleanup/container';
import EditBackupScheduleContainer from './components/schedules/actions/edit/backup/container';
import EditCleanupScheduleContainer from './components/schedules/actions/edit/cleanup/container';
import ScheduleListContainer from './components/schedules/list/container';
import type { BackupSchedulesPageProps } from './types';

const Schedules = () => {
    const { action } = usePage<BackupSchedulesPageProps>().props;

    return (
        <>
            <Head title="Backup Schedules" />

            {action === 'list' && <ScheduleListContainer />}
            {action === 'create:backup' && <CreateBackupScheduleContainer />}
            {action === 'create:cleanup' && <CreateCleanupScheduleContainer />}
            {action === 'edit:backup' && <EditBackupScheduleContainer />}
            {action === 'edit:cleanup' && <EditCleanupScheduleContainer />}
        </>
    );
};

Schedules.layout = {
    breadcrumbs: [
        {
            title: 'Backup Schedules',
            href: backup.schedules.index(),
        },
    ],
};

export default Schedules;
