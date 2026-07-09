import { router, Link } from '@inertiajs/react';
import { CronExpressionParser } from 'cron-parser';
import { format, parseISO } from 'date-fns';
import { CalendarClock, Pencil, Trash2 } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import backup from '@/routes/backup';

import type { BackupSchedule, CleanupSchedule } from '../../../types';
import BackupTableContainer from '../../shared/table-container';
import { backupTypes, cronPresets } from '../constants';

interface ScheduleTableProps {
    backupSchedules?: BackupSchedule[];
    cleanupSchedules?: CleanupSchedule[];
}

type ScheduleRowProps = {
    selected: boolean;
    onSelected: (selected: boolean) => void;
} & (
    | {
          command: 'backup';
          schedule: BackupSchedule;
      }
    | {
          command: 'cleanup';
          schedule: CleanupSchedule;
      }
);

const SchedulesTable: React.FC<ScheduleTableProps> = ({
    backupSchedules = [],
    cleanupSchedules = [],
}) => {
    const [selected, setSelected] = React.useState<number[]>([]);

    const { backups, cleanups } = useMemo(
        () => ({
            backups: backupSchedules,
            cleanups: cleanupSchedules,
        }),
        [backupSchedules, cleanupSchedules],
    );

    const handleSelectedChange = useCallback(
        (id: number, isSelected: boolean) => {
            setSelected((prevSelected) => {
                if (isSelected) {
                    return [...prevSelected, id];
                } else {
                    return prevSelected.filter(
                        (selectedId) => selectedId !== id,
                    );
                }
            });
        },
        [],
    );

    const handleSelectAllChange = useCallback(
        (isSelected: boolean) => {
            if (isSelected) {
                setSelected([
                    ...backupSchedules.map((schedule) => schedule.id),
                    ...cleanupSchedules.map((schedule) => schedule.id),
                ]);
            } else {
                setSelected([]);
            }
        },
        [backupSchedules, cleanupSchedules],
    );

    return (
        <BackupTableContainer>
            <table className="w-full border-separate border-spacing-0">
                <thead>
                    <tr>
                        <th className="h-12 w-[80px] border-b border-neutral-200 bg-neutral-50/80 px-4 text-center first:border-s last:border-e dark:border-slate-700 dark:bg-slate-800/70">
                            <Checkbox
                                className="translate-y-px"
                                checked={
                                    selected.length > 0 &&
                                    selected.length ===
                                        backupSchedules.length +
                                            cleanupSchedules.length
                                }
                                onCheckedChange={handleSelectAllChange}
                            />
                        </th>
                        <th className="h-12 border-b border-neutral-200 bg-neutral-50/80 px-4 text-center first:border-s last:border-e dark:border-slate-700 dark:bg-slate-800/70">
                            Name
                        </th>
                        <th className="h-12 border-b border-neutral-200 bg-neutral-50/80 px-4 text-center first:border-s last:border-e dark:border-slate-700 dark:bg-slate-800/70">
                            Cron Expression
                        </th>
                        <th className="h-12 border-b border-neutral-200 bg-neutral-50/80 px-4 text-center first:border-s last:border-e dark:border-slate-700 dark:bg-slate-800/70">
                            Next Run
                        </th>
                        <th className="h-12 border-b border-neutral-200 bg-neutral-50/80 px-4 text-center first:border-s last:border-e dark:border-slate-700 dark:bg-slate-800/70">
                            Status
                        </th>
                        <th className="h-12 border-b border-neutral-200 bg-neutral-50/80 px-4 text-center first:border-s last:border-e dark:border-slate-700 dark:bg-slate-800/70">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td
                            colSpan={6}
                            className="border-r border-b border-l border-neutral-200 bg-gradient-to-r from-neutral-50 to-transparent px-4 py-2 text-sm font-semibold text-neutral-700 dark:border-slate-700 dark:from-slate-800 dark:text-neutral-300"
                        >
                            Backup Schedules
                        </td>
                    </tr>
                    {backups.length > 0 &&
                        backups.map((schedule) => (
                            <ScheduleRow
                                key={schedule.id}
                                command="backup"
                                schedule={schedule}
                                selected={selected.includes(schedule.id)}
                                onSelected={() =>
                                    handleSelectedChange(
                                        schedule.id,
                                        !selected.includes(schedule.id),
                                    )
                                }
                            />
                        ))}
                    {backups.length === 0 && (
                        <tr>
                            <td
                                colSpan={6}
                                className="border-r border-b border-l border-neutral-200 px-4 py-10 dark:border-slate-700"
                            >
                                <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <CalendarClock className="h-6 w-6" />
                                    </span>
                                    <p className="text-light-primary-text text-base font-semibold">
                                        No backup schedules yet
                                    </p>
                                    <p className="text-light-secondary-text text-sm">
                                        Create an automated backup cadence to
                                        keep data protected without manual runs.
                                    </p>
                                    <Button size="sm" asChild>
                                        <Link
                                            href={backup.schedules.backup.create()}
                                        >
                                            Add Backup Schedule
                                        </Link>
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )}

                    <tr>
                        <td
                            colSpan={6}
                            className="border-r border-b border-l border-neutral-200 bg-gradient-to-r from-neutral-50 to-transparent px-4 py-2 text-sm font-semibold text-neutral-700 dark:border-slate-700 dark:from-slate-800 dark:text-neutral-300"
                        >
                            Cleanup Schedules
                        </td>
                    </tr>
                    {cleanups.map((schedule) => (
                        <ScheduleRow
                            key={schedule.id}
                            command="cleanup"
                            schedule={schedule}
                            selected={selected.includes(schedule.id)}
                            onSelected={() =>
                                handleSelectedChange(
                                    schedule.id,
                                    !selected.includes(schedule.id),
                                )
                            }
                        />
                    ))}
                    {cleanups.length === 0 && (
                        <tr>
                            <td
                                colSpan={6}
                                className="border-r border-b border-l border-neutral-200 px-4 py-10 dark:border-slate-700"
                            >
                                <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
                                    <span className="text-warning-dark bg-warning/15 inline-flex h-12 w-12 items-center justify-center rounded-full">
                                        <CalendarClock className="h-6 w-6" />
                                    </span>
                                    <p className="text-light-primary-text text-base font-semibold">
                                        No cleanup schedules yet
                                    </p>
                                    <p className="text-light-secondary-text text-sm">
                                        Add a cleanup schedule to automatically
                                        prune old backups and control storage.
                                    </p>
                                    <Button variant="outline" size="sm">
                                        <Link
                                            href={backup.schedules.cleanup.create()}
                                        >
                                            Add Cleanup Schedule
                                        </Link>
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </BackupTableContainer>
    );
};

const ScheduleRow: React.FC<ScheduleRowProps> = ({
    command,
    schedule: { id, name, cron_expression, next_run, is_active, ...schedule },
    selected,
    onSelected,
}) => {
    const presetLabel = useMemo(() => {
        const found = Object.entries(cronPresets).find(
            ([, value]) => value.value === cron_expression,
        );

        return found ? found[1].label : null;
    }, [cron_expression]);

    const nextRun = useMemo(() => {
        if (next_run) {
            const date = parseISO(next_run);

            return format(date, 'MMM do yyyy, h:mm:ss a');
        }

        try {
            const cron = CronExpressionParser.parse(cron_expression);

            const date = cron.next().toDate();

            return 'Est.' + format(date, 'MMM do yyyy, h:mm:ss a');
        } catch (error) {
            console.error('Error parsing cron expression:', error);

            return 'N/A';
        }
    }, [next_run, cron_expression]);

    const routes = useMemo(() => {
        if (command === 'backup') {
            return {
                edit: backup.schedules.backup.edit(id),
                update: backup.schedules.backup.update(id),
                destroy: backup.schedules.backup.destroy(id),
            };
        } else {
            return {
                edit: backup.schedules.cleanup.edit(id),
                update: backup.schedules.cleanup.update(id),
                destroy: backup.schedules.cleanup.destroy(id),
            };
        }
    }, [command, id]);

    const handleActivateClick = useCallback(() => {
        router.put(
            routes.update,
            { is_active: !is_active },
            {
                preserveState: true,
            },
        );
    }, [is_active, routes]);

    const handleDeleteClick = useCallback(() => {
        router.delete(routes.destroy, {
            preserveState: true,
        });
    }, [routes]);

    return (
        <tr className="transition-colors hover:bg-blue-50/40 dark:hover:bg-slate-800/60">
            <td className="border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-700">
                <Checkbox
                    className="translate-y-px"
                    checked={selected}
                    onCheckedChange={onSelected}
                />
            </td>

            <td
                className="border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-700"
                title={name}
            >
                <div className="flex flex-col items-center gap-2">
                    {name}
                    {command === 'backup' && 'type' in schedule && (
                        <>
                            <Badge color="blue" className="ml-2">
                                {backupTypes[
                                    schedule.type as keyof typeof backupTypes
                                ] ??
                                    `${schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1)}`}
                            </Badge>
                        </>
                    )}
                </div>
            </td>
            <td className="border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-700">
                <div className="flex flex-col items-center gap-2">
                    <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 font-mono text-[13px] dark:border-slate-600 dark:bg-slate-700">
                        {cron_expression}
                    </span>
                    <Badge color={presetLabel ? 'emerald' : 'amber'}>
                        {presetLabel ?? 'Custom'}
                    </Badge>
                </div>
            </td>
            <td className="border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-700">
                {nextRun}
            </td>
            <td className="border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-700">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="cursor-pointer rounded-full bg-neutral-100 transition-colors hover:bg-neutral-600/20 dark:bg-neutral-800/50 dark:hover:bg-neutral-700/50"
                            title={
                                is_active
                                    ? 'Deactivate Schedule'
                                    : 'Activate Schedule'
                            }
                        >
                            {is_active ? (
                                <CalendarClock className="text-emerald-600" />
                            ) : (
                                <CalendarClock className="text-amber-600" />
                            )}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle className="text-lg font-semibold">
                            {is_active
                                ? 'Deactivate Schedule'
                                : 'Activate Schedule'}
                        </DialogTitle>
                        <DialogDescription className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                            Are you sure you want to{' '}
                            {is_active ? 'deactivate' : 'activate'} this
                            schedule?
                        </DialogDescription>

                        <div className="mt-6 flex justify-end gap-3">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant={is_active ? 'outline' : 'default'}
                                    onClick={handleActivateClick}
                                >
                                    {is_active ? 'Deactivate' : 'Activate'}
                                </Button>
                            </DialogClose>
                        </div>
                    </DialogContent>
                </Dialog>
            </td>
            <td className="border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-700">
                <div className="flex justify-center gap-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full bg-blue-600/10 text-blue-600 transition-colors hover:bg-blue-600/20"
                        asChild
                    >
                        <Link href={routes.edit}>
                            <Pencil className="h-5 w-5" />
                        </Link>
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="cursor-pointer rounded-full bg-red-500/10 text-red-500 transition-colors hover:bg-red-500/20"
                                title="Delete Schedule"
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle className="text-lg font-semibold">
                                Delete Schedule
                            </DialogTitle>
                            <DialogDescription className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                                Are you sure you want to delete this schedule?
                            </DialogDescription>

                            <div className="mt-6 flex justify-end gap-3">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        color="danger"
                                        onClick={handleDeleteClick}
                                    >
                                        Delete
                                    </Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </td>
        </tr>
    );
};

const Badge: React.FC<
    React.HTMLAttributes<HTMLSpanElement> & { color?: string }
> = ({ color, children, className, ...props }) => {
    const colorStyles: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        emerald:
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    };

    return (
        <span
            className={cn(
                'rounded-full px-2 py-0.5 text-xs font-semibold',
                color ? colorStyles[color] : undefined,
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export default SchedulesTable;
