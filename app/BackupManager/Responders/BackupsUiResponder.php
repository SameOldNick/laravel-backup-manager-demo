<?php

namespace App\BackupManager\Responders;

use Inertia\Inertia;
use SameOldNick\BackupManager\Contracts\Responders\BackupsUiResponder as BackupsUiResponderContract;
use SameOldNick\BackupManager\DataTransferObjects\Responders\Backups\BackupsListViewData;

class BackupsUiResponder implements BackupsUiResponderContract
{
    /**
     * {@inheritDoc}
     */
    public function renderBackupsList(BackupsListViewData $data)
    {
        $request = request();

        return Inertia::render('backup-manager/backups', [
            'tab' => 'backups',
            'action' => 'list',
            'backups' => $data->backups,
            'filters' => $request->only(['query', 'status']),
        ]);
    }
}
