<?php

namespace App\BackupManager\Responders;

use Inertia\Inertia;
use SameOldNick\BackupManager\Contracts\Responders\BackupDestinationsUiResponder as BackupDestinationsUiResponderContract;
use SameOldNick\BackupManager\DataTransferObjects\Responders\BackupDestinations\BackupDestinationsListViewData;
use SameOldNick\BackupManager\DataTransferObjects\Responders\BackupDestinations\DestroyBackupDestinationViewData;
use SameOldNick\BackupManager\DataTransferObjects\Responders\BackupDestinations\EditBackupDestinationViewData;
use SameOldNick\BackupManager\DataTransferObjects\Responders\BackupDestinations\StoreBackupDestinationViewData;
use SameOldNick\BackupManager\DataTransferObjects\Responders\BackupDestinations\UpdateBackupDestinationViewData;

class BackupDestinationsUiResponder implements BackupDestinationsUiResponderContract
{
    /**
     * {@inheritDoc}
     */
    public function renderBackupDestinationsList(BackupDestinationsListViewData $data)
    {
        $request = request();

        return Inertia::render('backup-manager/destinations', [
            'tab' => 'destinations',
            'action' => 'list',
            'destinations' => $data->backupDestinations,
            'filters' => [
                'search' => $request->query('query', ''),
                'status' => $request->query('status', ''),
            ],
        ]);
    }

    /**
     * {@inheritDoc}
     */
    public function renderCreateBackupDestination()
    {
        return Inertia::render('backup-manager/destinations', [
            'tab' => 'destinations',
            'action' => 'create',
        ]);
    }

    /**
     * {@inheritDoc}
     */
    public function renderStoreBackupDestination(StoreBackupDestinationViewData $data)
    {
        return redirect()
            ->route('backup.destinations.show', ['destination' => $data->configuration])
            ->with('success', __('backup-manager::messages.destination_created'));
    }

    /**
     * {@inheritDoc}
     */
    public function renderEditBackupDestination(EditBackupDestinationViewData $data)
    {
        return Inertia::render('backup-manager/destinations', [
            'tab' => 'destinations',
            'action' => 'edit',
            'destination' => $data->configuration,
            'enabled' => $data->configuration->isEnabled($data->backupConfig),
        ]);
    }

    /**
     * {@inheritDoc}
     */
    public function renderUpdateBackupDestination(UpdateBackupDestinationViewData $data)
    {
        return back()
            ->with('success', __('backup-manager::messages.destination_updated'));
    }

    /**
     * {@inheritDoc}
     */
    public function renderDestroyBackupDestination(DestroyBackupDestinationViewData $data)
    {
        return back()
            ->with('success', __('backup-manager::messages.destination_deleted'));
    }
}
