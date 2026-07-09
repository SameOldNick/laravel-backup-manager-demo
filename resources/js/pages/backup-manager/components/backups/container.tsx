import { router } from '@inertiajs/react';
import { Archive } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import backup from '@/routes/backup';
import type { Backup, PerformingBackup } from '../../types';
import BackupSectionContainer from '../shared/section-container';
import type { BackupType } from './constants';
import { backupTypeLabels } from './constants';
import BackupRunConfirm from './run/confirm';
import BackupRunModal from './run/modal';
import BackupsTable from './table';

const statusFilters = {
    successful: 'Successful',
    failed: 'Failed',
    deleted: 'Deleted',
    all: 'All',
};

type BackupStep = {
    step: 'confirm';
    type: BackupType;
};

export interface BackupListContainerProps {
    backups?: Backup[];
    filters?: {
        status: string;
        search: string;
    };
    performingBackup?: PerformingBackup;
}

const BackupListContainer: React.FC<BackupListContainerProps> = ({
    backups,
    performingBackup,
    filters,
}) => {
    const [backupStep, setBackupStep] = useState<BackupStep>();
    const [status, setStatus] = useState<string>(filters?.status || 'all');
    const [search, setSearch] = useState<string>(filters?.search || '');

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const refreshBackups = useCallback(
        ({
            status,
            query,
        }: {
            status?: string;
            query?: string;
        } = {}) => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(() => {
                router.get(
                    backup.backups.index(),
                    {
                        status,
                        query,
                    },
                    {
                        preserveState: true,
                    },
                );
            }, 1000);
        },
        [],
    );

    const handleStatusChange = useCallback(
        (value: string) => {
            setStatus(value);
            refreshBackups({
                status: value !== 'all' ? value : undefined,
                query: search && search.length > 0 ? search : undefined,
            });
        },
        [refreshBackups, search],
    );

    const handleSearchChange = useCallback(
        (value: string) => {
            setSearch(value);

            refreshBackups({
                status: status !== 'all' ? status : undefined,
                query: value && value.length > 0 ? value : undefined,
            });
        },
        [refreshBackups, status],
    );

    const showConfirmModal = useCallback((type: BackupType) => {
        setBackupStep({ step: 'confirm', type });
    }, []);

    const handleRunClick = useCallback(async (type: BackupType) => {
        try {
            router.post(
                backup.perform.initialize(),
                { type },
                { preserveState: true },
            );
        } catch {
            // Handle error - close modal and show notification
            setBackupStep(undefined);

            toast('Failed to start backup. Please try again.');
        }
    }, []);

    return (
        <>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="col-span-12">
                    <BackupSectionContainer>
                        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-wrap items-center gap-3 md:gap-2">
                                <Input
                                    className="h-9 w-[100px] sm:w-[170px]"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) =>
                                        handleSearchChange(e.target.value)
                                    }
                                />

                                <div className="w-full shrink-0 sm:w-[170px]">
                                    <select
                                        defaultValue={status}
                                        onChange={(e) =>
                                            handleStatusChange(e.target.value)
                                        }
                                        className="my-3 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {Object.entries(statusFilters).map(
                                            ([value, label]) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {label}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-start sm:justify-end lg:justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="default"
                                            className="cursor-pointer"
                                            size="sm"
                                        >
                                            <Archive className="mr-2 h-4 w-4" />
                                            Perform Backup
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {Object.entries(backupTypeLabels).map(
                                            ([key, label]) => (
                                                <DropdownMenuItem
                                                    key={key}
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        showConfirmModal(
                                                            key as BackupType,
                                                        )
                                                    }
                                                >
                                                    {label}
                                                </DropdownMenuItem>
                                            ),
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <BackupsTable backups={backups} />
                    </BackupSectionContainer>
                </div>
            </div>

            {backupStep && backupStep.step === 'confirm' && (
                <BackupRunConfirm
                    type={backupStep.type}
                    onRun={() => handleRunClick(backupStep.type)}
                    onCancel={() => setBackupStep(undefined)}
                />
            )}
            {performingBackup !== undefined && (
                <BackupRunModal
                    isOpen={true}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            router.get(
                                backup.backups.index(),
                                {},
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                },
                            );
                        }
                    }}
                    uuid={performingBackup.uuid}
                    type={performingBackup.type}
                    startUrl={performingBackup.start_url}
                />
            )}
        </>
    );
};

export default BackupListContainer;
