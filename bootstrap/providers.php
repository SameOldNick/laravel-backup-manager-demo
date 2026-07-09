<?php

use App\Providers\AppServiceProvider;
use App\Providers\BackupManagerServiceProvider;
use App\Providers\FortifyServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    BackupManagerServiceProvider::class,
];
