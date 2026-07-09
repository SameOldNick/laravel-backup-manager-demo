import { HardDrive } from 'lucide-react';
import React, { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import type { BackupType } from '../constants';
import { backupTypeLabels } from '../constants';
import BackupRunTerminal from './terminal';

interface BackupRunModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    uuid: string;
    type: BackupType;
    startUrl: string;
}

const BackupRunModal: React.FC<BackupRunModalProps> = ({
    isOpen,
    onOpenChange,
    uuid,
    type,
    startUrl,
}) => {
    const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);

    const handleRequestClose = useCallback(() => {
        setIsCloseConfirmOpen(true);
    }, []);

    const handleConfirmClose = useCallback(() => {
        setIsCloseConfirmOpen(false);
        onOpenChange(false);
    }, [onOpenChange]);

    const handleCancelClose = useCallback(() => {
        setIsCloseConfirmOpen(false);
    }, []);

    const handleRunModalOpenChange = useCallback(
        (open: boolean) => {
            if (open) {
                onOpenChange(true);

                return;
            }

            handleRequestClose();
        },
        [handleRequestClose, onOpenChange],
    );

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleRunModalOpenChange}>
                <DialogContent
                    className="sm:max-w-4xl"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <div className="flex items-start gap-3.5">
                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100/80 dark:bg-indigo-950/60 dark:ring-indigo-900/60">
                                <HardDrive className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <DialogTitle className="text-base font-semibold tracking-tight">
                                    {backupTypeLabels[type]}
                                </DialogTitle>
                                <DialogDescription className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                    Running a backup may take a while. Monitor
                                    progress in real-time through the terminal
                                    below.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <BackupRunTerminal
                        uuid={uuid}
                        type={type}
                        startUrl={startUrl}
                    />

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleRequestClose}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isCloseConfirmOpen}
                onOpenChange={setIsCloseConfirmOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Close Backup Terminal?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to close this modal? You can
                            reopen it later, but you may miss live terminal
                            output while it is closed.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancelClose}>
                            Keep Open
                        </Button>
                        <DialogClose
                            className="cursor-pointer"
                            onClick={handleConfirmClose}
                        >
                            Close Modal
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BackupRunModal;
