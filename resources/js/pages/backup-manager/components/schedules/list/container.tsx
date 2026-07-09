import { router, Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import backup from '@/routes/backup';
import type { BackupSchedulesPageListProps } from '../../../types';
import SchedulesTable from './table';

const statusFilters = {
    enabled: 'Enabled',
    disabled: 'Disabled',
    all: 'All',
};

const statusOptions = Object.entries(statusFilters).map(([value, label]) => ({
    value,
    label,
}));

const ScheduleListContainer: React.FC = () => {
    const { backupSchedules, cleanupSchedules } =
        usePage<BackupSchedulesPageListProps>().props;

    const [status, setStatus] = useState<string>(statusOptions[2].value);
    const [search, setSearch] = useState('');

    const debounceRef = useRef<number | null>(null);

    const debouncedRefresh = useCallback(
        ({ status, query }: { status?: string; query?: string }) => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = window.setTimeout(() => {
                router.get(
                    backup.schedules.index(),
                    {
                        status: status !== 'all' ? status : undefined,
                        query: query && query.length > 0 ? query : undefined,
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
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setStatus(e.target.value);

            debouncedRefresh({
                status: e.target.value !== 'all' ? e.target.value : undefined,
                query: search,
            });
        },
        [debouncedRefresh, search],
    );

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);

            debouncedRefresh({
                status,
                query:
                    e.target.value && e.target.value.length > 0
                        ? e.target.value
                        : undefined,
            });
        },
        [debouncedRefresh, status],
    );

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="col-span-12 m-4">
                <div className="!pb-4">
                    <div className="flex flex-col gap-3 md:gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-3 md:gap-2">
                            <Input
                                type="text"
                                placeholder="Search schedules..."
                                className="h-9 w-[100px] sm:w-[200px]"
                                value={search}
                                onChange={handleSearchChange}
                            />
                            <select
                                name="status"
                                defaultValue={status}
                                onChange={handleStatusChange}
                                className="h-9 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                            >
                                {statusOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center justify-start sm:justify-end lg:justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="default" size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Schedule
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={backup.schedules.backup.create()}
                                        >
                                            Add Backup Schedule
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={backup.schedules.cleanup.create()}
                                        >
                                            Add Cleanup Schedule
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
                <div>
                    <SchedulesTable
                        backupSchedules={backupSchedules}
                        cleanupSchedules={cleanupSchedules}
                    />
                </div>
            </div>
        </div>
    );
};

export default ScheduleListContainer;
