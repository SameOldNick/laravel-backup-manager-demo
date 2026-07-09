import type { DestinationFormValues } from '../types';
import DestinationFormFTP from './ftp-fields';
import DestinationFormLocal from './local-fields';
import DestinationFormSFTP from './sftp-fields';

interface DestinationFormProtocolProps {
    defaultValues: DestinationFormValues;
    errors: Record<string, string>;
    optional?: boolean;
}

const DestinationFormProtocol: React.FC<DestinationFormProtocolProps> = ({
    defaultValues,
    errors,
    optional,
}) => {
    return (
        <>
            {defaultValues.type === 'local' && (
                <DestinationFormLocal
                    defaultValues={defaultValues}
                    errors={errors}
                />
            )}
            {defaultValues.type === 'sftp' && (
                <DestinationFormSFTP
                    defaultValues={defaultValues}
                    errors={errors}
                    optional={optional}
                />
            )}
            {defaultValues.type === 'ftp' && (
                <DestinationFormFTP
                    defaultValues={defaultValues}
                    errors={errors}
                    optional={optional}
                />
            )}
        </>
    );
};

export default DestinationFormProtocol;
