/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

const { configure } = require('quasar/wrappers');
const path = require('path');

// https://quasar.dev/quasar-cli-vite/handling-process-env#using-dotenv
const env = require('dotenv').config().parsed
const localProd = env.LOCAL_PROD==='1'?1:0
const devDir = env.DEV_DIR // TODO Get App Url
const basePath = 'public' // dist/public
const vitePluginChecker = env.VUE_TSC==='true'?'vite-plugin-checker':''

module.exports = configure(function (ctx) {
  const apps = (ctx.mode.capacitor||ctx.mode.cordova)?true:false
  const dirname = ctx.modeName // webDir/appDir

  env.TARGET = ctx.target // .ios

  return {
    // eslint: {
    //   // fix: true,
    //   // include = [],
    //   // exclude = [],
    //   // rawOptions = {},
    //   warnings: true,
    //   errors: true
    // },//deleted

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of 'main.js'
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ['i18n', 'axios',],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ['app.sass'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: [ 'es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1' ],
        node: 'node16'
      },

      vueRouterMode: 'history', // available values: 'hash', 'history'
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      // publicPath: '/',
      // analyze: true,
      // env: {},
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir
      // extendViteConf (viteConf) {},
      // viteVuePluginOptions: {},

      env, // gzip: true,
      distDir: `${basePath}/${dirname}`, // Build Path - Comment for dist folder
      publicPath: localProd ? `/${devDir}/${basePath}` : '/', // Server Path
      // publicPath: localProd ? `/www/suguffieU/${basePath}` : '/', // Server Path

      // https://quasar.dev/quasar-cli-vite/handling-vite#introduction
      extendViteConf (cfg /* { isServer, isClient } */) {
        // cfg.build.rollupOptions.external = '@capacitor/share'
        // cfg.build.rollupOptions.external = '@capacitor/share'
        if (ctx.prod) cfg.base = localProd // Client Path
        ? `/${devDir}/${basePath}/${dirname}/` // Local Production
        // ? `/www/suguffieU/${basePath}/${dirname}/` // Local Production
          : `/${dirname}/` // Production
        if (apps) cfg.build.outDir = // App Build Path
          `${cfg.resolve.alias.app}/${basePath}/${dirname}/`
        // `/Applications/MAMP/htdocs/www/suguffieU/${basePath}/${dirname}/`
        // =================================
        // cfg.base = '/www/larasar/dist/pwa/'
        console.log(
          'ctx', ctx,
          // 'cfg', cfg,
          // 'dirname', dirname,
          // 'isServer', isServer,
          // 'isClient', isClient,
          // 'globalThis', globalThis,
          // 'build.rollupOptions', cfg.build,
          // 'appDir', cfg.resolve.alias.app
        )
      },

      // https://quasar.dev/quasar-cli-vite/handling-vite#adding-vite-plugins
      // vitePlugins: [
      //   ['@intlify/vite-plugin-vue-i18n', {
      //     // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      //     // compositionOnly: false,

      //     // you need to set i18n resource including paths !
      //     include: path.resolve(__dirname, './src/i18n')
      //   }],
      //   // ['vite-plugin-ignore-static-import', [
      //   //   '@capacitor/share',
      //   //   '@capacitor/browser'
      //   // ]]
      // ]

      vitePlugins: [
        ['@intlify/vite-plugin-vue-i18n', {
          // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
          // compositionOnly: false,

          // if you want to use named tokens in your Vue I18n messages, such as 'Hello {name}',
          // you need to set `runtimeOnly: false`
          // runtimeOnly: false,

          // you need to set i18n resource including paths !
          include: path.resolve(__dirname, './src/i18n/**')
        }],
        [vitePluginChecker, {
          vueTsc: {
            tsconfigPath: 'tsconfig.vue-tsc.json'
          },
          eslint: {
            lintCommand: 'eslint "./**/*.{js,ts,mjs,cjs,vue}"'
          }
        }, { server: false }]
      ]
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      //   options: {
      //     // Use ABSOLUTE paths or path.join(__dirname, 'root/relative/path')
      //     // key: '/path/to/server.key',
      //     // pfx: '/path/to/server.pfx',
      //     // cert: '/path/to/server.crt',
      //     // ca: '/path/to/ca.pem',
      //     // passphrase: 'webpack-dev-server' // do you need it?
      //   }
      // }, // https://quasar.dev/quasar-cli-vite/developing-capacitor-apps/capacitor-version-support#capacitor-v3
      // https: apps,
      port: ctx.mode.spa ? 8080
          : ctx.mode.pwa ? 9090 : 9000,
      open: true // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {
        capacitor: {
          iosStatusBarPadding: false, // add the dynamic top padding on iOS mobile devices
        }
      },

      iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // all: 'auto',
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: [
        'Notify',
        'Cookies',
        'Meta',
        'LocalStorage',
        'SessionStorage',
        'Loading'
      ]
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
    sourceFiles: {
      rootComponent: 'src/App.vue',
      router: 'src/router/index',
      store: 'src/store/index',
      // registerServiceWorker: 'src-pwa/register-service-worker',
      // serviceWorker: 'src-pwa/custom-service-worker',

      pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
      pwaServiceWorker: 'src-pwa/custom-service-worker',

      pwaManifestFile: 'src-pwa/manifest.json',
      electronMain: 'src-electron/electron-main',
      electronPreload: 'src-electron/electron-preload'
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
                                          // will mess up SSR

      // extendSSRWebserverConf (esbuildConf) {},
      // extendPackageJson (json) {},

      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
                      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        ctx.prod ? 'compression' : '',
        'render' // keep this as last one
      ]
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'generateSW', // or 'injectManifest'
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
      // useFilenameHashes: true,
      // extendGenerateSWOptions (cfg) {},
      // extendInjectManifestOptions (cfg) {},
      // extendManifestJson (json) {}
      // extendPWACustomSWConf (esbuildConf) {}
      // =======================================================

      _manifest: {
        name: 'Suguffiè',
        short_name: 'Suguffiè',
        description: 'World Marketplace, Classified Ads, Services, Jobs, Buy & Sell',
        display: 'standalone',
        start_url: 'https://larasar.com',
        orientation: 'any', // any - portrait
        background_color: '#ffffff', // #ffffff
        theme_color: '#027be3', // #027be3
        gcm_sender_id: 103953800507,
        prefer_related_applications: true, // Prompt the user to install Web App - false / Native App - true
        related_applications: [
          {
            platform: 'play',
            url: 'https://play.google.com/store/apps/details?id=org.modemb.larasar.app',
            id: 'org.modemb.larasar.app'
          }, { // https://developer.apple.com/documentation/webkit/promoting_apps_with_smart_app_banners
            platform: 'itunes',
            // https://apps.apple.com/us/app/suguffi%C3%A8/id6451084736
            // https://apps.apple.com/app/suguffi%C3%A8/id6451084736
            url: 'https://itunes.apple.com/app/suguffi%C3%A8/id6451084736'
          }, {
            platform: 'windows',
            url: 'https://apps.microsoft.com/store/detail/example-app1/id123456789'
          } // https://developer.mozilla.org/en-US/docs/Web/Manifest/related_applications
        ], // https://developers.google.com/web/fundamentals/app-install-banners/native#mini-info-bar
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      } // NotInUse // https://web.dev/customize-install/
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf)
      // extendElectronPreloadConf (esbuildConf)

      inspectPort: 5858,

      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'quasar-project'
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      contentScripts: [
        'my-content-script'
      ],

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    }
  }
})
