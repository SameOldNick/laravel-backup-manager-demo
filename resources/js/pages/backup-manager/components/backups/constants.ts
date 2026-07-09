import type { BackupStatus } from '../../types';

export type BackupType = 'full' | 'database' | 'files';

export const backupTypeLabels: Record<BackupType, string> = {
    full: 'Full Backup',
    database: 'Database Backup',
    files: 'File Backup',
};

export const backupStatusLabels: Record<BackupStatus, string> = {
    successful: 'Successful',
    failed: 'Failed',
    file_not_found: 'File Not Found',
    deleted: 'Deleted',
};

export interface BackupJob {
    uuid: string;
    type: BackupType;
    status: 'pending' | 'running' | 'completed' | 'failed';
}
