import { Link } from '@inertiajs/react';
import { parseISO } from 'date-fns';
import { Archive, Download, ExternalLink } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import backupRoutes from '@/routes/backup';
import type { Backup, BackupStatus } from '../../types';
import BackupTableContainer from '../shared/table-container';
import { backupStatusLabels } from './constants';
import BackupDetailsModal from './details/details';

const statusLabel = (status: BackupStatus): string => {
    return backupStatusLabels[status];
};

interface BackupListTableProps {
    backups?: Backup[];
}

const BackupListTable: React.FC<BackupListTableProps> = ({ backups = [] }) => {
    const [backupDetails, setBackupDetails] = React.useState<Backup | null>(
        null,
    );

    const handleShowDetails = useCallback(async (backup: Backup) => {
        setBackupDetails(backup);
    }, []);

    const handleBackupDetailsClose = useCallback(() => {
        setBackupDetails(null);
    }, []);

    return (
        <BackupTableContainer>
            <table className="w-full">
                <thead>
                    <tr className="border-slate-300">
                        <th className="h-12 w-[80px] rounded-tl-lg border-t border-neutral-200 bg-neutral-100 px-4 text-center first:border-s last:border-e dark:border-slate-600 dark:bg-slate-700">
                            ID
                        </th>
                        <th className="h-12 border-t border-neutral-200 bg-neutral-100 px-4 text-center first:border-s last:border-e dark:border-slate-600 dark:bg-slate-700">
                            Name
                        </th>
                        <th className="h-12 border-t border-neutral-200 bg-neutral-100 px-4 text-center first:border-s last:border-e dark:border-slate-600 dark:bg-slate-700">
                            Status
                        </th>
                        <th className="h-12 border-t border-neutral-200 bg-neutral-100 px-4 text-center first:border-s last:border-e dark:border-slate-600 dark:bg-slate-700">
                            Created
                        </th>
                        <th className="h-12 rounded-tr-lg border-t border-neutral-200 bg-neutral-100 px-4 text-center first:border-s last:border-e dark:border-slate-600 dark:bg-slate-700">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {backups.length > 0 &&
                        backups.map((backup, index) => (
                            <BackupRow
                                key={backup.uuid}
                                backup={backup}
                                isLast={index === backups.length - 1}
                                onShowDetails={() => handleShowDetails(backup)}
                            />
                        ))}
                    {backups.length === 0 && (
                        <tr>
                            <td
                                colSpan={5}
                                className="border-r border-b border-l border-neutral-200 px-4 py-10 dark:border-slate-600"
                            >
                                <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Archive className="h-6 w-6" />
                                    </span>
                                    <p className="text-light-primary-text text-base font-semibold">
                                        No backups yet
                                    </p>
                                    <p className="text-light-secondary-text text-sm">
                                        Run your first backup now, or configure
                                        destinations and schedules first.
                                    </p>
                                    <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                                        <Link
                                            href={backupRoutes.destinations.create()}
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="cursor-pointer"
                                            >
                                                Add Destination
                                            </Button>
                                        </Link>
                                        <Link
                                            href={backupRoutes.schedules.backup.create()}
                                        >
                                            <Button
                                                size="sm"
                                                className="cursor-pointer"
                                            >
                                                Add Schedule
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {backupDetails && (
                <BackupDetailsModal
                    backup={backupDetails}
                    onClose={handleBackupDetailsClose}
                />
            )}
        </BackupTableContainer>
    );
};

interface BackupRowProps {
    backup: Backup;
    isLast: boolean;
    onShowDetails?: () => Promise<void>;
}

const BackupRow: React.FC<BackupRowProps> = ({
    backup,
    isLast,
    onShowDetails,
}) => {
    const canDownloadBackup = useMemo(
        () => backup.file?.file_exists === true,
        [backup.file?.file_exists],
    );

    const statusBadgeClassNames = useCallback((status: BackupStatus) => {
        if (status === 'successful') {
            return 'border-green-600 bg-green-600/15 text-green-600';
        }

        if (status === 'failed') {
            return 'border-red-600 bg-red-600/15 text-red-600';
        }

        return 'border-yellow-600 bg-yellow-600/15 text-yellow-600';
    }, []);

    const handleShowMoreDetails = useCallback(async () => {
        if (onShowDetails) {
            await onShowDetails();
        }
    }, [onShowDetails]);

    return (
        <tr>
            <td
                className={cn(
                    `border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-600`,
                    isLast && 'rounded-bl-lg',
                )}
            >
                {backup.uuid}
            </td>
            <td
                className={cn(
                    `border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-600`,
                    isLast && 'rounded-bl-lg',
                )}
                title={backup.file?.name || 'N/A'}
            >
                {backup.file?.name || 'N/A'}
            </td>

            <td
                className={cn(
                    `border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-600`,
                    isLast && 'rounded-bl-lg',
                )}
            >
                <span
                    className={cn(
                        `inline-block rounded-full border px-3 py-1 text-sm font-medium`,
                        statusBadgeClassNames(backup.status),
                    )}
                >
                    {statusLabel(backup.status)}
                </span>
            </td>
            <td
                className={cn(
                    `border-b border-neutral-200 px-4 py-4 text-center first:border-s last:border-e dark:border-slate-600`,
                    isLast && 'rounded-bl-lg',
                )}
            >
                {parseISO(backup.created_at).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                })}
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
                        className="cursor-pointer rounded-[50%] bg-blue-600/10 text-blue-600"
                        onClick={handleShowMoreDetails}
                    >
                        <ExternalLink className="h-5 w-5" />
                    </Button>
                    {canDownloadBackup && (
                        <Button
                            asChild
                            size="icon"
                            variant="ghost"
                            className="cursor-pointer rounded-[50%] bg-green-600/10 text-green-600"
                        >
                            <Link
                                href={backupRoutes.backups.download(
                                    backup.uuid,
                                )}
                                target="_blank"
                            >
                                <Download className="h-5 w-5" />
                            </Link>
                        </Button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default BackupListTable;
