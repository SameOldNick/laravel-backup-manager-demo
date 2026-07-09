import { router, Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import backup from '@/routes/backup';
import type { BackupDestinationsPageListProps } from '../../../../types';
import BackupSectionContainer from '../../../shared/section-container';
import DestinationsTable from './table';

const statusFilters = {
    enabled: 'Enabled',
    disabled: 'Disabled',
    all: 'All',
};

const statusOptions = Object.entries(statusFilters).map(([value, label]) => ({
    value,
    label,
}));

const DestinationsListContainer: React.FC = () => {
    const { destinations } = usePage<BackupDestinationsPageListProps>().props;

    const [status, setStatus] = useState<string | null>(statusOptions[2].value);
    const [search, setSearch] = useState('');

    const debounceRef = useRef<number | null>(null);

    const debouncedRefresh = useCallback(
        (overrides?: { status?: string; search?: string }) => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = window.setTimeout(() => {
                const statusKey = String(status ?? 'all');

                router.get(
                    backup.destinations.index(),
                    {
                        status:
                            (overrides?.status ?? statusKey) !== 'all'
                                ? (overrides?.status ?? statusKey)
                                : undefined,
                        query:
                            (overrides?.search ?? search).length > 0
                                ? (overrides?.search ?? search)
                                : undefined,
                    },
                    {
                        preserveState: true,
                    },
                );
            }, 1000);
        },
        [status, search],
    );

    const handleStatusChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setStatus(e.target.value);

            debouncedRefresh({
                status: e.target.value,
            });
        },
        [debouncedRefresh],
    );

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);

            debouncedRefresh({
                search: e.target.value,
            });
        },
        [debouncedRefresh],
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
                                        value={search}
                                        onChange={handleSearchChange}
                                    />

                                    <select
                                        name="status"
                                        defaultValue={status ?? undefined}
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
                                        <Link
                                            href={backup.destinations.create()}
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Destination
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <DestinationsTable destinations={destinations} />
                    </BackupSectionContainer>
                </div>
            </div>
        </>
    );
};

export default DestinationsListContainer;
