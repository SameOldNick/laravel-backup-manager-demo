import BackupSectionContainer from '../../../shared/section-container';

import CreateMonitorForm from './form';

const CreateMonitorContainer = () => {
    return (
        <BackupSectionContainer
            title="Create Backup Monitor"
            description="Fill in the details below to create a new backup monitor."
            className="px-4 pb-6 sm:px-6"
        >
            <CreateMonitorForm />
        </BackupSectionContainer>
    );
};

export default CreateMonitorContainer;
