import { router, Form, usePage } from '@inertiajs/react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';

import backup from '@/routes/backup';
import type {
    BackupMonitor,
    BackupMonitorsPageEditProps,
} from '../../../../types';

import BackupMonitorFields from '../../fields/backup-monitor-fields';

interface EditMonitorFormProps {
    monitor: BackupMonitor;
}

const EditMonitorForm: React.FC<EditMonitorFormProps> = ({ monitor }) => {
    const { destinations } = usePage<BackupMonitorsPageEditProps>().props;

    const [selectedDestinationIds, setSelectedDestinationIds] = useState<
        number[]
    >(
        () =>
            monitor.filesystem_configurations?.map((config) => config.id) || [],
    );

    const defaultValues = {
        enabled: monitor.is_active,
        name: monitor.name,
        maximum_age_in_days: monitor.maximum_age_in_days,
        maximum_storage_in_megabytes: monitor.maximum_storage_in_megabytes,
    };

    const transformFormData = useCallback(
        (formData: Record<string, any>) => {
            // Only include optional fields if the user entered a value.
            const optionalFields = [
                'maximum_age_in_days',
                'maximum_storage_in_megabytes',
            ] as const;

            for (const field of optionalFields) {
                if (!formData[field]) {
                    delete formData[field];
                }
            }

            formData['destination_ids'] = selectedDestinationIds;

            return formData;
        },
        [selectedDestinationIds],
    );

    // Dialog open state is managed internally by Dialog

    return (
        <>
            <Form
                action={backup.monitors.update(monitor.id)}
                method="put"
                transform={transformFormData}
                className="space-y-6"
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
                                {processing ? 'Updating...' : 'Update Monitor'}
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

export default EditMonitorForm;
