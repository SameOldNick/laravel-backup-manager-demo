import React from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';

import type { BackupType } from '../constants';
import { backupTypeLabels } from '../constants';

interface BackupRunConfirmProps {
    type: BackupType;

    onRun?: () => void;
    onCancel?: () => void;
}

const BackupRunConfirm: React.FC<BackupRunConfirmProps> = ({
    type,
    onRun,
    onCancel,
}) => {
    return (
        <>
            <Dialog
                open={true}
                onOpenChange={(open) => {
                    if (!open) {
                        onCancel?.();
                    }
                }}
            >
                <DialogContent>
                    <DialogTitle className="text-lg font-semibold">
                        Confirm Backup Run
                    </DialogTitle>
                    <DialogDescription className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure you want to run a {backupTypeLabels[type]}?
                        This action may take a while to complete.
                    </DialogDescription>

                    <div className="mt-6 flex justify-end gap-3">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                onClick={() => onCancel?.()}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                onClick={() => {
                                    onRun?.();
                                }}
                            >
                                Run Backup
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BackupRunConfirm;
