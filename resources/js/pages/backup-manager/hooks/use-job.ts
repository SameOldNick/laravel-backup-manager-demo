import { useEcho } from '@laravel/echo-react';
import { useCallback, useState } from 'react';

export type JobStatus = 'pending' | 'started' | 'completed' | 'failed';

export interface JobStatusNotification {
    date_time: string;
    status: JobStatus;
    extra?: {
        exception?: string;
    };
}

export interface UseJobOptions {
    channel: string;
}

const useJob = ({ channel }: UseJobOptions) => {
    const [jobStatus, setJobStatus] = useState<JobStatus>('pending');

    const [jobStartedAt, setJobStartedAt] = useState<Date | null>(null);
    const [jobFinishedAt, setJobFinishedAt] = useState<Date | null>(null);
    const [jobLiveStartedAt, setJobLiveStartedAt] = useState<Date | null>(null);
    const [jobException, setJobException] = useState<string | null>(null);

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

    const jobStatusSubscription = useEcho(
        channel,
        '.job-status',
        (e: JobStatusNotification) => {
            setJobStatus(e.status);

            if (e.status === 'started') {
                setJobStartedAt(parseEventTime(e.date_time) ?? new Date());
                setJobLiveStartedAt(normalizeLiveStartTime(e.date_time));
                setJobFinishedAt(null);

                return;
            }

            if (e.status === 'failed' || e.status === 'completed') {
                const eventDate = parseEventTime(e.date_time);

                if (e.status === 'failed' && e.extra?.exception) {
                    setJobException(e.extra.exception);
                }

                if (eventDate === null) {
                    return;
                }

                setJobFinishedAt(eventDate);
            }
        },
    );

    const unsubscribe = useCallback(() => {
        jobStatusSubscription.leave();
    }, [jobStatusSubscription]);

    return {
        jobStatus,
        jobStartedAt,
        jobFinishedAt,
        jobException,
        jobLiveStartedAt,
        unsubscribe,
    } as const;
};

export default useJob;
