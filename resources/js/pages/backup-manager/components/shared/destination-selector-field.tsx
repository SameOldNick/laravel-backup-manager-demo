import { HardDrive, Server } from 'lucide-react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { BackupDestination } from '../../types';
import { protocols } from '../destinations/constants';

type DestinationSelectorFieldProps = {
    destinations: BackupDestination[];
    selectedIds?: number[];
    errors?: Record<string, string>;
    onChange?: (selectedIds: number[]) => void;
};

const DestinationSelectorField: React.FC<DestinationSelectorFieldProps> = ({
    destinations,
    selectedIds,
    errors,
    onChange,
}) => {
    const toggle = (destinationId: number, targetChecked: boolean) => {
        const newIds = targetChecked
            ? [...(selectedIds ?? []), destinationId]
            : selectedIds?.filter((id) => id !== destinationId);

        onChange?.(newIds ?? []);
    };

    return (
        <>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                        Destinations <span className="text-red-600">*</span>
                    </Label>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        Choose one or more filesystem destinations for this
                        schedule.
                    </p>
                </div>
                <Badge variant="outline" color="info" className="text-xs">
                    {selectedIds?.length ?? 0} selected
                </Badge>
            </div>

            {destinations.length === 0 && (
                <div className="my-3 rounded-lg border border-dashed border-amber-300 bg-amber-50/60 p-4 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
                    No active destinations are available. Create a destination
                    first, then assign it to this schedule.
                </div>
            )}

            {destinations.length > 0 && (
                <div className="my-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {destinations.map((destination) => (
                        <DestinationSelectorFieldOption
                            key={destination.id}
                            destination={destination}
                            isSelected={
                                selectedIds?.includes(destination.id) ?? false
                            }
                            isUnavailable={
                                !destination.is_active &&
                                !selectedIds?.includes(destination.id)
                            }
                            onToggle={(checked) =>
                                toggle(destination.id, checked)
                            }
                        />
                    ))}
                </div>
            )}

            <InputError message={errors?.destinations} />
        </>
    );
};

const DestinationSelectorFieldOption = ({
    destination,
    isSelected,
    isUnavailable,
    onToggle,
}: {
    destination: BackupDestination;
    isSelected: boolean;
    isUnavailable: boolean;
    onToggle: (checked: boolean) => void;
}) => {
    return (
        <div
            key={destination.id}
            onClick={() => !isUnavailable && onToggle(!isSelected)}
            onKeyDown={(e) => {
                if (!isUnavailable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onToggle(!isSelected);
                }
            }}
            tabIndex={isUnavailable ? -1 : 0}
            role="checkbox"
            aria-checked={isSelected}
            aria-disabled={isUnavailable}
            className={cn(
                'group cursor-pointer rounded-xl border p-4 text-left transition-all',
                'focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none',
                isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-neutral-200 bg-white hover:border-primary/40 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800/80',
                isUnavailable && 'cursor-not-allowed opacity-60',
            )}
        >
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    readOnly
                    aria-hidden="true"
                    checked={isSelected}
                    tabIndex={-1}
                    className="cursor-pointer"
                />

                <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                            {destination.name}
                        </p>
                        {!destination.is_active && (
                            <Badge color="warning">Disabled</Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                        <Server className="h-3.5 w-3.5" />
                        <span>
                            {protocols[destination.type] ??
                                destination.type.toUpperCase()}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <HardDrive className="h-3.5 w-3.5" />
                        <span className="truncate">
                            {destination.root ??
                                destination.host ??
                                'Remote destination'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DestinationSelectorField;
