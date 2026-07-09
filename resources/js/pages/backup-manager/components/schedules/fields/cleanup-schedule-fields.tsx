import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import CronExpressionField from './shared/cron-expression-field';

interface CleanupScheduleFieldsProps {
    defaultValues: {
        scheduleName: string;
        cronExpression: string;
        active: boolean;
    };
    errors: Record<string, string>;
}

const CleanupScheduleFields: React.FC<CleanupScheduleFieldsProps> = ({
    defaultValues,
    errors,
}) => {
    return (
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-12">
            <div className="col-span-12">
                <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                    Schedule Name
                </Label>
                <div>
                    <Input
                        name="name"
                        placeholder="e.g. Daily Cleanup"
                        className="my-3 h-10"
                        defaultValue={defaultValues.scheduleName}
                    />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Provide a name to identify this schedule.
                </p>
                <InputError message={errors.name} />
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
                    <div className="flex items-center space-x-2">
                        <Input
                            type="checkbox"
                            name="is_active"
                            id="is_active"
                            className="h-5 w-5"
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

export default CleanupScheduleFields;
