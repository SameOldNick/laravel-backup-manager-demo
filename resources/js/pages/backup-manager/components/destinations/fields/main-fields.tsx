import { useState } from 'react';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { protocols } from '../constants';
import type { BaseDestinationFormValues } from '../types';

interface DestinationFormMainProps {
    defaultValues: BaseDestinationFormValues;
    errors: Record<string, string>;
    onProtocolChange?: (protocol: 'local' | 'ftp' | 'sftp') => void;
}

const DestinationFormMain: React.FC<DestinationFormMainProps> = ({
    defaultValues,
    errors,
    onProtocolChange,
}) => {
    const [enabled, setEnabled] = useState(defaultValues.enabled);

    return (
        <>
            <div className="col-span-12">
                <div className="flex items-start space-x-3 sm:items-center">
                    <Checkbox
                        checked={enabled}
                        onCheckedChange={(checked) => {
                            setEnabled(!!checked);
                        }}
                        id="enabled"
                        className="mt-1 h-4.5 w-4.5 border border-neutral-500"
                    />
                    <Label
                        htmlFor="enabled"
                        className="h-4.5 cursor-pointer text-sm font-semibold text-neutral-700 dark:text-neutral-200"
                    >
                        Enable this destination
                    </Label>
                    <Input
                        type="hidden"
                        name="enabled"
                        value={enabled ? '1' : '0'}
                    />
                </div>
                <InputError message={errors.enabled} />
            </div>

            <div className="col-span-12 sm:col-span-8">
                <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                    Name <span className="text-red-600">*</span>
                </Label>
                <div>
                    <Input
                        name="name"
                        type="text"
                        placeholder="Enter name"
                        className="my-3 h-10"
                        defaultValue={defaultValues.name}
                    />
                </div>
                <InputError message={errors.name} />
            </div>

            <div className="col-span-12 sm:col-span-4">
                <Label
                    htmlFor="type"
                    className="text-sm font-semibold text-neutral-700 dark:text-neutral-200"
                >
                    Type <span className="text-red-600">*</span>
                </Label>
                <div className="w-full">
                    <select
                        className="my-3 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        name="type"
                        defaultValue={defaultValues.type}
                        onChange={(e) =>
                            onProtocolChange?.(
                                e.target.value as 'local' | 'ftp' | 'sftp',
                            )
                        }
                    >
                        {Object.entries(protocols).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    The destination type determines the method used for backups.
                    FTP is a common type for file transfers, while SFTP provides
                    an added layer of security by encrypting the data during
                    transfer. Local type allows you to save backups to a local
                    directory.
                </p>
                <InputError message={errors.type} />
            </div>
        </>
    );
};

export default DestinationFormMain;
