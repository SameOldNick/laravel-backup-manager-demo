import { usePage } from '@inertiajs/react';
import type { BackupSchedulesPageEditProps } from '../../../../../types';
import BackupSectionContainer from '../../../../shared/section-container';
import EditScheduleForm from './form';

const EditScheduleContainer: React.FC = () => {
    const { schedule } = usePage<BackupSchedulesPageEditProps>().props;

    return (
        <BackupSectionContainer
            title="Edit Backup Schedule"
            description="Fill in the details below to update the backup schedule."
            className="px-4 pb-6 sm:px-6"
        >
            {!schedule && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Loading schedule details...
                </p>
            )}
            {schedule && <EditScheduleForm schedule={schedule} />}
        </BackupSectionContainer>
    );
};

export default EditScheduleContainer;
