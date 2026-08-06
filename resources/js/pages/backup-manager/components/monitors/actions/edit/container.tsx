import { usePage } from '@inertiajs/react';
import React from 'react';

import type { BackupMonitorsPageEditProps } from '../../../../types';
import BackupSectionContainer from '../../../shared/section-container';
import EditDestinationForm from './form';

const EditMonitorContainer: React.FC = () => {
    const { monitor, enabled } = usePage<BackupMonitorsPageEditProps>().props;

    return (
        <BackupSectionContainer
            title="Edit Backup Monitor"
            description="Fill in the details below to update the backup monitor."
            className="px-4 pb-6 sm:px-6"
        >
            {monitor && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Editing monitor: {monitor.name}
                </p>
            )}

            {monitor && <EditDestinationForm monitor={monitor} />}
        </BackupSectionContainer>
    );
};

export default EditMonitorContainer;
