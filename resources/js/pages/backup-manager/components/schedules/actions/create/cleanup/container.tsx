import { usePage } from '@inertiajs/react';
import type { CleanupSchedulesPageCreateProps } from '../../../../../types';
import BackupSectionContainer from '../../../../shared/section-container';
import CreateScheduleForm from './form';

const CreateCleanupScheduleContainer = () => {
    const { destinations } = usePage<CleanupSchedulesPageCreateProps>().props;

    return (
        <BackupSectionContainer
            title="Create Cleanup Schedule"
            description="Fill in the details below to create a new cleanup schedule."
            className="px-4 pb-6 sm:px-6"
        >
            <CreateScheduleForm destinations={destinations} />
        </BackupSectionContainer>
    );
};

export default CreateCleanupScheduleContainer;
