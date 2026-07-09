import { Eye, EyeOff } from 'lucide-react';
import { useCallback, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SFTPDestinationKeyFormValues } from '../types';

interface DestinationFormKeyProps {
    defaultValues: SFTPDestinationKeyFormValues;
    errors: Record<string, string>;
    optional?: boolean;
}

const DestinationFormKey: React.FC<DestinationFormKeyProps> = ({
    defaultValues,
    errors,
    optional,
}) => {
    const [showPassword, setShowPassword] = useState({
        passphrase: false,
    });

    const toggleShowPassword = useCallback((type: 'passphrase') => {
        setShowPassword((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    }, []);

    return (
        <>
            <div className="col-span-12">
                <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                    Username{' '}
                    {optional ? (
                        <span className="text-muted-foreground">
                            (optional)
                        </span>
                    ) : (
                        <span className="text-red-600">*</span>
                    )}
                </Label>
                <div>
                    <Input
                        name="username"
                        type="text"
                        placeholder="Enter username"
                        className="my-3 h-10"
                        defaultValue={defaultValues.username}
                    />
                </div>
                <InputError message={errors.username} />
            </div>

            <div className="col-span-12">
                <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                    Private Key{' '}
                    {optional ? (
                        <span className="text-muted-foreground">
                            (optional)
                        </span>
                    ) : (
                        <span className="text-red-600">*</span>
                    )}
                </Label>
                <div>
                    <textarea
                        name="private_key"
                        placeholder="Enter private key"
                        rows={5}
                        defaultValue={defaultValues.private_key}
                        className="my-3"
                    />
                </div>
                <InputError message={errors.private_key} />
            </div>
            <div className="col-span-12">
                <Label className="mb-2 inline-block text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                    Passphrase{' '}
                    {optional ? (
                        <span className="text-muted-foreground">
                            (optional)
                        </span>
                    ) : (
                        <span className="text-red-600">*</span>
                    )}
                </Label>
                <div>
                    <div className="relative h-10">
                        <Input
                            name="passphrase"
                            type={showPassword.passphrase ? 'text' : 'password'}
                            placeholder="Enter Passphrase"
                            className="my-3 h-full rounded-lg border border-neutral-300 ps-3 pe-12 !shadow-none !ring-0 focus:border-primary focus-visible:border-primary dark:border-slate-700 dark:focus:border-primary"
                            defaultValue={defaultValues.passphrase}
                        />
                        <Button
                            type="button"
                            onClick={() => toggleShowPassword('passphrase')}
                            className="absolute top-1/2 right-4 h-[unset] -translate-y-1/2 transform bg-transparent !p-0 text-muted-foreground hover:bg-transparent"
                        >
                            {showPassword.passphrase ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
                <InputError message={errors.passphrase} />
            </div>
        </>
    );
};

export default DestinationFormKey;
