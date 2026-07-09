import React from 'react';

import { cn } from '@/lib/utils';

type BackupTableContainerProps = React.HTMLAttributes<HTMLDivElement>;

const BackupTableContainer: React.FC<BackupTableContainerProps> = ({
    children,
    className,
    ...props
}) => {
    return (
        <div
            className={cn(
                'overflow-hidden bg-white dark:bg-slate-900',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default BackupTableContainer;
