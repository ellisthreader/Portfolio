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
