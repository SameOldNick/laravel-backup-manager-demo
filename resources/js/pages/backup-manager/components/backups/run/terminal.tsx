import { useHttp } from '@inertiajs/react';
import { format, intervalToDuration } from 'date-fns';
import { CheckCircle2, Clock, HardDrive, XCircle } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import useJob from '../../../hooks/use-job';
import useProcess from '../../../hooks/use-process';
import useXterm from '../../../hooks/use-xterm';
import type { BackupType } from '../constants';

import '@xterm/xterm/css/xterm.css';

interface BackupRunTerminalProps {
    uuid: string;
    type: BackupType;
    startUrl: string;
}

const formatDuration = (milliseconds: number): string => {
    const dur = intervalToDuration({
        start: 0,
        end: Math.max(0, milliseconds),
    });
    const h = dur.hours ?? 0;
    const m = dur.minutes ?? 0;
    const s = dur.seconds ?? 0;

    if (h > 0) {
        return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
    }

    if (m > 0) {
        return `${m}m ${String(s).padStart(2, '0')}s`;
    }

    return `${s}s`;
};

const BackupRunTerminal: React.FC<BackupRunTerminalProps> = ({
    uuid,
    type,
    startUrl,
}) => {
    const outputRef = React.useRef<HTMLDivElement | null>(null);
    const [now, setNow] = useState(() => new Date());
    const [startError, setStartError] = useState<string>();

    const hasStarted = useRef(false);

    const { post, processing } = useHttp();

    const { getTerminal, initializeTerminal, disposeTerminal } = useXterm({
        containerRef: outputRef,
    });

    const {
        jobStatus,
        jobStartedAt,
        jobFinishedAt,
        jobLiveStartedAt,
        unsubscribe: jobUnsubscribe,
    } = useJob({ channel: `backups.${uuid}` });

    const {
        processStatus,
        processStartedAt,
        processFinishedAt,
        processLiveStartedAt,
        unsubscribe: processUnsubscribe,
    } = useProcess({
        channel: `backups.${uuid}`,
        onProcessOutput: (nextOutput, newline) => {
            const terminal = getTerminal();

            if (!terminal) {
                console.warn(
                    'Terminal instance is not available to write output.',
                );

                return;
            }

            nextOutput
                .split(/\n/)
                .map((line) => line.replaceAll('\r', ''))
                .forEach((line, i, lines) => {
                    if (i !== lines.length - 1) {
                        terminal.writeln(line);
                    } else {
                        if (newline) {
                            terminal.writeln(line);
                        } else {
                            terminal.write(line);
                        }
                    }
                });
        },
    });

    useEffect(() => {
        initializeTerminal();

        return () => {
            jobUnsubscribe();
            processUnsubscribe();
            disposeTerminal();
        };
    }, [
        disposeTerminal,
        initializeTerminal,
        jobUnsubscribe,
        processUnsubscribe,
    ]);

    useEffect(() => {
        if (hasStarted.current) {
            return;
        }

        hasStarted.current = true;

        post(startUrl, {
            onError: (errors) => {
                setStartError(
                    errors?.message ||
                        'An error occurred while starting the backup.',
                );
            },
        });
    }, [post, startUrl]);

    const statusMessage = useMemo(() => {
        if (processing) {
            return 'Starting backup…';
        }

        if (startError) {
            return `Error: ${startError}`;
        }

        if (jobStatus === 'pending') {
            return 'Waiting for backup to start…';
        }

        if (jobStatus === 'started' && processStatus === 'idle') {
            return 'Backup started. Waiting for process to begin…';
        }

        if (jobStatus === 'started' && processStatus === 'begin') {
            return 'Process running — streaming output to terminal';
        }

        if (processStatus === 'complete') {
            return 'Process completed.';
        }

        if (jobStatus === 'failed') {
            return 'Backup failed.';
        }

        if (jobStatus === 'completed') {
            return 'Backup completed successfully.';
        }

        return 'Unknown status.';
    }, [jobStatus, processStatus, processing, startError]);

    useEffect(() => {
        if (jobStatus !== 'started' && processStatus !== 'begin') {
            return;
        }

        const timer = window.setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, [jobStatus, processStatus]);

    const jobDuration = useMemo(() => {
        const activeStartAt = jobLiveStartedAt ?? jobStartedAt;

        if (!jobStartedAt && !activeStartAt) {
            return null;
        }

        if (jobStatus === 'started' && activeStartAt) {
            return formatDuration(now.getTime() - activeStartAt.getTime());
        }

        if (jobFinishedAt && jobStartedAt) {
            return formatDuration(
                jobFinishedAt.getTime() - jobStartedAt.getTime(),
            );
        }

        return null;
    }, [jobFinishedAt, jobLiveStartedAt, jobStartedAt, jobStatus, now]);

    const processDuration = useMemo(() => {
        const activeStartAt = processLiveStartedAt ?? processStartedAt;

        if (!processStartedAt && !activeStartAt) {
            return null;
        }

        if (processStatus === 'begin' && activeStartAt) {
            return formatDuration(now.getTime() - activeStartAt.getTime());
        }

        if (processFinishedAt && processStartedAt) {
            return formatDuration(
                processFinishedAt.getTime() - processStartedAt.getTime(),
            );
        }

        return null;
    }, [
        now,
        processFinishedAt,
        processLiveStartedAt,
        processStartedAt,
        processStatus,
    ]);

    const jobFinishedAtFormatted = useMemo(() => {
        if (!jobFinishedAt) {
            return null;
        }

        return format(jobFinishedAt, 'HH:mm:ss');
    }, [jobFinishedAt]);

    const processFinishedAtFormatted = useMemo(() => {
        if (!processFinishedAt) {
            return null;
        }

        return format(processFinishedAt, 'HH:mm:ss');
    }, [processFinishedAt]);

    const hasTimingData = useMemo(
        () =>
            jobStartedAt !== null ||
            processStartedAt !== null ||
            jobFinishedAt !== null ||
            processFinishedAt !== null,
        [jobFinishedAt, jobStartedAt, processFinishedAt, processStartedAt],
    );

    const isRunning = useMemo(
        () => jobStatus === 'started' && processStatus === 'begin',
        [jobStatus, processStatus],
    );
    const isCompleted = useMemo(() => jobStatus === 'completed', [jobStatus]);
    const isFailed = useMemo(() => jobStatus === 'failed', [jobStatus]);

    return (
        <div className="space-y-3">
            {/* Status pill */}
            <div
                className={cn(
                    'flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm transition-colors',
                    !isRunning &&
                        !isCompleted &&
                        !isFailed &&
                        'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400',
                    isRunning &&
                        'border-sky-200/60 bg-sky-50 text-sky-700 dark:border-sky-800/50 dark:bg-sky-950/30 dark:text-sky-300',
                    isCompleted &&
                        'border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-300',
                    isFailed &&
                        'border-red-200/60 bg-red-50 text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-300',
                )}
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

                <span className="font-medium">{statusMessage}</span>

                {isRunning && jobDuration && (
                    <span className="ml-auto font-mono text-xs text-sky-600/70 tabular-nums dark:text-sky-400/60">
                        {jobDuration}
                    </span>
                )}
            </div>

            {/* Terminal window */}
            <div className="overflow-hidden rounded-xl border border-zinc-700/50 shadow-[0_20px_50px_-15px_rgba(2,6,23,0.45)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]">
                {/* Chrome top bar */}
                <div className="flex items-center gap-3 border-b border-zinc-700/50 bg-zinc-800 px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-rose-400/70" />
                        <span className="h-3 w-3 rounded-full bg-amber-400/70" />
                        <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
                    </div>

                    <p className="min-w-0 flex-1 truncate text-center font-mono text-xs tracking-wide text-zinc-400">
                        {type}::{uuid}
                    </p>

                    {!isRunning && !isCompleted && !isFailed && (
                        <div className="flex items-center gap-1.5">
                            <HardDrive className="h-3 w-3 text-zinc-500" />
                            <span className="text-[10px] font-medium tracking-widest text-zinc-500 uppercase">
                                Idle
                            </span>
                        </div>
                    )}
                    {isRunning && (
                        <div className="flex items-center gap-1.5 rounded bg-sky-500/10 px-2 py-0.5">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
                            <span className="text-[10px] font-bold tracking-widest text-sky-400 uppercase">
                                Live
                            </span>
                        </div>
                    )}
                    {isCompleted && (
                        <div className="flex items-center gap-1.5 rounded bg-emerald-500/10 px-2 py-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Done
                            </span>
                        </div>
                    )}
                    {isFailed && (
                        <div className="flex items-center gap-1.5 rounded bg-red-500/10 px-2 py-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            <span className="text-[10px] font-bold tracking-widest text-red-400 uppercase">
                                Failed
                            </span>
                        </div>
                    )}
                </div>

                {/* Terminal body — xterm mounts here */}
                <div ref={outputRef} className="min-h-72 bg-zinc-950" />

                {/* Status bar */}
                {hasTimingData && (
                    <div className="grid gap-1.5 border-t border-zinc-700/50 bg-zinc-800 px-4 py-2 sm:grid-cols-2 sm:gap-3">
                        <div className="rounded bg-zinc-900/70 px-2.5 py-1.5">
                            <div className="mb-1 flex items-center gap-1.5">
                                <Clock className="h-3 w-3 text-zinc-500" />
                                <span className="text-[10px] font-semibold tracking-wide text-zinc-400 uppercase">
                                    Job
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] text-zinc-400">
                                    Duration
                                </span>
                                <span className="font-mono text-[11px] font-semibold text-zinc-200 tabular-nums">
                                    {jobDuration ?? '--'}
                                </span>
                            </div>
                            <div className="mt-0.5 flex items-center justify-between gap-2">
                                <span className="text-[11px] text-zinc-400">
                                    Finished at
                                </span>
                                <span className="font-mono text-[11px] font-semibold text-zinc-200">
                                    {jobFinishedAtFormatted ?? '--'}
                                </span>
                            </div>
                        </div>

                        <div className="rounded bg-zinc-900/70 px-2.5 py-1.5">
                            <div className="mb-1 flex items-center gap-1.5">
                                <Clock className="h-3 w-3 text-zinc-500" />
                                <span className="text-[10px] font-semibold tracking-wide text-zinc-400 uppercase">
                                    Process
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] text-zinc-400">
                                    Duration
                                </span>
                                <span className="font-mono text-[11px] font-semibold text-zinc-200 tabular-nums">
                                    {processDuration ?? '--'}
                                </span>
                            </div>
                            <div className="mt-0.5 flex items-center justify-between gap-2">
                                <span className="text-[11px] text-zinc-400">
                                    Finished at
                                </span>
                                <span className="font-mono text-[11px] font-semibold text-zinc-200">
                                    {processFinishedAtFormatted ?? '--'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BackupRunTerminal;
