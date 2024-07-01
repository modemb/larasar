# Quasar App (client) & Laravel Backend (server)

A Laravel + Quasar Vue Framework App (10XAU/m - 2020)

<https://github.com/modemb/larasar>
<https://www.facebook.com/suguffie/?ref=pages_you_manage>
<https://github.com/quasarframework/quasar-awesome#projects-using-quasar>

## Install the dependencies

```bash
#Installing Jetstream 
# https://jetstream.laravel.com/installation.html
# composer require laravel/jetstream 
# php artisan jetstream:install livewire --teams
# php artisan jetstream:install inertia --teams
# Server Side Rendering
# https://inertiajs.com/server-side-rendering
# php artisan jetstream:install inertia --ssr
# php artisan inertia:start-ssr
# php artisan inertia:stop-ssr
# php artisan jetstream:install livewire --dark
# # composer require laravel/passport
# php artisan install:api --passport / If No Key - php artisan passport:keys
# Create Quasar App
# https://quasar.dev/start/quick-start
# yarn create quasar
# =========== App Installation ================
composer install
cp .env.example .env
php artisan key:generate
npm install && npm run dev
# =========== OR ==============================
yarn ci # Check package.json For more details
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
php artisan serve
quasar dev
quasar dev -m ssr
quasar dev -m pwa
quasar dev -m bex
# components/Functions
# Uncomment import to enable native mobile app feature
quasar dev -m capacitor -T android|ios
quasar dev -m android|ios
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
quasar build -m bex
quasar build -m capacitor -T android|ios
quasar build -m android|ios
quasar build -m electron
quasar build -m ios -- some params --and options --here
quasar build -m electron -- --no-sandbox --disable-setuid-sandbox
```

### Easily Create Pixar Style 3D Videos

https://createstudio.com

### PWA - APP Icons Generate

```bash
yarn global add @quasar/icongenie
icongenie g -i public/images/backup/suguffie.png
icongenie generate -m capacitor -i database/apps/files/backup/suguffie.png
icongenie generate -m cordova -i /path/to/source/icon.png [-b /path/to/background.png]
icongenie generate -m capacitor -i /path/to/source/icon.png [-b /path/to/background.png]
```

## Testing - Manuel (QA) - Automatic (CI/CD)

Laravel <https://laravel.com/docs/11.x/testing#introduction>
        <https://laravel.com/docs/11.x/dusk>
Quasar <https://testing.quasar.dev/>
       <https://quasar.dev/quasar-cli-vite/testing-and-auditing>
       <https://quasar.dev/quasar-cli/testing-and-auditing#introduction>
       <https://www.youtube.com/playlist?list=PLC2LZCNWKL9ahK1IoODqYxKu5aA9T5IOA>

### Capacitor Apps: Android Studio – Configure – Default Project Structure

<https://quasar.dev/quasar-cli-vite/developing-capacitor-apps/preparation#introduction>

### Cordova Apps: Android Studio – Configure – Default Project Structure

## quasar mode add cordova

<https://quasar.dev/quasar-cli-vite/developing-cordova-apps/preparation#introduction>

Setting Environment Variables: <https://cordova.apache.org/docs/en/latest/guide/platforms/android/#setting-environment-variables>

Windows
In Search, search system - advance system setting
and then Click Environment Variables. ...
In the Edit System Variable (or New System Variable) window, specify the value of the PATH environment variable. ...
Reopen Command prompt window, and run your java code.

The environmental variable ANDROID_HOME has been deprecated and replaced with ANDROID_SDK_ROOT. Depending on your version of Android Studio you may need one or the other. It doesn’t hurt to have both set.

```bash
export ANDROID_HOME='E:\Apps\Android\android-sdk'
export ANDROID_SDK_ROOT='E:\Apps\Android\android-sdk'
export JAVA_HOME='E:\Apps\Android\Android Studio\jre'
export JAVA_HOME='C:\Program Files\Java\jdk-17.0.2'
```

- [x] Publishing to Stores - AppId: com.modemb.larasar.app
      Capacitor Apps: <https://quasar.dev/quasar-cli/developing-capacitor-apps/publishing-to-store#introduction> <https://capacitorjs.com/docs/config#schema>
      Cordova Apps: <https://quasar.dev/quasar-cli/developing-cordova-apps/preparation#introduction>
  <https://stackoverflow.com/questions/5488339/how-can-i-find-and-run-the-keytool>
  
### Developing Mobile Apps

<https://quasar.dev/quasar-cli/developing-mobile-apps>

### Developing Desktop Apps

<https://quasar.dev/quasar-cli-webpack/developing-electron-apps>

### Publishing to Store

<https://quasar.dev/quasar-cli/developing-cordova-apps/publishing-to-store>
<https://quasar.dev/quasar-cli/developing-capacitor-apps/publishing-to-store>
<https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron>

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

## Create Update Columns From AddColumnsToTable

<https://laravel.com/docs/11.x/migrations#columns>
php artisan migrate

## Comment Flow

Backend: Routes -> Controllers <-> Frontend: Blade -> Vue

## Features

- [x] Weather Distance Location Local Currency
- [x] crudAction Reusable State Management
- [x] Realtime (Chat, Push/Notification)
- [x] Dynamic loading virtual scroll
- [x] Users Authentication by Roles
- [x] All Platforms in One Go
- [x] Super Admin ID = 1
- [x] Email Verification
- [x] Session Management
- [x] Users Analytics
- [x] Form Validation
- [x] Password Reset
- [x] Live Migration
- [x] Users Sessions
- [x] Social Login
- [x] Share Button
- [x] Soft Delete
- [x] File upload  
- [x] Cron jobs
- [x] darkMode
- [x] ipDebug
- [x] Payment
- [x] CMS

### Miscellaneous <https://quasar.dev/quasar-cli/commands-list#introduction>>

```bash
php artisan make:model Example -mcr
php artisan make:model Flight --all
php artisan make:controller MessageController -r
php artisan make:migration create_rooms_table
laravel new update
quasar create update
quasar create update --branch next
quasar create branch --branch v1

## Frontend Client

Local:http://localhost:8080
Network:http://192.168.2.11:8080

## Backend PHP Built-in web server
<https://www.php.net/manual/en/features.commandline.webserver.php>

Local: http://localhost:8000
Network: php -S 192.168.2.22:8000 -t public ## Mac
php artisan serve --host=192.168.2.11 --port=8000
