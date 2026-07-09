import { Eye, EyeOff } from 'lucide-react';
import { useCallback, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    FTPDestinationFormValues,
    SFTPDestinationPasswordFormValues,
} from '../types';

interface DestinationFormLoginProps {
    defaultValues: FTPDestinationFormValues | SFTPDestinationPasswordFormValues;
    errors: Record<string, string>;
    optional?: boolean;
}

const DestinationFormLogin: React.FC<DestinationFormLoginProps> = ({
    defaultValues,
    errors,
    optional,
}) => {
    const [showPassword, setShowPassword] = useState<{
        password: boolean;
        confirm_password: boolean;
    }>({
        password: false,
        confirm_password: false,
    });

    const toggleShowPassword = useCallback(
        (type: 'password' | 'confirm_password') => {
            setShowPassword((prev) => ({
                ...prev,
                [type]: !prev[type],
            }));
        },
        [],
    );

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
                        className="h-10 my-3"
                        defaultValue={defaultValues.username}
                    />
                </div>
                <InputError message={errors.username} />
            </div>
            <div className="col-span-12 sm:col-span-6">
                <Label className="mb-2 inline-block text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                    Current Password{' '}
                    {optional ? (
                        <span className="text-muted-foreground">
                            (optional)
                        </span>
                    ) : (
                        <span className="text-red-600">*</span>
                    )}
                </Label>
                <div className="">
                    <div className="relative h-10">
                        <Input
                            name="password"
                            type={showPassword.password ? 'text' : 'password'}
                            placeholder="Enter Current Password"
                            className=" my-3 h-full rounded-lg border border-neutral-300 ps-3 pe-12 !shadow-none !ring-0 focus:border-primary focus-visible:border-primary dark:border-slate-700 dark:focus:border-primary"
                        />
                        <Button
                            type="button"
                            onClick={() => toggleShowPassword('password')}
                            className="absolute top-1/2 right-4 h-[unset] -translate-y-1/2 transform bg-transparent !p-0 text-muted-foreground hover:bg-transparent"
                        >
                            {showPassword.password ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
                <InputError message={errors.password} />
            </div>
            <div className="col-span-12 sm:col-span-6">
                <Label className="mb-2 inline-block text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                    Confirm Password{' '}
                    {optional ? (
                        <span className="text-muted-foreground">
                            (optional)
                        </span>
                    ) : (
                        <span className="text-red-600">*</span>
                    )}
                </Label>
                <div className="!h-10">
                    <div className="relative h-10">
                        <Input
                            name="confirm_password"
                            type={
                                showPassword.confirm_password
                                    ? 'text'
                                    : 'password'
                            }
                            placeholder="Confirm Password"
                            className=" my-3 h-full rounded-lg border border-neutral-300 ps-3 pe-12 !shadow-none !ring-0 focus:border-primary focus-visible:border-primary dark:border-slate-700 dark:focus:border-primary"
                        />
                        <Button
                            type="button"
                            onClick={() =>
                                toggleShowPassword('confirm_password')
                            }
                            className="absolute top-1/2 right-4 h-[unset] -translate-y-1/2 transform bg-transparent !p-0 text-muted-foreground hover:bg-transparent"
                        >
                            {showPassword.confirm_password ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
                <InputError message={errors.confirm_password} />
            </div>
        </>
    );
};

export default DestinationFormLogin;
