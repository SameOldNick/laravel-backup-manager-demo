import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { BackupDestination } from '../../../types';
import DestinationSelectorField from '../../shared/destination-selector-field';

interface BackupMonitorFieldsProps {
    defaultValues: {
        enabled: boolean;
        name: string;
        destinationIds: number[];
        maximum_age_in_days?: number;
        maximum_storage_in_megabytes?: number;
    };
    errors: Record<string, string>;
    destinations: BackupDestination[];
    onDestinationChange?: (selectedIds: number[]) => void;
}

const BackupMonitorFields: React.FC<BackupMonitorFieldsProps> = ({
    defaultValues,
    errors,
    destinations,
    onDestinationChange,
}) => {
    return (
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-12">
            <div className="col-span-12">
                <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-neutral-700 dark:text-neutral-200"
                >
                    Monitor Name <span className="text-red-600">*</span>
                </Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. Local Backup Monitor"
                    className="my-3 h-10"
                    defaultValue={defaultValues.name}
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Provide a name to identify this monitor.
                </p>
                <InputError message={errors.name} />
            </div>

            <div className="col-span-12 sm:col-span-6">
                <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                    Maximum Age (Days){' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                    name="maximum_age_in_days"
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    placeholder="Enter maximum age in days"
                    className="my-3 h-10"
                    defaultValue={defaultValues.maximum_age_in_days}
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    The maximum age in days for backups to be retained. Backups
                    older than this will be deleted. <br />
                    Leave blank to not enforce a maximum age.
                </p>
                <InputError message={errors.maximum_age_in_days} />
            </div>

            <div className="col-span-12 sm:col-span-6">
                <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                    Maximum Storage (Megabytes){' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                    name="maximum_storage_in_megabytes"
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    placeholder="Enter maximum storage in megabytes"
                    className="my-3 h-10"
                    defaultValue={defaultValues.maximum_storage_in_megabytes}
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    The maximum storage in megabytes for backups to be retained.{' '}
                    <br />
                    Leave blank to not enforce a maximum storage limit.
                </p>
                <InputError message={errors.maximum_storage_in_megabytes} />
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
                            Enabled
                        </Label>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Enable or disable this monitor.
                        </p>
                    </div>
                    <div>
                        <input
                            id="is_active"
                            name="is_active"
                            type="checkbox"
                            defaultChecked={defaultValues.enabled}
                        />
                    </div>
                </div>
                <InputError message={errors.is_active} />
            </div>
        </div>
    );
};

export default BackupMonitorFields;
