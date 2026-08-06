import { router, Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import backup from '@/routes/backup';
import type { BackupMonitorsPageListProps } from '../../../../types';
import BackupSectionContainer from '../../../shared/section-container';
import MonitorsTable from './table';

const statusFilters = {
    enabled: 'Enabled',
    disabled: 'Disabled',
    all: 'All',
};

const statusOptions = Object.entries(statusFilters).map(([value, label]) => ({
    value,
    label,
}));

const MonitorsListContainer: React.FC = () => {
    const { monitors, filters } = usePage<BackupMonitorsPageListProps>().props;

    const [status, setStatus] = useState<keyof typeof statusFilters | null>(
        filters.active !== null
            ? filters.active
                ? 'enabled'
                : 'disabled'
            : 'all',
    );
    const [query, setQuery] = useState(filters.query ?? '');

    const debounceRef = useRef<number | null>(null);

    const debouncedRefresh = useCallback(
        (status: keyof typeof statusFilters | null, search: string) => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = window.setTimeout(() => {
                router.get(
                    backup.monitors.index(),
                    {
                        status:
                            status !== null ? status === 'enabled' : undefined,
                        query: search.length > 0 ? search : undefined,
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
            const selectedStatus = e.target.value as
                keyof typeof statusFilters | 'all';

            setStatus(selectedStatus !== 'all' ? selectedStatus : null);

            debouncedRefresh(
                selectedStatus !== 'all' ? selectedStatus : null,
                query,
            );
        },
        [debouncedRefresh, query],
    );

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);

            debouncedRefresh(status, e.target.value);
        },
        [debouncedRefresh, status],
    );

    return (
        <>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="col-span-12">
                    <BackupSectionContainer>
                        <div className="!py-4">
                            <div className="flex flex-col gap-3 md:gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex flex-wrap items-center gap-3 md:gap-2">
                                    <Input
                                        className="h-9 w-[100px] sm:w-[200px]"
                                        name="search"
                                        value={query}
                                        onChange={handleSearchChange}
                                    />

                                    <select
                                        name="status"
                                        defaultValue={
                                            status !== null ? status : 'all'
                                        }
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
                                    <Button className={cn('gap-2')} asChild>
                                        <Link href={backup.monitors.create()}>
                                            <Plus className="h-4 w-4" />
                                            Add Monitor
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <MonitorsTable monitors={monitors} />
                    </BackupSectionContainer>
                </div>
            </div>
        </>
    );
};

export default MonitorsListContainer;
