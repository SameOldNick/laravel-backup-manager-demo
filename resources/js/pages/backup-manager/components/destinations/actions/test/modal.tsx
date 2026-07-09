import { useHttp } from '@inertiajs/react';
import { format, intervalToDuration } from 'date-fns';
import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    Plug,
    XCircle,
} from 'lucide-react';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

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

import useJob from '../../../../hooks/use-job';
import type { BackupDestination } from '../../../../types';

interface TestConnectionModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    uuid: string;
    startUrl: string;
    destination: BackupDestination;
}

const formatDuration = (milliseconds: number): string => {
    const duration = intervalToDuration({
        start: 0,
        end: Math.max(0, milliseconds),
    });

    const hours = duration.hours ?? 0;
    const minutes = duration.minutes ?? 0;
    const seconds = duration.seconds ?? 0;

    if (hours > 0) {
        return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    }

    if (minutes > 0) {
        return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
    }

    return `${seconds}s`;
};

const TestConnectionModal: React.FC<TestConnectionModalProps> = ({
    isOpen,
    onOpenChange,
    uuid,
    startUrl,
    destination,
}) => {
    const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
    const [now, setNow] = useState<Date>(() => new Date());
    const [startError, setStartError] = useState<string>();

    const hasStarted = useRef(false);

    const {
        jobStatus,
        jobStartedAt,
        jobFinishedAt,
        jobException,
        unsubscribe: jobUnsubscribe,
    } = useJob({ channel: `test-destination.${uuid}` });

    const { post, processing } = useHttp({ uuid });

    useEffect(() => {
        return () => {
            jobUnsubscribe();
        };
    }, [jobUnsubscribe]);

    useEffect(() => {
        if (jobStatus !== 'started') {
            return;
        }

        const timer = window.setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, [jobStatus]);

    useEffect(() => {
        if (hasStarted.current || !isOpen) {
            return;
        }

        hasStarted.current = true;

        post(startUrl, {
            onError: (errors) => {
                setStartError(
                    errors?.message ||
                        'An error occurred while starting the connection test.',
                );
            },
        });
    }, [post, startUrl, isOpen]);

    const isRunning = useMemo(() => jobStatus === 'started', [jobStatus]);
    const isCompleted = useMemo(() => jobStatus === 'completed', [jobStatus]);
    const isFailed = useMemo(() => jobStatus === 'failed', [jobStatus]);

    const statusLabel = useMemo(() => {
        if (processing) {
            return 'Starting connection test...';
        }

        if (startError) {
            return startError;
        }

        if (isCompleted) {
            return 'Connection verified successfully.';
        }

        if (isFailed) {
            return 'Connection test failed.';
        }

        if (isRunning) {
            return 'Testing destination connection now...';
        }

        return 'Waiting for connection test to start...';
    }, [processing, startError, isCompleted, isFailed, isRunning]);

    const elapsed = useMemo(() => {
        if (jobStartedAt === null) {
            return '--';
        }

        if (jobFinishedAt) {
            return formatDuration(
                jobFinishedAt.getTime() - jobStartedAt.getTime(),
            );
        }

        if (isRunning) {
            return formatDuration(now.getTime() - jobStartedAt.getTime());
        }

        return '--';
    }, [jobFinishedAt, isRunning, now, jobStartedAt]);

    const startedAtLabel = useMemo(() => {
        if (!jobStartedAt) {
            return '--';
        }

        return format(jobStartedAt, 'PPp');
    }, [jobStartedAt]);

    const finishedAtLabel = useMemo(() => {
        if (!jobFinishedAt) {
            return '--';
        }

        return format(jobFinishedAt, 'PPp');
    }, [jobFinishedAt]);

    const handleRequestClose = useCallback(() => {
        if (jobStatus === 'completed' || jobStatus === 'failed') {
            onOpenChange(false);

            return;
        }

        setIsCloseConfirmOpen(true);
    }, [onOpenChange, jobStatus]);

    const handleConfirmClose = useCallback(() => {
        setIsCloseConfirmOpen(false);
        onOpenChange(false);
    }, [onOpenChange]);

    const handleCancelClose = useCallback(() => {
        setIsCloseConfirmOpen(false);
    }, []);

    const handleTestConnectionModalOpenChange = useCallback(
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
            <Dialog
                open={isOpen}
                onOpenChange={handleTestConnectionModalOpenChange}
            >
                <DialogContent
                    className="sm:max-w-4xl"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <div className="flex items-start gap-3.5">
                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100/80 dark:bg-indigo-950/60 dark:ring-indigo-900/60">
                                <Plug className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <DialogTitle className="text-base font-semibold tracking-tight">
                                    Testing Connection to{' '}
                                    {destination.name || destination.type}
                                </DialogTitle>
                                <DialogDescription className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                    Live status updates will appear as soon as
                                    the test job starts and when it finishes.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div
                            className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${
                                isRunning
                                    ? 'border-sky-200/60 bg-sky-50 text-sky-700 dark:border-sky-800/50 dark:bg-sky-950/30 dark:text-sky-300'
                                    : isCompleted
                                      ? 'border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-300'
                                      : isFailed
                                        ? 'border-red-200/60 bg-red-50 text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-300'
                                        : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400'
                            }`}
                        >
                            {!isRunning && !isCompleted && !isFailed && (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-slate-400/80" />
                            )}
                            {isRunning && (
                                <span className="relative flex h-2.5 w-2.5 shrink-0">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
                                </span>
                            )}
                            {isCompleted && (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                            )}
                            {isFailed && (
                                <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                            )}

                            <span className="font-medium">{statusLabel}</span>

                            {isRunning && (
                                <span className="ml-auto font-mono text-xs text-sky-700/70 tabular-nums dark:text-sky-300/70">
                                    {elapsed}
                                </span>
                            )}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/50">
                                <p className="mb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                    Destination
                                </p>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                    {destination.name}
                                </p>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    {destination.type.toUpperCase()} -{' '}
                                    {destination.host}:{destination.port}
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/50">
                                <p className="mb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                    Session
                                </p>
                                <p className="font-mono text-xs text-slate-700 dark:text-slate-200">
                                    test-destination.{uuid}
                                </p>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    {destination.root || '/'}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-2 rounded-xl border border-zinc-700/50 bg-zinc-900 px-4 py-3 text-zinc-200 sm:grid-cols-3">
                            <div className="rounded bg-zinc-800/80 px-2.5 py-2">
                                <p className="text-[10px] font-semibold tracking-wide text-zinc-400 uppercase">
                                    Started At
                                </p>
                                <p className="mt-1 font-mono text-[11px]">
                                    {startedAtLabel}
                                </p>
                            </div>
                            <div className="rounded bg-zinc-800/80 px-2.5 py-2">
                                <p className="text-[10px] font-semibold tracking-wide text-zinc-400 uppercase">
                                    Finished At
                                </p>
                                <p className="mt-1 font-mono text-[11px]">
                                    {finishedAtLabel}
                                </p>
                            </div>
                            <div className="rounded bg-zinc-800/80 px-2.5 py-2">
                                <p className="text-[10px] font-semibold tracking-wide text-zinc-400 uppercase">
                                    Duration
                                </p>
                                <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px]">
                                    <Clock3 className="h-3 w-3 text-zinc-400" />
                                    {elapsed}
                                </p>
                            </div>
                        </div>

                        {isFailed && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-red-700 dark:border-red-800/60 dark:bg-red-950/30 dark:text-red-300">
                                <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                                    <AlertTriangle className="h-4 w-4" />
                                    Failure Reason
                                </div>
                                <p className="text-sm break-words">
                                    {jobException ??
                                        'An unknown error occurred during the connection test.'}
                                </p>
                            </div>
                        )}
                    </div>

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
                        <DialogTitle>Close Connection Test?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to close this modal? You can
                            reopen it later, but you may miss live status
                            updates while it is closed.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={handleCancelClose}
                        >
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

export default TestConnectionModal;
