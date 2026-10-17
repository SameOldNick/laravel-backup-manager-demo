import { router, Form } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import backup from '@/routes/backup';
import type { BackupDestination } from '../../../../../types';
import CleanupScheduleFields from '../../../fields/cleanup-schedule-fields';

const CreateCleanupScheduleForm = ({
    destinations,
}: {
    destinations: BackupDestination[];
}) => {
    const [selectedDestinationIds, setSelectedDestinationIds] = useState<
        number[]
    >([]);

    const transformFormData = (data: Record<string, any>) => {
        data['destination_ids'] = selectedDestinationIds;
        data['is_active'] = data['is_active'] ? 1 : 0;

        return data;
    };

    return (
        <>
            <Form
                action={backup.schedules.cleanup.store()}
                method="post"
                className="space-y-6"
                transform={transformFormData}
            >
                {({ processing, errors }) => (
                    <>
                        <CleanupScheduleFields
                            defaultValues={{
                                active: true,
                                scheduleName: '',
                                cronExpression: '',
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
                                {processing ? 'Creating...' : 'Create Schedule'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 cursor-pointer px-8"
                                onClick={() =>
                                    router.visit(backup.schedules.index())
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

export default CreateCleanupScheduleForm;
