import { router, usePage, Form } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import backup from '@/routes/backup';
import type {
    BackupSchedule,
    BackupSchedulesPageEditProps,
} from '../../../../../types';
import BackupScheduleFields from '../../../fields/backup-schedule-fields';

type EditBackupScheduleFormProps = {
    schedule: BackupSchedule;
};

const EditBackupScheduleForm: React.FC<EditBackupScheduleFormProps> = ({
    schedule,
}) => {
    const { destinations } = usePage<BackupSchedulesPageEditProps>().props;

    const [selectedDestinationIds, setSelectedDestinationIds] = useState<
        number[]
    >(
        schedule.destination_ids ??
            schedule.filesystem_configurations?.map(
                (destination) => destination.id,
            ) ??
            [],
    );

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
                action={backup.schedules.backup.update(schedule.id)}
                method="put"
                className="space-y-6"
                transform={transformFormData}
            >
                {({ processing, errors }) => (
                    <>
                        <BackupScheduleFields
                            defaultValues={{
                                active: schedule.is_active,
                                scheduleName: schedule.name,
                                scheduleType: schedule.type,
                                cronExpression: schedule.cron_expression,
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
                                {processing ? 'Updating...' : 'Update Schedule'}
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

export default EditBackupScheduleForm;
