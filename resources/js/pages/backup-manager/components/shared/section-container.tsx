import React from 'react';

import { cn } from '@/lib/utils';

interface BackupSectionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    headerActions?: React.ReactNode;
}

const BackupSectionContainer: React.FC<BackupSectionContainerProps> = ({
    title,
    description,
    children,
    className,
    headerActions,
    ...props
}) => {
    return (
        <div
            className={cn('m-4 grid grid-cols-1 xl:grid-cols-12', className)}
            {...props}
        >
            <div className="col-span-12">
                {(title || description || headerActions) && (
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                        {(title || description) && (
                            <div>
                                {title && (
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                        {title}
                                    </h2>
                                )}
                                {description && (
                                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}
                        {headerActions && <div>{headerActions}</div>}
                    </div>
                )}

                {children}
            </div>
        </div>
    );
};

export default BackupSectionContainer;
