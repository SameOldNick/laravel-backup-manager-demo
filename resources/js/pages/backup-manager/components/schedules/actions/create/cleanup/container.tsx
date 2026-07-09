import BackupSectionContainer from '../../../../shared/section-container';
import CreateScheduleForm from './form';

const CreateCleanupScheduleContainer = () => {
    return (
        <BackupSectionContainer
            title="Create Cleanup Schedule"
            description="Fill in the details below to create a new cleanup schedule."
            className="px-4 pb-6 sm:px-6"
        >
            <CreateScheduleForm />
        </BackupSectionContainer>
    );
};

export default CreateCleanupScheduleContainer;
