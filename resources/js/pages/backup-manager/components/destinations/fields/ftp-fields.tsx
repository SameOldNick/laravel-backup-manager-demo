import type { FTPDestinationFormValues } from '../types';
import DestinationFormConnection from './connection-fields';
import DestinationFormLogin from './login-fields';
import DestinationFormRoot from './root-field';

export interface DestinationFormFTPProps {
    defaultValues: FTPDestinationFormValues;
    errors: Record<string, string>;
    optional?: boolean;
}

const DestinationFormFTP: React.FC<DestinationFormFTPProps> = ({
    defaultValues,
    errors,
    optional,
}) => {
    return (
        <>
            <DestinationFormConnection
                defaultValues={defaultValues}
                errors={errors}
            />
            <DestinationFormLogin
                defaultValues={defaultValues}
                errors={errors}
                optional={optional}
            />
            <DestinationFormRoot
                defaultValues={defaultValues}
                errors={errors}
                optional={true}
            />
        </>
    );
};

export default DestinationFormFTP;
