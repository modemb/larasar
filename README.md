# Quasar App (client) & Laravel Backend (server)

A Laravel + Quasar Vue Framework App

<https://github.com/modemb/larasar>
<https://www.facebook.com/suguffie>
<https://github.com/quasarframework/quasar-awesome#projects-using-quasar>

## Install the dependencies

```bash
# composer require laravel/jetstream #Installing Jetstream https://jetstream.laravel.com/2.x/installation.html
# php artisan jetstream:install livewire --teams
# php artisan jetstream:install inertia --teams
# composer require laravel/passport
# php artisan passport:install / If No Key - php artisan passport:keys
composer install
cp .env.example .env
php artisan key:generate
npm install && npm run dev
```
### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
php artisan serve
quasar dev
quasar dev -m ssr
quasar dev -m pwa
quasar dev -m bex
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

## Testing - Manuel (QA) - Automatic (CI/CD) 

Laravel <https://laravel.com/docs/9.x/testing#introduction>
        <https://laravel.com/docs/9.x/dusk>
Quasar <https://testing.quasar.dev/>
       <https://quasar.dev/quasar-cli/testing-and-auditing#introduction>

### PWA Icons Generate

```bash
yarn global add @quasar/icongenie
icongenie g -i public/images/backup/suguffie.png
```
### Cordova Setup: Android Studio – Configure – Default Project Structure

Windows
In Search, search for and then Click Environment Variables. ...
In the Edit System Variable (or New System Variable) window, specify the value of the PATH environment variable. ...
Reopen Command prompt window, and run your java code.

```bash
export ANDROID_HOME='D:\Projects\Android\android-sdk'
export ANDROID_SDK_ROOT='D:\Projects\Android\android-sdk'
export JAVA_HOME='E:\Apps\Android\Android Studio\jre'
export JAVA_HOME='C:\Program Files\Java\jdk-17.0.2'
```
### Developing Mobile Apps
<https://quasar.dev/quasar-cli/developing-mobile-apps>

### Publishing to Store 

<https://quasar.dev/quasar-cli/developing-capacitor-apps/publishing-to-store>

<https://quasar.dev/quasar-cli/developing-cordova-apps/publishing-to-store#Introduction>

## Navigate to the folder that contains keytool.exe or add this folder to your path

## Open a Command Prompt window running as an administrator

```bash
cd 'E:\Apps\Android\Android Studio\jre\jre\bin'
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 20000
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore 'D:\Projects\wamp\www\larasar\dist\cordova\android\apk\release' alias_name
```

## To open the AVD Manager, do one of the following:
Select Tools > AVD Manager.
Click AVD Manager in the toolbar.

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

## Create Update Columns From AddColumnsToTable

https://laravel.com/docs/8.x/migrations#columns
php artisan migrate

## Comment Flow

Backend: Routes -> Controllers - Frontend: Blade -> Vue

## Features

- [x] CRUDAction Reusable State Management
- [x] Realtime (Chat, Push/Notification)
- [x] Users Authentication by Roles
- [x] All Platforms in One Go
- [x] Super Admin id = 1
- [x] Email Verification
- [x] State Management
- [x] Users Analytics
- [x] Form Validation
- [x] Password Reset
- [x]	Live Migration 
- [x] Users Sessions
- [x] Social Login
- [x] Share Button
- [x] Soft Delete
- [x] File upload   
- [x] Cron jobs
- [x] ipDebug
- [x] Payment
- [x] CMS
