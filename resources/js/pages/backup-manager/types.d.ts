import type { BackupType } from './components/backups/constants';

export type TabValue = 'backups' | 'destinations' | 'schedule';

export type BackupManagerPageProps = {
    tab: TabValue;
};

export type Filters = {
    status: string;
    search: string;
};

export type BackupBackupsPageProps =
    | BackupBackupsPageListProps
    | BackupBackupsPagePerformBackupProps
    | BackupBackupsPageShowProps;

export type BackupBackupsPageListProps = {
    action: 'list';
    backups: Backup[];
    filters: Filters;
};

export type BackupBackupsPagePerformBackupProps = {
    action: 'list';
    backups: undefined;
    performing_backup: PerformingBackup;
};

export interface PerformingBackup {
    uuid: string;
    type: BackupType;
    start_url: string;
}

export type BackupBackupsPageShowProps = {
    action: 'show';
    backup: Backup;
};

export type BackupDestinationsPageProps =
    | BackupDestinationsPageListProps
    | BackupDestinationsPageCreateProps
    | BackupDestinationsPageEditProps;

export type BackupDestinationsPageListProps = {
    destinations: BackupDestination[];
    action: 'list';
    filters: Filters;
};

export type BackupDestinationsPageCreateProps = {
    action: 'create';
};

export type BackupDestinationsPageEditProps = {
    action: 'edit';
    destination: BackupDestination;
    enabled: boolean;
    test?: {
        uuid: string;
        start_url: string;
    };
};

export type BackupMonitorsPageProps =
    | BackupMonitorsPageListProps
    | BackupMonitorsPageCreateProps
    | BackupMonitorsPageEditProps;

export type BackupMonitorsPageListProps = {
    monitors: BackupMonitor[];
    action: 'list';
    filters: {
        active: boolean | null;
        query: string;
    };
};

export type BackupMonitorsPageCreateProps = {
    action: 'create';
    destinations: BackupDestination[];
};

export type BackupMonitorsPageEditProps = {
    action: 'edit';
    monitor: BackupMonitor;
    destinations: BackupDestination[];
};

export type BackupSchedulesPageProps =
    | BackupSchedulesPageListProps
    | BackupSchedulesPageCreateProps
    | CleanupSchedulesPageCreateProps
    | BackupSchedulesPageEditProps
    | CleanupSchedulesPageEditProps;

export type BackupSchedulesPageListProps = {
    backupSchedules: BackupSchedule[];
    cleanupSchedules: CleanupSchedule[];
    action: 'list';
};

export type BackupSchedulesPageCreateProps = {
    action: 'create:backup';
    destinations: BackupDestination[];
};

export type CleanupSchedulesPageCreateProps = {
    action: 'create:cleanup';
};

export type BackupSchedulesPageEditProps = {
    action: 'edit:backup';
    schedule: BackupSchedule;
    destinations: BackupDestination[];
};

export type CleanupSchedulesPageEditProps = {
    action: 'edit:cleanup';
    schedule: CleanupSchedule;
};

export interface FileMeta {
    size: number;
    last_modified: string;
    mime_type: string;
}

export interface File {
    id: string;
    name: string;
    meta: FileMeta;
    file_exists: boolean;
    created_at: string;
    updated_at: string | null;
}

export type BackupStatus =
    'successful' | 'failed' | 'file_not_found' | 'deleted';

export interface Backup {
    uuid: string;
    status: BackupStatus;
    error_message?: string;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    file: File | null;
}

export interface BackupDestination {
    id: number;
    is_active: boolean;
    name: string;
    type: 'local' | 'ftp' | 'sftp';
    root?: string;
    host?: string;
    port?: number;
    auth_type: 'password' | 'key';
    username?: string;
}

export interface BackupMonitor {
    id: number;
    is_active: boolean;
    name: string;
    filesystem_configurations?: BackupDestination[];
    maximum_age_in_days?: number;
    maximum_storage_in_megabytes?: number;
}

export interface ScheduleShared {
    id: number;
    name: string;
    cron_expression: string;
    next_run: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string | null;
}

export interface BackupSchedule extends ScheduleShared {
    type: 'files' | 'databases' | 'full';
    destination_ids?: number[];
    filesystem_configurations?: BackupDestination[];
}

export type CleanupSchedule = ScheduleShared;
