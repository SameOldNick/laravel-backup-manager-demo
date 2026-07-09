

export const backupTypes = {
    files: 'Files Backup',
    databases: 'Database Backup',
    full: 'Full Backup',
};

const BACKUP_TYPE_KEYS = ['files', 'databases', 'full'] as const;

export const frequencyValues = [
    'daily',
    'weekly',
    'monthly',
    'custom',
] as const;

export const cronPresets = {
    hourly: {
        label: 'Hourly',
        value: '0 * * * *',
    },
    daily: {
        label: 'Daily',
        value: '0 0 * * *',
    },
    weekly: {
        label: 'Weekly',
        value: '0 0 * * 0',
    },
    monthly: {
        label: 'Monthly',
        value: '0 0 1 * *',
    },
};

