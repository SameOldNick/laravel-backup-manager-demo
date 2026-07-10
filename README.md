# Laravel Backup Manager Demo

A working demonstration of the [Laravel Backup Manager](https://github.com/SameOldNick/laravel-backup-manager) package, built on top of the [Laravel + React Starter Kit](https://github.com/laravel/react-starter-kit). This app showcases real-time backup management with a modern React UI, including scheduled backups, destination management, and live terminal output via WebSockets.

## Demo

<p align="center" width="100%">
<video src="https://github.com/user-attachments/assets/4c3b7457-950b-47c3-b627-41521be53adf" width="80%" autoplay controls></video>
</p>

## Tech Stack

### Backend

| Package                                                                                     | Description                          |
| ------------------------------------------------------------------------------------------- | ------------------------------------ |
| [Laravel Framework](https://laravel.com/)                                                   | PHP web framework (v13)              |
| [Laravel Reverb](https://reverb.laravel.com/)                                               | First-party WebSocket server         |
| [Laravel Fortify](https://laravel.com/docs/fortify)                                         | Authentication backend               |
| [sameoldnick/laravel-backup-manager](https://github.com/SameOldNick/laravel-backup-manager) | Database backup & restore management |

### Frontend

| Package                                                                  | Description                                           |
| ------------------------------------------------------------------------ | ----------------------------------------------------- |
| [React](https://react.dev/)                                              | UI library (via [Inertia.js](https://inertiajs.com/)) |
| [@xterm/xterm](https://www.npmjs.com/package/@xterm/xterm)               | Terminal emulator for live backup output              |
| [@laravel/echo-react](https://www.npmjs.com/package/@laravel/echo-react) | React hooks for Laravel Echo + Reverb                 |
| [cron-parser](https://www.npmjs.com/package/cron-parser)                 | Cron expression parsing for schedule previews         |
| [date-fns](https://www.npmjs.com/package/date-fns)                       | Lightweight date formatting & manipulation            |
| [Tailwind CSS](https://tailwindcss.com/)                                 | Utility-first CSS framework                           |

## Prerequisites

- **PHP** ≥ 8.3
- **Composer** — [install instructions](https://getcomposer.org/download/)
- **Node.js** ≥ 20 and **Yarn** — [install instructions](https://yarnpkg.com/getting-started/install)
- **SQLite** (or another [supported database](https://laravel.com/docs/database))

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/SameOldNick/laravel-backup-manager-demo
cd laravel-backup-manager-demo

# 2. Set up environment
cp .env.example .env
php artisan key:generate

# 3. Install dependencies
composer install
yarn install

# 4. Configure Reverb
php artisan reverb:install

# 5. Run database migrations and seed the test user
php artisan migrate:fresh --seed

# 6. Start the development environment
composer dev
```

Then open [http://127.0.0.1:8000/login](http://127.0.0.1:8000/login) and sign in with:

- **Email:** `test@example.com`
- **Password:** `secret`

## Project Structure

```
app/
├── BackupManager/
│   └── Responders/          # Custom UI responders for backup manager views
├── Http/
│   └── Controllers/         # Application controllers
├── Models/                  # Eloquent models
└── Providers/               # Service providers (App, BackupManager, Fortify)
config/
├── backup-manager.php       # Backup Manager package configuration
└── reverb.php               # WebSocket server configuration
resources/
└── js/
    ├── pages/
    │   └── backup-manager/  # Inertia page components for backup UI
    ├── components/          # Shared React components
    └── hooks/               # Custom React hooks
routes/
├── web.php                  # Web routes
```

## Customization

This demo ships with a custom `BackupManagerServiceProvider` that binds UI responders, allowing you to control how backup manager views are rendered. See `app/Providers/BackupManagerServiceProvider.php` and `config/backup-manager.php` for configuration options.

## License

This demo project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
