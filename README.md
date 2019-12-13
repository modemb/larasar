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
<<<<<<< HEAD
# In order to build a SSR website, we first need to add the SSR mode to our Quasar project:
quasar mode add ssr
=======
>>>>>>> modemb/dev
quasar dev -m ssr
quasar dev -m pwa
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
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

# Frontend Client
Local:http://localhost:8080
Network:http://192.168.2.11:8080
# Backend Sever
Local:http://localhost:8000
Network: php -S 192.168.2.11:8000 -t public
