import { router, Link } from '@inertiajs/react';
import { Cable, HardDrive, Pencil, Trash2 } from 'lucide-react';
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
import type { BackupDestination } from '../../../../types';
import BackupTableContainer from '../../../shared/table-container';
import { protocols } from '../../constants';

interface DestinationsTableProps {
    destinations?: BackupDestination[];
}

const DestinationsTable: React.FC<DestinationsTableProps> = ({
    destinations = [],
}) => {
    const handleTestConnection = useCallback(
        async (destination: BackupDestination) => {
            router.post(backup.destinations.test.initialize(destination.id));
        },
        [],
    );

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
                            Type
                        </th>
                        <th className="h-12 border-t border-neutral-200 bg-neutral-100 px-4 text-center first:border-s last:border-e dark:border-slate-600 dark:bg-slate-700">
                            Host
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
                    {destinations.length > 0 &&
                        destinations.map((destination, index) => (
                            <DestinationRow
                                key={destination.id}
                                destination={destination}
                                isLast={index === destinations.length - 1}
                                onTestConnection={() =>
                                    handleTestConnection(destination)
                                }
                            />
                        ))}
                    {destinations.length === 0 && (
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
                                        No destinations yet
                                    </p>
                                    <p className="text-light-secondary-text text-sm">
                                        Add a destination to choose where your
                                        backup archives are stored.
                                    </p>
                                    <Button size="sm" asChild>
                                        <Link
                                            href={backup.destinations.create()}
                                        >
                                            Add Destination
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

interface DestinationRowProps {
    destination: BackupDestination;
    isLast: boolean;
    onTestConnection?: () => void;
}

const DestinationRow: React.FC<DestinationRowProps> = ({
    destination: { name, type, host, is_active, id },
    isLast,
    onTestConnection,
}) => {
    const handleDelete = useCallback(() => {
        router.delete(backup.destinations.destroy(id));
    }, [id]);

    const handleTestConnection = useCallback(() => {
        onTestConnection?.();
    }, [onTestConnection]);

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
                {protocols[type] || type}
            </td>
            <td
                className={cn(
                    `border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-600`,
                    isLast && 'rounded-bl-lg',
                )}
            >
                {host || '-'}
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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="cursor-pointer rounded-[50%] bg-blue-600/10 text-blue-600"
                            >
                                <Cable className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle className="text-lg font-semibold">
                                Test Connection
                            </DialogTitle>
                            <DialogDescription className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                                Are you sure you want to test the connection to
                                this destination?
                            </DialogDescription>

                            <div className="mt-6 flex justify-end gap-3">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        onClick={handleTestConnection}
                                    >
                                        Test Connection
                                    </Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="cursor-pointer rounded-[50%] bg-green-600/10 text-green-600"
                        asChild
                    >
                        <Link href={backup.destinations.show(id)}>
                            <Pencil className="h-5 w-5" />
                        </Link>
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="cursor-pointer rounded-[50%] bg-red-500/10 text-red-500"
                                title="Delete Destination"
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle className="text-lg font-semibold">
                                Delete Destination
                            </DialogTitle>
                            <DialogDescription className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                                Are you sure you want to delete this
                                destination?
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
                                        Delete Destination
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

export default DestinationsTable;
