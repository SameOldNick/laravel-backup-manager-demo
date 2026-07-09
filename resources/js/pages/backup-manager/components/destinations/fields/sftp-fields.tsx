import { useState } from 'react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

import { authTypes } from '../constants';
import type {
    RootFormValues,
    SFTPDestinationFormValues,
    SFTPDestinationKeyFormValues,
    SFTPDestinationPasswordFormValues,
} from '../types';
import DestinationFormConnection from './connection-fields';
import DestinationFormKey from './key-fields';
import DestinationFormLogin from './login-fields';
import DestinationFormRoot from './root-field';

interface DestinationFormSFTPProps {
    defaultValues: SFTPDestinationFormValues;
    errors: Record<string, string>;
    optional?: boolean;
}

const DestinationFormSFTP: React.FC<DestinationFormSFTPProps> = ({
    defaultValues,
    errors,
    optional,
}) => {
    const [authType, setAuthType] = useState<string>(
        defaultValues.auth_type || 'password',
    );

    const handleAuthTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAuthType(e.target.value);
    };

    return (
        <>
            <DestinationFormConnection
                defaultValues={defaultValues}
                errors={errors}
            />

            <div className="col-span-12">
                <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                    Authentication Type <span className="text-red-600">*</span>
                </Label>
                <div className="w-full">
                    <select
                        name="auth_type"
                        value={authType}
                        className="my-3 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        onChange={handleAuthTypeSelect}
                    >
                        {Object.entries(authTypes).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    The authentication type determines the method used to
                    authenticate with the backup destination. Password
                    authentication requires a username and password, while key
                    authentication uses a private key and an optional passphrase
                    for added security.
                </p>
                <InputError message={errors.auth_type} />
            </div>

            {authType === 'password' && (
                <DestinationFormLogin
                    defaultValues={
                        defaultValues as SFTPDestinationPasswordFormValues
                    }
                    errors={errors}
                    optional={optional}
                />
            )}

            {authType === 'key' && (
                <DestinationFormKey
                    defaultValues={
                        defaultValues as SFTPDestinationKeyFormValues
                    }
                    errors={errors}
                    optional={optional}
                />
            )}

            <DestinationFormRoot
                defaultValues={defaultValues as RootFormValues}
                errors={errors}
                optional={optional}
            />
        </>
    );
};

export default DestinationFormSFTP;
