import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { BackupDestination } from '../../../types';
import { backupTypes } from '../constants';
import CronExpressionField from './shared/cron-expression-field';
import DestinationSelectorField from '../../shared/destination-selector-field';

interface BackupScheduleFieldsProps {
    defaultValues: {
        scheduleName: string;
        scheduleType: string;
        cronExpression: string;
        destinationIds: number[];
        active: boolean;
    };
    errors: Record<string, string>;
    destinations: BackupDestination[];
    onDestinationChange?: (selectedIds: number[]) => void;
}

const BackupScheduleFields: React.FC<BackupScheduleFieldsProps> = ({
    defaultValues,
    errors,
    destinations,
    onDestinationChange,
}) => {
    return (
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-12">
            <div className="col-span-12 sm:col-span-8">
                <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-neutral-700 dark:text-neutral-200"
                >
                    Schedule Name <span className="text-red-600">*</span>
                </Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. Daily Backup"
                    className="h-10 my-3"
                    defaultValue={defaultValues.scheduleName}
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Provide a name to identify this schedule.
                </p>
                <InputError message={errors.scheduleName} />
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
                        id="type"
                        name="type"
                        className='my-3 w-full border-input h-10 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        defaultValue={defaultValues.scheduleType}
                    >
                        {Object.entries(backupTypes).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Choose the type of backup this schedule will create.
                </p>
                <InputError message={errors.scheduleType} />
            </div>

            <div className="col-span-12">
                <DestinationSelectorField
                    selectedIds={defaultValues.destinationIds}
                    errors={errors}
                    destinations={destinations}
                    onChange={onDestinationChange}
                />
            </div>

            <div className="col-span-12">
                <div className="flex flex-row items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
                    <div className="space-y-0.5">
                        <Label
                            htmlFor="is_active"
                            className="text-sm font-semibold text-neutral-700 dark:text-neutral-200"
                        >
                            Active
                        </Label>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Enable or disable this schedule.
                        </p>
                    </div>
                    <div>
                        <input
                            id="is_active"
                            name="is_active"
                            type="checkbox"
                            defaultChecked={defaultValues.active}

                        />
                    </div>
                </div>
                <InputError message={errors.is_active} />
            </div>

            <div className="col-span-12">
                <CronExpressionField
                    defaultValue={defaultValues.cronExpression}
                    errors={errors}
                />
            </div>
        </div>
    );
};

export default BackupScheduleFields;
