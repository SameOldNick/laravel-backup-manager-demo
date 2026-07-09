import { useEcho } from '@laravel/echo-react';
import { useCallback, useState } from 'react';

export interface ProcessStatusNotification {
    date_time: string;
    status: 'begin' | 'complete';
}

export interface ProcessOutputNotification {
    date_time: string;
    message: string;
    newline: boolean;
}

export interface UseProcessOptions {
    channel: string;
    onProcessOutput?: (output: string, newline: boolean) => void;
}

const useProcess = ({ channel, onProcessOutput }: UseProcessOptions) => {
    const [processStatus, setProcessStatus] = useState<
        'idle' | 'begin' | 'complete'
    >('idle');

    const [processStartedAt, setProcessStartedAt] = useState<Date | null>(null);
    const [processFinishedAt, setProcessFinishedAt] = useState<Date | null>(
        null,
    );
    const [processLiveStartedAt, setProcessLiveStartedAt] =
        useState<Date | null>(null);

    const normalizeLiveStartTime = useCallback((timestamp: string): Date => {
        const receivedAt = new Date();
        const parsed = new Date(timestamp);

        if (Number.isNaN(parsed.getTime())) {
            return receivedAt;
        }

        // For running timers, avoid jumping forward when websocket events arrive late.
        return parsed.getTime() > receivedAt.getTime() ? parsed : receivedAt;
    }, []);

    const parseEventTime = useCallback((timestamp: string): Date | null => {
        const parsed = new Date(timestamp);

        if (Number.isNaN(parsed.getTime())) {
            return null;
        }

        return parsed;
    }, []);

    const processStatusSubscription = useEcho(
        channel,
        '.process-status',
        (e: ProcessStatusNotification) => {
            setProcessStatus(e.status);

            if (e.status === 'begin') {
                setProcessStartedAt(parseEventTime(e.date_time) ?? new Date());
                setProcessLiveStartedAt(normalizeLiveStartTime(e.date_time));
                setProcessFinishedAt(null);

                return;
            }

            if (e.status === 'complete') {
                const eventDate = parseEventTime(e.date_time);

                if (eventDate === null) {
                    return;
                }

                setProcessFinishedAt(eventDate);
            }
        },
    );

    const processOutputSubscription = useEcho(
        channel,
        '.process-output',
        (e: ProcessOutputNotification) => {
            onProcessOutput?.(e.message, e.newline);
        },
    );

    const unsubscribe = useCallback(() => {
        processStatusSubscription.leave();
        processOutputSubscription.leave();
    }, [processStatusSubscription, processOutputSubscription]);

    return {
        processStatus,
        processStartedAt,
        processFinishedAt,
        processLiveStartedAt,
        unsubscribe,
    } as const;
};

export default useProcess;
