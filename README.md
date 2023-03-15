# Quasar App (client) & Laravel Backend (server)

A Laravel + Quasar Vue Framework App (10XAU/m - 2020)

<https://github.com/modemb/larasar>
<https://www.facebook.com/suguffie/?ref=pages_you_manage>
<https://github.com/quasarframework/quasar-awesome#projects-using-quasar>

## Install the dependencies

```bash
# composer require laravel/jetstream #Installing Jetstream https://jetstream.laravel.com/2.x/installation.html
# php artisan jetstream:install livewire --teams
# php artisan jetstream:install inertia --teams
# composer require laravel/passport
composer install
php artisan passport:install / If No Key - php artisan passport:keys
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
       <https://quasar.dev/quasar-cli-vite/testing-and-auditing>
       <https://quasar.dev/quasar-cli/testing-and-auditing#introduction>
       <https://www.youtube.com/playlist?list=PLC2LZCNWKL9ahK1IoODqYxKu5aA9T5IOA>

### PWA Icons Generate

```bash
yarn global add @quasar/icongenie
icongenie g -i public/images/backup/suguffie.png
```

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

- [x] Publishing to Stores - AppId: com.modemb.suguffie.app
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

<https://laravel.com/docs/9.x/migrations#columns>
php artisan migrate

## Comment Flow

Backend: Routes -> Controllers - Frontend: Blade -> Vue

## Features

- [x] Weather Distance Location Local Currency
- [x] CRUDAction Reusable State Management
- [x] Realtime (Chat, Push/Notification)
- [x] Users Authentication by Roles
- [x] All Platforms in One Go
- [x] Super Admin ID = 1
- [x] Email Verification
- [x] State Management
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
- [x] ipDebug
- [x] Payment
- [x] CMS

## Concept

- [x] Service Container - Dependency Injection - singletons on Laravel
      <https://www.youtube.com/watch?v=6B6CEskJKyc&list=TLPQMjExMDIwMjFmRrjGQGOaXA&index=3&ab_channel=MateusGuimar%C3%A3es>
- [x] Containers: Docker - Kubernetes
- [x] <https://www.prisma.io>
- [x] <https://stateofjs.com>
- [x] ci/cd - Pipeline (software)
- [x] add Adonis <https://adonisjs.com>

## ToMaintain

- [x] Fallback lang in Categories.vue show english when no lang
- [x] FixAutocomplete in GoogleAutocomplete.vue <https://github.com/olefirenko/vue-google-autocomplete>
- [x] TagUpdateSubCategory validate local Category before Updating Locale SubCategory
- [x] See user other posts
- [x] Move post to a different User or Category and Subcategory
- [x] SEO <https://quasar.dev/options/seo#Introduction>
- [x] Add Burkina Faso - Somalia - Eritrea - Ethiopia - RWANDA -Niger's cities
- [x] Fix add user no api ToImproveLogOutWithSession etc.
- [x] Payments Apis
      Package paypal/paypal-checkout-sdk is abandoned, you should avoid using it. No replacement was suggested.
- [x] Localizing Mailables <https://laravel.com/docs/8.x/mail#localizing-mailables>
- [x] TagUpdatePost improve Pic in Posts.vue
- [x] AddPasswordBeforeDeleteForever in Users.vue
- [x] Algolia Search: <https://www.youtube.com/watch?v=rjDh2evGezg&list=WL&index=14&ab_channel=DesignatedCoder>
- [x] Service-Worker: pre/caching strategies - background sync
      <https://youtu.be/6ZKBZ3k4Ebk?t=5652>
      <https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa#Service-Worker>
      <https://quasar.dev/quasar-cli/developing-pwa/handling-service-worker#introduction>
- [x] Workbox webpack <https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin>
- [x] Image Magnifier <https://mark-rolich.github.io/Magnifier.js>
- [x] Tests: <https://laravel.com/docs/8.x/testing#introduction>
            <https://quasar.dev/quasar-cli/testing-and-auditing#introduction>
- [x] ipDebug and config('sanctumApi') all production and  config('sanctumApi')
- [x] ImplementYourPicLibrary
- [x] ToImproveGalleryCategoryLength
- [x] quasar-language-pack:
      <https://quasar.dev/options/quasar-language-packs#introduction>
      <E:\Apps\xampp\htdocs\www\suguffie\node_modules\quasar\lang\fr.js>

## Working On

- [x] orange-money-sdk:
      <https://github.com/Foris-master/orange-money-sdk>
      <https://developer.orange.com/myapps/73oCqR65ZKegxxZi>
      <https://developer.orange.com/apis/om-webpay>
      Pay With Orange Bill Europe Production API is available only in France, Spain, Belgium, Poland and Romania.
      Please find more info on our website:
      <https://developer.orange.com/apis/direct-carrier-billing-eu-prod>

Pay with Orange Bill API is available also in Africa:
      Morocco, Tunisia, Jordan, Ivory Coast, Mali, Senegal, Guinea Conakry, Guinea Bissau, Liberia, Burkina Faso, Cameroon, Congo RD, Botswana, Madagascar, Sierre Leone, Central African Republica.

Pay with Orange Bill is the Direct Carrier Billing API by Orange which allows end-users to buy digital content in an easy and secured way. End user payment is done with Orange customer bill. This API could be easy integrated on the developer side.
      Please find info on our website:
      <https://developer.orange.com/apis/pay-with-orange-bill>

Is this the API you need?

We have also Orange Money Web Payment API but this API is available only for merchants.
      It could be used to online payment: end users could pay using Orange Money for your products offered via Web.
      Please find info here:
      <https://developer.orange.com/apis/om-webpay/>

- [x] PWA <https://web.dev/offline-cookbook>
          <https://javascript.plainenglish.io/your-pwa-is-going-to-break-in-august-2021-34982f329f40>
- [x] mobile-apps:
  Android
   This release does not add or remove any app bundles.
   <https://support.google.com/googleplay/android-developer/answer/9859348?hl=en>
   <https://stackoverflow.com/questions/69542726/this-release-does-not-add-or-remove-any-app-bundles>

   Prepare and roll out a release
   <https://support.google.com/googleplay/android-developer/answer/9859348?hl=en>

    Mobile Application Authentication
    <https://laravel.com/docs/9.x/sanctum#mobile-application-authentication>

    Main store listing
    <https://play.google.com/console/u/1/developers/5673401456490999502/app/4974182656561002664/main-store-listing>

    Capacitor APIs
    <https://quasar.dev/quasar-cli-vite/developing-capacitor-apps/capacitor-api#introduction>

    Deploying to iOS and Android
    <https://ionicframework.com/docs/angular/your-first-app/deploying-mobile>

    Android Play Store Deployment
    <https://ionicframework.com/docs/deployment/play-store>

    Publishing to Store
    <https://quasar.dev/quasar-cli-vite/developing-capacitor-apps/publishing-to-store#introduction>

    Create internal testing release:
    <https://play.google.com/console/u/1/developers/5673401456490999502/app/4974182656561002664/tracks/internal-testing?tab=releases>

    Contact
    <https://support.google.com/paymentscenter/gethelp>

   <https://developer.android.com/google/play/requirements/target-sdk>

   google play console Provide information about your app and set up your Store Listing
   google play console Test your app with a larger group of testers that you control
   google play console Let anyone sign up to test your app on Google Play
   google play console Build excitement for your app with pre-registration
   google play console Publish your app on Google Play

   <!-- ---------------------------------------------------------------------- -->

   iOs: 
   Appstoreconnect
   <https://appstoreconnect.apple.com/WebObjects/iTunesConnect.woa/ra/gettingstarted>

   How To Install iPA File on iPhone & iPad with 3uTools [FULL GUIDE]
   <https://www.youtube.com/watch?v=SiVWE-I8qhQ>

   How to Submit Your App to the App Store (2020)
   <https://www.youtube.com/watch?v=YPLs3xrDcm0&list=WL&index=6&ab_channel=CodeWithChris>

   <https://orangesoft.co/blog/how-to-submit-an-ios-app-to-the-app-store>

   Fix ✖ Updating iOS native dependencies with pod install - failed!
   sudo xcode-select --reset
   
   Fix Network
   https://discussions.apple.com/thread/252649614

- [x] Docker: <https://simplernerd.com/wsl2-uncompressed/>
              <https://docs.docker.com/desktop/windows/install/>
              <https://www.thewindowsclub.com/wslregisterdistribution-failed-with-error-0xc03a001a-2>
              <https://stackoverflow.com/questions/65891322/install-windows-subsystem-for-linux-and-get-error-0xc03a001a-and-a-long-list-or>
        The solution is referred to in this Microsoft tutorial
        <https://docs.microsoft.com/en-us/windows/wsl/install-win10#step-4---download-the-linux-kernel-update-package>

    The requested operation could not be completed due to a virtual disk system limitation. Virtual hard disk files must be uncompressed and unencrypted and must not be sparse.

    Deselect “Compress contents” (as well as “Encrypt contents” if that’s checked) by opening the profile folder for your Linux distribution. It should be located in a folder on your Windows file system, something like: USERPROFILE%\AppData\Local\Packages\CanonicalGroupLimited...
        In this Linux distro profile, there should be a LocalState folder. Right-click this folder to display a menu of options. Select Properties > Advanced and then ensure that the “Compress contents to save disk space” and “Encrypt contents to secure data” checkboxes are unselected (not checked). If you are asked whether to apply this to just to the current folder or to all subfolders and files, select “just this folder” because you are only clearing the compress flag. After this, the wsl -set-version command should work.
- [x] FIXDropdownNotWorkingProperly - ToFixNoNotificationInChat
- [x] Make location.vue - page/s.vue composition api - typescript
- [x] funding:<https://github.com/modemb/larasar/new/master?repository_funding=1>
- [x] Delete deleted user favorites and remove it from host user
- [x] Delete post and his payment
- [x] Fix view count  while adding new post
- [x] Must Verify Button, Not Working
- [x] Advertiser affiliate Accounttable#Example--Masonry-like-grid
- [x] Image Size

    (!) Some chunks are larger than 500 KiB after minification.
      Consider:
      - Using dynamic import() to code-split the application  
      - Use build.rollupOptions.output.manualChunks to improve chunking: <https://rollupjs.org/guide/en/#outputmanual> chunks
      - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.

- [x] Manifest Option <https://developer.mozilla.org/en-US/docs/Web/Manifest>
- [x] FixUserEmail in Post.vue - Posts reports button shows multiple recite
- [x] add custom service worker to src-pwa
- [x] add laravel scout for search
- [x] category masonry <https://quasar.dev/vue-components/table#example--masonry-like-grid>
- [x] Subcategory Layout <https://quasar.dev/vue-components/table#Grid-style>
- [x] Subcategory Masonry: <https://quasar.dev/vue-components/>
- [x] Fix Flag On Preview and delete/assign to the right place
- [x] Subscribe to users
- [x] SortableJS: <https://github.com/SortableJS/vue.draggable.next/blob/master/package.json>
- [x] File Storage: <https://quasar.dev/vue-components/file-picker#introduction>
- [x] Scroll Area Hide Scrollbar  <https://quasar.dev/vue-components/scroll-area#example--controlling-scrollbar-visibility>
- [x] Real Time - Push Notifications <https://pusher.com/tutorials/chat-laravel/>
      <https://github.com/beyondcode/laravel-websockets>
      <https://github.com/ammezie/laravel-chat>
      <https://laravel.com/docs/8.x/notifications#specifying-delivery-channels>
      <https://laravel.com/docs/8.x/broadcasting#introduction>
      <https://laravel-notification-channels.com/about/#suggesting-a-new-channel>
      <https://github.com/laravel-notification-channels/webpush>
      <https://quasar.dev/quasar-cli/developing-capacitor-apps/capacitor-api#capacitor-apis>
      <https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa#generatesw>
      npm install --save-dev laravel-echo pusher-js
      composer require pusher/pusher-php-server
      composer require "laravel-notification-channels/webpush"
      php artisan make:notification InvoicePaid
- [x] Skeleton: <https://quasar.dev/vue-components/skeleton#introduction>
- [x] scout#searching <https://laravel.com/docs/8.x/scout#searching>
- [x] lazy-eager-loading <https://laravel.com/docs/9.x/eloquent-relationships#lazy-eager-loading>
- [x] pwa-with-typescript: <https://quasar.dev/quasar-cli/developing-pwa/pwa-with-typescript#introduction>
- [x] Map Distance:
      <https://github.com/gocanto/google-autocomplete>
      <https://github.com/xkjyeah/vue-google-maps>
      <https://xkjyeah.github.io/vue-google-maps/>
      <https://github.com/ktquez/vue-head>
      <https://github.com/krux/postscribe>
      <https://github.com/laurencedorman/google-maps-api-loader#readme>
      <https://vuejs.org/v2/cookbook/practical-use-of-scoped-slots.html#1-Create-a-component-that-initializes-our-map>
      <https://vuejs.org/v2/cookbook/practical-use-of-scoped-slots>.
      <https://codesandbox.io/s/1o45zvxk0q?from-embed=&file=/src/components/GoogleMapLoader.vue>
      <https://developers.google.com/maps/documentation/javascript/distancematrix>
      <https://github.com/maptalks/maptalks.js>
      <https://www.google.com/search?q=vue+google+autocomplete&rlz=1C1CHBF_enCA794CA794&oq=vue+google+&aqs=chrome.1.69i57j69i59j35i39j0l2j69i60l3.15724j0j7&sourceid=chrome&ie=UTF-8>
      <!-- countries and cities -->
      <https://github.com/dr5hn/countries-states-cities-database>
      <https://github.com/ToniCifre/all-countries-and-cities-json>
      <!-- US & CA -->
      <https://gist.github.com/mshafrir/2646763>
      <https://github.com/cschoi3/US-states-and-cities-json/blob/master/data.json>
      <https://gist.github.com/pbojinov/a87adf559d2f7e81d86ae67e7bd883c7>

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

## Added Packages


## Off Packages

composer require laravel-notification-channels/webpush
composer livewire/livewire
yarn add @intlify/vue-i18n-loader -D [--dev/-D]
yarn add --dev @intlify/vue-i18n-loader
yarn add vue-timeago
yarn add vue-paycard
"laravel-mix": "^6.0.6",
"eslint-loader": "^4.0.2",
"@babel/eslint-parser": "^7.14.7",
"@tailwindcss/forms": "^0.4.0",
"@tailwindcss/typography": "^0.5.0",
"tailwindcss": "^3.0.0",
"postcss-import": "^12.0.1",
"@vue/compiler-sfc": "^3.0.5",
"vite": "^4.14",
"electron": "^19.0.0",
"electron-packager": "^15.2.0",

- [x] composer require doctrine/dbal "doctrine/dbal": "^3.0",https://laravel.com/docs/9.x/sanctum#installation

## Frontend Client

Local:http://localhost:8080
Network:http://192.168.2.11:8080

## Backend PHP Built-in web server
<https://www.php.net/manual/en/features.commandline.webserver.php>

Local: http://localhost:8000
Network: php -S 192.168.2.22:8000 -t public
php artisan serve --host=192.168.2.11 --port=8000

## Running Seeders - Super Admin id = 1 - Social Login = Seller

php artisan db:seed --class=UsersTableSeeder
TRUNCATE TABLE reports;

# I cannot upload big dump files (memory, HTTP or timeout problems).
http://localhost/phpMyAdmin5/doc/html/faq.html#faq1-16
upload_max_filesize, memory_limit and post_max_size in the php.ini
Please note that post_max_size needs to be larger than upload_max_filesize
