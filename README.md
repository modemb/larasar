# Quasar App (client) & Laravel Backend (server)

A Laravel + Quasar Framework App

## Install the dependencies
```bash
composer install
composer require laravel/ui --dev
php artisan ui vue --auth
cp .env.example .env
php artisan key:generate
php artisan passport:keys or php artisan passport:install
npm install
npm run dev
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
php artisan serve
quasar dev -m ssr
quasar dev -m pwa
quasar dev -m [android|ios]
quasar dev -m electron
quasar dev -m ios -- some params --and options --here
quasar dev -m electron -- --no-sandbox --disable-setuid-sandbox
```

### Lint the files
```bash
npm run lint
```

### Build the app for production
```bash
quasar build
quasar build -m ssr
quasar build -m pwa
quasar build -m [android|ios]
quasar build -m electron
quasar build -m ios -- some params --and options --here
quasar build -m electron -- --no-sandbox --disable-setuid-sandbox
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

# Frontend Client
Local:http://localhost:8080
Network:http://192.168.2.11:8080
# Backend Sever
Local:http://localhost:8000
Network: php -S 192.168.2.11:8000 -t public
