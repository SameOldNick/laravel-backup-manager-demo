import { router, Form } from '@inertiajs/react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import backup from '@/routes/backup';
import type { BackupDestination } from '../../../../types';
import DestinationFormMain from '../../fields/main-fields';

import DestinationFormProtocol from '../../fields/protocol-fields';

interface EditDestinationFormProps {
    destination: BackupDestination;
    enabled: boolean;
}

const EditDestinationForm: React.FC<EditDestinationFormProps> = ({
    destination,
    enabled,
}) => {
    const [submitErrors, setSubmitErrors] = useState<Record<string, string>>(
        {},
    );

    const defaultValues = {
        enabled: enabled,
        name: destination.name,
        host: destination.host,
        port: destination.port,
        root: destination.root,
        auth_type: destination.auth_type,
        username: destination.username,
        password: '',
        confirm_password: '',
        private_key: '',
        passphrase: '',
    };

    const [protocol, setProtocol] = useState<'local' | 'ftp' | 'sftp'>(
        destination.type,
    );

    const transformFormData = useCallback((formData: Record<string, any>) => {
        // Only include credential fields if the user entered a value.
        const credentialFields = [
            'password',
            'confirm_password',
            'private_key',
            'passphrase',
            'username',
        ] as const;

        for (const field of credentialFields) {
            if (!formData[field]) {
                delete formData[field];
            }
        }

        return formData;
    }, []);

    const handleTestConnection = useCallback(() => {
        router.post(backup.destinations.test.initialize(destination.id));
    }, [destination.id]);

    // Dialog open state is managed internally by Dialog

    return (
        <>
            <Form
                action={backup.destinations.update(destination.id)}
                method="put"
                transform={transformFormData}
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-12">
                            <DestinationFormMain
                                defaultValues={{
                                    ...defaultValues,
                                    type: protocol,
                                }}
                                errors={{ ...errors, ...submitErrors }}
                                onProtocolChange={setProtocol}
                            />

                            <DestinationFormProtocol
                                defaultValues={
                                    {
                                        ...defaultValues,
                                        type: protocol,
                                    } as any
                                }
                                errors={{ ...errors, ...submitErrors }}
                                optional={true}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-700">
                            <Button
                                type="submit"
                                className="h-11 cursor-pointer px-8"
                                disabled={
                                    processing ||
                                    Object.keys(submitErrors).length > 0
                                }
                            >
                                {processing
                                    ? 'Updating...'
                                    : 'Update Destination'}
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-11 cursor-pointer px-8"
                                        disabled={processing}
                                    >
                                        Test Connection
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Test Connection</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to test the
                                        connection to this destination?
                                    </DialogDescription>
                                    <div className="mt-6 flex justify-end gap-3">
                                        <DialogClose asChild>
                                            <Button variant="outline">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                onClick={handleTestConnection}
                                                disabled={processing}
                                            >
                                                Yes, Test Connection
                                            </Button>
                                        </DialogClose>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 cursor-pointer px-8"
                                onClick={() =>
                                    router.visit(backup.destinations.index())
                                }
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
};

export default EditDestinationForm;
