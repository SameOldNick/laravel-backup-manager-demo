import { router, usePage, Form } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import backup from '@/routes/backup';
import type { BackupSchedulesPageCreateProps } from '../../../../../types';
import BackupScheduleFields from '../../../fields/backup-schedule-fields';

const CreateScheduleForm = () => {
    const { destinations } = usePage<BackupSchedulesPageCreateProps>().props;

    const [selectedDestinationIds, setSelectedDestinationIds] = useState<
        number[]
    >([]);

    const transformFormData = (data: Record<string, any>) => {
        data['destination_ids'] = selectedDestinationIds;
        data['is_active'] = data['is_active'] ? 1 : 0;

        return data;
    };

    const handleDestinationChange = (selectedIds: number[]) => {
        setSelectedDestinationIds(selectedIds);
    };

    return (
        <>
            <Form
                action={backup.schedules.backup.store()}
                method="post"
                className="space-y-6"
                transform={transformFormData}
            >
                {({ processing, errors }) => (
                    <>
                        <BackupScheduleFields
                            defaultValues={{
                                active: true,
                                scheduleName: '',
                                scheduleType: 'files',
                                cronExpression: '',
                                destinationIds: selectedDestinationIds,
                            }}
                            errors={errors}
                            destinations={destinations}
                            onDestinationChange={handleDestinationChange}
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

export default CreateScheduleForm;
