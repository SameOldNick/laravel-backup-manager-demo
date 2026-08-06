import { router, Link } from '@inertiajs/react';
import { HardDrive, Pencil, Trash2 } from 'lucide-react';
import React, { useCallback } from 'react';
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
import type { BackupMonitor } from '../../../../types';
import BackupTableContainer from '../../../shared/table-container';

interface MonitorsTableProps {
    monitors?: BackupMonitor[];
}

const MonitorsTable: React.FC<MonitorsTableProps> = ({ monitors = [] }) => {
    return (
        <BackupTableContainer>
            <table className="w-full">
                <thead>
                    <tr className="!border-0">
                        <th className="h-12 w-[80px] rounded-tl-lg border-t border-neutral-200 bg-neutral-100 px-4 text-center first:border-s last:border-e dark:border-slate-600 dark:bg-slate-700">
                            <Checkbox className="translate-y-px" />
                        </th>
                        <th className="h-12 border-t border-neutral-200 bg-neutral-100 px-4 text-center first:border-s last:border-e dark:border-slate-600 dark:bg-slate-700">
                            Name
                        </th>
                        <th className="h-12 border-t border-neutral-200 bg-neutral-100 px-4 text-center first:border-s last:border-e dark:border-slate-600 dark:bg-slate-700">
                            Disks
                        </th>
                        <th className="h-12 border-t border-neutral-200 bg-neutral-100 px-4 text-center first:border-s last:border-e dark:border-slate-600 dark:bg-slate-700">
                            Max Age (Days)
                        </th>
                        <th className="h-12 border-t border-neutral-200 bg-neutral-100 px-4 text-center first:border-s last:border-e dark:border-slate-600 dark:bg-slate-700">
                            Max Storage (MB)
                        </th>
                        <th className="h-12 border-t border-neutral-200 bg-neutral-100 px-4 text-center first:border-s last:border-e dark:border-slate-600 dark:bg-slate-700">
                            Enabled
                        </th>
                        <th className="h-12 rounded-tr-lg border-t border-neutral-200 bg-neutral-100 px-4 text-center first:border-s last:border-e dark:border-slate-600 dark:bg-slate-700">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {monitors.length > 0 &&
                        monitors.map((monitor, index) => (
                            <MonitorRow
                                key={monitor.id}
                                monitor={monitor}
                                isLast={index === monitors.length - 1}
                            />
                        ))}
                    {monitors.length === 0 && (
                        <tr>
                            <td
                                colSpan={6}
                                className="border-b border-neutral-200 px-4 py-10 dark:border-slate-600"
                            >
                                <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <HardDrive className="h-6 w-6" />
                                    </span>
                                    <p className="text-light-primary-text text-base font-semibold">
                                        No monitors yet
                                    </p>
                                    <p className="text-light-secondary-text text-sm">
                                        Add a monitor to track the status of
                                        your backup archives.
                                    </p>
                                    <Button size="sm" asChild>
                                        <Link href={backup.monitors.create()}>
                                            Add Monitor
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

interface MonitorRowProps {
    monitor: BackupMonitor;
    destinations?: string[];
    isLast: boolean;
}

const MonitorRow: React.FC<MonitorRowProps> = ({
    monitor: {
        name,
        filesystem_configurations,
        maximum_age_in_days,
        maximum_storage_in_megabytes,
        is_active,
        id,
    },
    destinations,
    isLast,
}) => {
    const handleDelete = useCallback(() => {
        router.delete(backup.monitors.destroy(id));
    }, [id]);

    return (
        <tr>
            <td
                className={cn(
                    `border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-600`,
                    isLast && 'rounded-bl-lg',
                )}
            >
                <Checkbox className="translate-y-px" />
            </td>
            <td
                className={cn(
                    `border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-600`,
                    isLast && 'rounded-bl-lg',
                )}
                title={name}
            >
                {name}
            </td>

            <td
                className={cn(
                    `border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-600`,
                    isLast && 'rounded-bl-lg',
                )}
            >
                {filesystem_configurations?.map((config) => (
                    <span
                        key={config.id}
                        className="me-2 inline-block rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                    >
                        {config.name}
                    </span>
                ))}
            </td>
            <td
                className={cn(
                    `border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-600`,
                    isLast && 'rounded-bl-lg',
                )}
            >
                {maximum_age_in_days || '-'}
            </td>
            <td
                className={cn(
                    `border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-600`,
                    isLast && 'rounded-bl-lg',
                )}
            >
                {maximum_storage_in_megabytes || '-'}
            </td>
            <td
                className={cn(
                    `border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-600`,
                    isLast && 'rounded-bl-lg',
                )}
            >
                {is_active ? (
                    <span className="inline-flex h-6 items-center rounded-full bg-green-100 px-2 text-xs font-medium text-green-800">
                        Enabled
                    </span>
                ) : (
                    <span className="inline-flex h-6 items-center rounded-full bg-red-100 px-2 text-xs font-medium text-red-800">
                        Disabled
                    </span>
                )}
            </td>
            <td
                className={cn(
                    `border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-600`,
                    isLast && 'rounded-bl-lg',
                )}
            >
                <div className="flex justify-center gap-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="cursor-pointer rounded-[50%] bg-green-600/10 text-green-600"
                        asChild
                    >
                        <Link href={backup.monitors.edit(id)}>
                            <Pencil className="h-5 w-5" />
                        </Link>
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="cursor-pointer rounded-[50%] bg-red-500/10 text-red-500"
                                title="Delete Monitor"
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle className="text-lg font-semibold">
                                Delete Monitor
                            </DialogTitle>
                            <DialogDescription className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                                Are you sure you want to delete this monitor?
                            </DialogDescription>

                            <div className="mt-6 flex justify-end gap-3">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        color="danger"
                                        onClick={handleDelete}
                                    >
                                        Delete Monitor
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

export default MonitorsTable;
