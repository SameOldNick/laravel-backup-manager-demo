import { router, Form, usePage } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { BackupMonitorsPageCreateProps } from '@/pages/backup-manager/types';
import backup from '@/routes/backup';
import BackupMonitorFields from '../../fields/backup-monitor-fields';

const CreateDestinationForm = () => {
    const { destinations } = usePage<BackupMonitorsPageCreateProps>().props;

    const [selectedDestinationIds, setSelectedDestinationIds] = useState<
        number[]
    >([]);

    const defaultValues = {
        enabled: true,
        name: '',
        maximum_age_in_days: 1,
        maximum_storage_in_megabytes: 5000,
    };

    const transformFormData = useCallback(
        (data: Record<string, any>) => {
            data['destination_ids'] = selectedDestinationIds;
            data['is_active'] = data['is_active'] ? 1 : 0;

            return data;
        },
        [selectedDestinationIds],
    );

    return (
        <>
            <Form
                action={backup.monitors.store()}
                method="post"
                className="space-y-6"
                transform={transformFormData}
            >
                {({ processing, errors }) => (
                    <>
                        <BackupMonitorFields
                            defaultValues={{
                                ...defaultValues,
                                destinationIds: selectedDestinationIds,
                            }}
                            errors={errors}
                            destinations={destinations}
                            onDestinationChange={setSelectedDestinationIds}
                        />

                        <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-700">
                            <Button
                                type="submit"
                                className="h-11 cursor-pointer px-8"
                                disabled={processing}
                            >
                                {processing ? 'Creating...' : 'Create Monitor'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 cursor-pointer px-8"
                                onClick={() =>
                                    router.visit(backup.monitors.index())
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
