import { router, usePage } from '@inertiajs/react';
import React from 'react';

import backup from '@/routes/backup';
import type { BackupDestinationsPageEditProps } from '../../../../types';
import BackupSectionContainer from '../../../shared/section-container';
import TestConnectionModal from '../test/modal';
import EditDestinationForm from './form';

const EditDestinationContainer: React.FC = () => {
    const { destination, enabled, test } =
        usePage<BackupDestinationsPageEditProps>().props;

    return (
        <BackupSectionContainer
            title="Edit Backup Destination"
            description="Fill in the details below to update the backup destination."
            className="px-4 pb-6 sm:px-6"
        >
            {!destination && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Loading destination details...
                </p>
            )}

            {destination && (
                <EditDestinationForm
                    destination={destination}
                    enabled={enabled}
                />
            )}

            {test && (
                <TestConnectionModal
                    isOpen={true}
                    onOpenChange={(nextOpen) => {
                        if (!nextOpen) {
                            router.get(
                                backup.destinations.show(destination.id),
                                {},
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                },
                            );
                        }
                    }}
                    uuid={test.uuid}
                    startUrl={test.start_url}
                    destination={destination}
                />
            )}
        </BackupSectionContainer>
    );
};

export default EditDestinationContainer;
