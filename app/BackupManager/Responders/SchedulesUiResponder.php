<?php

namespace App\BackupManager\Responders;

use Inertia\Inertia;
use SameOldNick\BackupManager\Contracts\Responders\SchedulesUiResponder as SchedulesUiResponderContract;
use SameOldNick\BackupManager\DataTransferObjects\Responders\Schedules\SchedulesListViewData;

class SchedulesUiResponder implements SchedulesUiResponderContract
{
    /**
     * {@inheritDoc}
     */
    public function renderSchedulesList(SchedulesListViewData $data)
    {
        return Inertia::render('backup-manager/schedules', [
            'tab' => 'schedule',
            'action' => 'list',
            'backupSchedules' => $data->backupSchedules,
            'cleanupSchedules' => $data->cleanupSchedules,
        ]);
    }
}
