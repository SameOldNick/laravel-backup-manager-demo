import BackupSectionContainer from '../../../shared/section-container';

import CreateDestinationForm from './form';

const CreateDestinationContainer = () => {
    return (
        <BackupSectionContainer
            title="Create Backup Destination"
            description="Fill in the details below to create a new backup destination."
            className="px-4 pb-6 sm:px-6"
        >
            <CreateDestinationForm />
        </BackupSectionContainer>
    );
};

export default CreateDestinationContainer;
