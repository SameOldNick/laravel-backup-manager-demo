import BackupSectionContainer from '../../../../shared/section-container';
import CreateScheduleForm from './form';

const CreateScheduleContainer = () => {
    return (
        <BackupSectionContainer
            title="Create Backup Schedule"
            description="Fill in the details below to create a new backup schedule."
            className="px-4 pb-6 sm:px-6"
        >
            <CreateScheduleForm />
        </BackupSectionContainer>
    );
};

export default CreateScheduleContainer;
