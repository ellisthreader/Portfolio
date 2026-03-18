#!/usr/bin/env bash
set -euo pipefail

# Laravel 12 + Inertia React/TS full-stack scaffold

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

require_cmd php
require_cmd composer
require_cmd node
require_cmd npm

if [ ! -f artisan ]; then
  # `composer create-project` refuses non-empty directories.
  # Bootstrap in a temp dir, then copy into cwd.
  unexpected_files="$(find . -mindepth 1 -maxdepth 1 \
    ! -name '.git' \
    ! -name 'setup.sh' \
    ! -name 'README.md' \
    -print -quit)"

  if [ -n "$unexpected_files" ]; then
    echo "Directory contains existing files. Start from an empty directory or remove custom files first."
    exit 1
  fi

  tmp_laravel_dir="$(mktemp -d)"
  composer create-project laravel/laravel "$tmp_laravel_dir" "^12.0"
  cp -a "$tmp_laravel_dir"/. .
  rm -rf "$tmp_laravel_dir"
fi

composer require \
  laravel/fortify \
  laravel/sanctum \
  laravel/socialite \
  inertiajs/inertia-laravel \
  tightenco/ziggy \
  predis/predis \
  pusher/pusher-php-server \
  meilisearch/meilisearch-php \
  openai-php/client

npm install
# Pin plugin-react to v5 for Vite 7 compatibility used by Laravel 12.x
npm remove @tailwindcss/vite || true
npm install react@18.3 react-dom@18.3 @inertiajs/react @vitejs/plugin-react@^5.1.0 typescript @types/react@^18 @types/react-dom@^18 tailwindcss@^3.4.17 @tailwindcss/forms @tailwindcss/typography autoprefixer postcss laravel-vite-plugin ziggy-js laravel-echo pusher-js three@0.167.1 @react-three/fiber@^8.18.0 @react-three/drei@^9.122.0

npm pkg set scripts.dev="vite"
npm pkg set scripts.build="tsc --noEmit && vite build"
npm pkg set scripts.typecheck="tsc --noEmit"
npm pkg set scripts.preview="vite preview"
npm pkg set scripts.serve="php artisan serve --host=localhost --port=8000"
npm pkg set 'scripts.dev:full'="concurrently -n laravel,vite -c blue,green \"npm run serve\" \"npm run dev -- --host localhost --port 5173\""

mkdir -p resources/js/{Pages,Layouts,Components,Pages/Auth}
mkdir -p resources/views app/Http/Middleware app/Providers database

cat > resources/views/app.blade.php <<'BLADE'
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
  </head>
  <body class="font-sans antialiased">
    @inertia
  </body>
</html>
BLADE

cat > resources/css/app.css <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;
CSS

cat > resources/js/app.tsx <<'TS'
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
  progress: { color: '#0f172a' },
});
TS

cat > resources/js/echo.ts <<'TS'
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  wsHost: import.meta.env.VITE_PUSHER_HOST ?? window.location.hostname,
  wsPort: Number(import.meta.env.VITE_PUSHER_PORT ?? 80),
  wssPort: Number(import.meta.env.VITE_PUSHER_PORT ?? 443),
  forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],
});
TS

cat > resources/js/types.d.ts <<'TS'
export {};

declare global {
  interface Window {
    Echo: any;
    Pusher: any;
  }
}
TS

cat > resources/js/Pages/Home.tsx <<'TS'
import { Head, Link } from '@inertiajs/react';

export default function Home() {
  return (
    <>
      <Head title="Home" />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight">Laravel 12 + Inertia React</h1>
        <p className="mt-4 text-slate-600">
          Starter stack with Fortify, Sanctum, Socialite, Redis, Meilisearch, and Ziggy.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/login" className="rounded bg-slate-900 px-4 py-2 text-white">Login</Link>
          <Link href="/register" className="rounded border border-slate-300 px-4 py-2">Register</Link>
        </div>
      </main>
    </>
  );
}
TS

cat > resources/js/Pages/Auth/Login.tsx <<'TS'
import { Head } from '@inertiajs/react';

export default function Login() {
  return (
    <>
      <Head title="Login" />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-slate-600">Fortify login endpoint is configured.</p>
      </main>
    </>
  );
}
TS

cat > resources/js/Pages/Auth/Register.tsx <<'TS'
import { Head } from '@inertiajs/react';

export default function Register() {
  return (
    <>
      <Head title="Register" />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-2xl font-semibold">Register</h1>
        <p className="mt-2 text-sm text-slate-600">Fortify registration endpoint is configured.</p>
      </main>
    </>
  );
}
TS

cat > routes/web.php <<'PHP'
<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');
PHP

cat > routes/api.php <<'PHP'
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', fn (Request $request) => $request->user());
PHP

cat > app/Http/Middleware/HandleInertiaRequests.php <<'PHP'
<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
PHP

cat > app/Providers/FortifyServiceProvider.php <<'PHP'
<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
    }

    public function boot(): void
    {
        Fortify::loginView(fn () => inertia('Auth/Login'));
        Fortify::registerView(fn () => inertia('Auth/Register'));

        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->email.$request->ip());
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });
    }
}
PHP

cat > vite.config.js <<'JS'
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': '/resources/js',
    },
  },
});
JS

cat > tailwind.config.js <<'JS'
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.ts',
    './resources/**/*.tsx',
  ],
  theme: {
    extend: {},
  },
  plugins: [forms, typography],
};
JS

cat > postcss.config.js <<'JS'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
JS

cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["resources/js/*"]
    },
    "types": ["vite/client"]
  },
  "include": ["resources/js/**/*.ts", "resources/js/**/*.tsx"]
}
JSON

cat > jsconfig.json <<'JSON'
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["resources/js/*"]
    }
  }
}
JSON

cat > docker-compose.yml <<'YAML'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: laravel_app
    working_dir: /var/www/html
    volumes:
      - ./:/var/www/html
    depends_on:
      - mysql
      - redis
      - meilisearch
    ports:
      - "8000:8000"
      - "5173:5173"

  mysql:
    image: mysql:8.0
    container_name: laravel_mysql
    restart: unless-stopped
    ports:
      - "3306:3306"
    environment:
      MYSQL_DATABASE: app
      MYSQL_USER: app
      MYSQL_PASSWORD: secret
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:alpine
    container_name: laravel_redis
    restart: unless-stopped
    ports:
      - "6379:6379"

  meilisearch:
    image: getmeili/meilisearch:latest
    container_name: laravel_meilisearch
    restart: unless-stopped
    environment:
      MEILI_NO_ANALYTICS: "true"
      MEILI_MASTER_KEY: masterKey
    ports:
      - "7700:7700"
    volumes:
      - meili_data:/meili_data

volumes:
  mysql_data:
  meili_data:
YAML

cat > Dockerfile <<'DOCKER'
FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git unzip zip libzip-dev libpng-dev libonig-dev libxml2-dev libicu-dev \
    sqlite3 libsqlite3-dev default-mysql-client curl && \
    docker-php-ext-install pdo pdo_mysql pdo_sqlite intl bcmath && \
    rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY --from=node:20 /usr/local/bin/node /usr/local/bin/node
COPY --from=node:20 /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm && \
    ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

WORKDIR /var/www/html

CMD ["bash", "-lc", "composer install && npm install && php artisan key:generate && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000"]
DOCKER

cat > .env.example <<'ENV'
APP_NAME="Laravel"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# MySQL Docker alternative
# DB_CONNECTION=mysql
# DB_HOST=mysql
# DB_PORT=3306
# DB_DATABASE=app
# DB_USERNAME=app
# DB_PASSWORD=secret

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
CACHE_STORE=database
SESSION_DRIVER=database
SESSION_LIFETIME=120

REDIS_CLIENT=predis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=masterKey

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=mt1
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_ENCRYPTED=true

VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"

SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173,localhost:8000
SESSION_DOMAIN=localhost

SOCIALITE_GOOGLE_CLIENT_ID=
SOCIALITE_GOOGLE_CLIENT_SECRET=
SOCIALITE_GOOGLE_REDIRECT_URI="${APP_URL}/auth/google/callback"

STRIPE_KEY=
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=

GOOGLE_MAPS_API_KEY=

OPENAI_API_KEY=
OPENAI_MODERATION_MODEL=omni-moderation-latest

RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
ENV

# Ensure providers registration in Laravel 12
cat > bootstrap/providers.php <<'PHP'
<?php

use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    App\Providers\FortifyServiceProvider::class,
];
PHP

# Wire Inertia middleware into Laravel 12 bootstrap/app.php
cat > bootstrap/app.php <<'PHP'
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
PHP

# SQLite first-run support
mkdir -p database
touch database/database.sqlite

php artisan vendor:publish --provider="Laravel\\Fortify\\FortifyServiceProvider" --force
php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider" --force

php artisan install:api --no-interaction || true
php artisan session:table || true
php artisan cache:table || true
php artisan queue:table || true
php artisan migrate

echo "Scaffold complete. Run: npm run dev"
