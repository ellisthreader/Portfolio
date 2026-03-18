# Laravel 12 + Inertia React/TS Starter

This project is configured with:
- Laravel 12 (PHP 8.2+, PHP 8.3 runtime recommended)
- Inertia.js + React 18.3 + TypeScript + Vite
- Tailwind CSS + forms + typography plugins
- Fortify + Sanctum + Socialite
- Ziggy route generation in React
- SQLite local default + MySQL 8 Docker option
- Redis + Meilisearch Docker services
- Database-backed sessions, cache, and queues
- Pusher/Laravel Echo-ready setup

## First setup

```bash
./setup.sh
cp .env.example .env
php artisan key:generate
php artisan migrate
```

## Run locally (localhost)

```bash
npm run dev:full
```

This starts:
- Laravel on `http://localhost:8000`
- Vite on `http://localhost:5173`

If port `8000` is already in use, stop the old `php artisan serve` process first.

## Manual two-terminal run

Terminal 1:
```bash
php artisan serve --host=localhost --port=8000
```

Terminal 2:
```bash
npm run dev -- --host localhost --port 5173
```

## Docker services included

- `app` (PHP 8.3 + Node 20)
- `mysql` (`mysql:8.0`)
- `redis` (`redis:alpine`)
- `meilisearch` (`getmeili/meilisearch`)

## Key project files

- `setup.sh`
- `.env.example`
- `docker-compose.yml`
- `Dockerfile`
- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `tsconfig.json`
- `jsconfig.json`
