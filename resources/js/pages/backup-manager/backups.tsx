import { Head, usePage } from '@inertiajs/react';
import backup from '@/routes/backup';

import BackupListContainer from './components/backups/container';
import type {
    BackupBackupsPagePerformBackupProps,
    BackupBackupsPageProps,
} from './types';
import type { BackupBackupsPageListProps } from './types';

const isBackupBackupsPagePerformBackupProps = (
    props: BackupBackupsPageProps,
): props is BackupBackupsPagePerformBackupProps => {
    return (
        props.action === 'list' &&
        props.backups === undefined &&
        'performing_backup' in props &&
        props.performing_backup !== undefined
    );
};

const Backups = () => {
    const pageProps = usePage<BackupBackupsPageProps>().props;

    return (
        <>
            <Head title="Backups" />

            <BackupListContainer
                backups={
                    pageProps.action === 'list' ? pageProps.backups : undefined
                }
                filters={
                    pageProps.filters as BackupBackupsPageListProps['filters']
                }
                performingBackup={
                    isBackupBackupsPagePerformBackupProps(pageProps)
                        ? pageProps.performing_backup
                        : undefined
                }
            />
        </>
    );
};

Backups.layout = {
    breadcrumbs: [
        {
            title: 'Backups',
            href: backup.backups.index(),
        },
    ],
};

export default Backups;
