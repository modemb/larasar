# Quasar App (client) & Laravel Backend (server)

A Laravel + Quasar Vue Framework App

<https://github.com/modemb/larasar>

## Install the dependencies

```bash
composer install
composer require laravel/ui --dev
php artisan ui vue --auth
cp .env.example .env
php artisan key:generate
php artisan passport:install
npm install
npm run dev
```
### Cordova Setup: Android Studio – Configure – Default Project Structure

```bash
export ANDROID_HOME='D:\Projects\Android\android-sdk'
export JAVA_HOME='E:\Apps\Android\Android Studio\jre'
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
php artisan serve
quasar dev
quasar dev -m ssr
quasar dev -m pwa
quasar dev -m android|ios
quasar dev -m electron
quasar dev -m ios -- some params --and options --here
quasar dev -m electron -- --no-sandbox --disable-setuid-sandbox
```

### Lint the files

```bash
npm run lint
```

### Miscellaneous

```bash
quasar create qupdate
npm update && quasar dev
npm update && quasar build -m pwa && quasar dev
```

### Build the app for production

```bash
quasar build
quasar build -m ssr
quasar build -m pwa
quasar build -m android|ios
quasar build -m electron
quasar build -m ios -- some params --and options --here
quasar build -m electron -- --no-sandbox --disable-setuid-sandbox
```

### Publishing to Store

<https://quasar.dev/quasar-cli/developing-cordova-apps/publishing-to-store#Introduction>

## Navigate to the folder that contains keytool.exe or add this folder to your path

## Open a Command Prompt window running as an administrator

```bash
cd 'E:\Apps\Android\Android Studio\jre\jre\bin'
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 20000
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore 'D:\Projects\wamp\www\larasar\dist\cordova\android\apk\release' alias_name
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

## Frontend Client

Local:<http://localhost:8080>
Network:<http://192.168.2.11:8080>

## Backend Sever

Local:<http://localhost:8000>
Network: php -S 192.168.2.11:8000 -t public

## Running Seeders - Super Admin id = 1 - Social Login = Seller

php artisan db:seed --class=UsersTableSeeder

## Create Update Columns From AddColumnsToTable

https://laravel.com/docs/7.x/migrations#columns
php artisan migrate:rollback -- migrate

## Comment Flow

Backend: Routes -> Controllers - Frontend: Blade -> Vue

## Features

- [x] Users Authentication by Roles
- [x] Email Verification
- [x] State Management
- [x] Live Migration
- [x] Password Reset 
- [x] Social Login
- [x] Form Validation
- [x] Users Analytics
- [x] CRUD
