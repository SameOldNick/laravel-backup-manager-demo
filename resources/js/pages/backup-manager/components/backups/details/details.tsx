import { format, isValid, parseISO } from 'date-fns';
import { AlertTriangle, Archive } from 'lucide-react';
import React, { useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Backup, BackupStatus } from '../../../types';
import { backupStatusLabels } from '../constants';

interface BackupDetailsModalProps {
    backup: Backup;
    onClose?: () => void;
}

const formatDateTime = (value: string | null | undefined): string => {
    if (!value) {
        return 'N/A';
    }

    const parsed = parseISO(value);

    if (!isValid(parsed)) {
        return 'N/A';
    }

    return format(parsed, 'PPp');
};

const formatBytes = (size: number | undefined): string => {
    if (typeof size !== 'number' || Number.isNaN(size)) {
        return 'N/A';
    }

    if (size === 0) {
        return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const unitIndex = Math.min(
        Math.floor(Math.log(size) / Math.log(1024)),
        units.length - 1,
    );
    const value = size / 1024 ** unitIndex;

    return `${value.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
};

const statusLabel = (status: BackupStatus): string => {
    return backupStatusLabels[status];
};

const statusVariant = (
    status: BackupStatus,
): React.ComponentProps<typeof Badge>['color'] => {
    if (status === 'successful') {
        return 'success';
    }

    if (status === 'failed') {
        return 'danger';
    }

    return 'warning';
};

interface DetailFieldProps {
    label: string;
    value: React.ReactNode;
    mono?: boolean;
}

const DetailField: React.FC<DetailFieldProps> = ({
    label,
    value,
    mono = false,
}) => {
    return (
        <div className="space-y-1.5">
            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                {label}
            </p>
            <p
                className={`text-sm text-slate-800 dark:text-slate-200 ${mono ? 'font-mono text-xs sm:text-sm' : ''}`}
                title={typeof value === 'string' ? value : undefined}
            >
                {value}
            </p>
        </div>
    );
};

const BackupDetailsModal: React.FC<BackupDetailsModalProps> = ({
    backup,
    onClose,
}) => {
    const handleModalOpenChange = useCallback(
        (open: boolean) => {
            if (!open) {
                if (onClose) {
                    onClose();
                }
            }
        },
        [onClose],
    );

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    return (
        <>
            <Dialog open={true} onOpenChange={handleModalOpenChange}>
                <DialogContent
                    className="sm:max-w-3xl"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <div className="flex items-start gap-3.5">
                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100/80 dark:bg-indigo-950/60 dark:ring-indigo-900/60">
                                <Archive className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <DialogTitle>Backup Details</DialogTitle>
                                <DialogDescription>
                                    Full metadata and file information for this
                                    backup.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-5 py-1">
                        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    Backup Summary
                                </h3>
                                <Badge color={statusVariant(backup.status)}>
                                    {statusLabel(backup.status)}
                                </Badge>
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <DetailField
                                    label="Backup ID"
                                    value={backup.uuid}
                                    mono
                                />
                                <DetailField
                                    label="Created"
                                    value={formatDateTime(backup.created_at)}
                                />
                                <DetailField
                                    label="Updated"
                                    value={formatDateTime(backup.updated_at)}
                                />
                                <DetailField
                                    label="Deleted"
                                    value={formatDateTime(backup.deleted_at)}
                                />
                            </div>
                        </div>

                        <div className="h-px w-full bg-slate-200 dark:bg-slate-700" />

                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                File Details
                            </h3>

                            {backup.file ? (
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <DetailField
                                        label="File ID"
                                        value={backup.file.id}
                                        mono
                                    />
                                    <DetailField
                                        label="File Name"
                                        value={backup.file.name}
                                    />
                                    <DetailField
                                        label="Size"
                                        value={formatBytes(
                                            backup.file.meta?.size,
                                        )}
                                    />
                                    <DetailField
                                        label="MIME Type"
                                        value={
                                            backup.file.meta?.mime_type || 'N/A'
                                        }
                                    />
                                    <DetailField
                                        label="Last Modified"
                                        value={formatDateTime(
                                            backup.file.meta?.last_modified,
                                        )}
                                    />
                                    <DetailField
                                        label="File Created"
                                        value={formatDateTime(
                                            backup.file.created_at,
                                        )}
                                    />
                                </div>
                            ) : (
                                <div className="mt-4 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                                    This backup does not have an associated
                                    file.
                                </div>
                            )}
                        </div>

                        {backup.error_message ? (
                            <div className="rounded-xl border border-red-200 bg-red-50/70 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                                    <AlertTriangle className="h-4 w-4" />
                                    Error Message
                                </div>
                                <p className="text-sm leading-relaxed break-words">
                                    {backup.error_message}
                                </p>
                            </div>
                        ) : null}
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BackupDetailsModal;
