import { router, Form } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import backup from '@/routes/backup';
import DestinationFormMain from '../../fields/main-fields';
import DestinationFormProtocol from '../../fields/protocol-fields';

const CreateDestinationForm = () => {
    const defaultValues = {
        enabled: true,
        name: '',
        root: '',
        host: '',
        port: 22,
        auth_type: 'password',
        username: '',
        password: '',
        confirm_password: '',
        private_key: '',
        passphrase: '',
    };

    const [protocol, setProtocol] = useState<'local' | 'ftp' | 'sftp'>('local');

    return (
        <>
            <Form
                action={backup.destinations.store()}
                method="post"
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
                                errors={errors}
                                onProtocolChange={setProtocol}
                            />

                            <DestinationFormProtocol
                                defaultValues={
                                    {
                                        ...defaultValues,
                                        type: protocol,
                                    } as any
                                }
                                errors={errors}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-700">
                            <Button
                                type="submit"
                                className="h-11 cursor-pointer px-8"
                                disabled={processing}
                            >
                                {processing
                                    ? 'Creating...'
                                    : 'Create Destination'}
                            </Button>
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

export default CreateDestinationForm;
