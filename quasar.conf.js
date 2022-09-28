/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

/* eslint-env node */
// const ESLintPlugin = require('eslint-webpack-plugin') // commented
/* eslint-disable @typescript-eslint/no-var-requires */
const { configure } = require('quasar/wrappers')

// https://quasar.dev/quasar-cli/quasar-conf-js#Example-setting-env-for-dev%2Fbuild
const env = require('dotenv').config().parsed
const localProdServer = env.LOCAL_PROD==='1'?1:0

module.exports = configure(function (ctx) {
  return {
    // https://quasar.dev/quasar-cli/supporting-ts
    supportTS: {
      tsCheckerConfig: {
        eslint: {
          enabled: true,
          files: './src/**/*.{ts,tsx,js,jsx,vue}'
        }
      }
    },

    // https://quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/boot-files
    boot: ['i18n', 'axios'],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
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
      'material-icons' // optional, you are not bound to it
    ],

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: 'history', // available values: 'hash', 'history'

      // transpile: false,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,
      // ================= \\
      // vueCompiler: true,

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: true, // https://quasar.dev/options/rtl-support
      // preloadChunks: true, // NotInQ2
      // showProgress: false,
      gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/handling-webpack
      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpack (/* chain */) {
        // chain.plugin('eslint-webpack-plugin')
        //   .use(ESLintPlugin, [{ extensions: [ 'js', 'vue' ] }])
      }, // Commented,

      // https://www.npmjs.com/package/dotenv
      env: env,
      distDir: 'public/quasar', // Comment for dist folder
      publicPath: localProdServer ? '/www/suguffie/public' : '/', // Build URL

      // https://quasar.dev/quasar-cli/handling-webpack#introduction
      extendWebpack (cfg) {
        // cfg.module.rules.push({
        //   enforce: 'pre', // commented
        //   test: /\.(js|vue)$/,
        //   loader: 'eslint-loader',
        //   exclude: /(node_modules|quasar)/
        // })

        if (ctx.prod) cfg.output.publicPath = localProdServer
          ? '/www/suguffie/public/quasar/' : '/quasar/' // Build Path
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      // server: {
      //   type: 'https',
      //   options: {
      //     // Use ABSOLUTE paths or path.join(__dirname, 'root/relative/path')
      //     // key: '/path/to/server.key',
      //     // pfx: '/path/to/server.pfx',
      //     // cert: '/path/to/server.crt',
      //     // ca: '/path/to/ca.pem',
      //     // passphrase: 'webpack-dev-server' // do you need it?
      //   }
      // },
      // https: true,yarn
      port: ctx.mode.spa ? 8080
         : (ctx.mode.pwa ? 9090 : 9000),
      open: true // opens browser window automatically
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      config: {},

      // For special cases outside of where the auto-import stategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:

      iconSet: 'material-icons', // Quasar icon set
      // lang: 'fr', // Quasar language pack

      // Possible values for "all":
      // * 'auto' - Auto-import needed Quasar components & directives
      //            (slightly higher compile time; next to minimum bundle size; most convenient)
      // * false  - Manually specify what to import
      //            (fastest compile time; minimum bundle size; most tedious)
      // * true   - Import everything from Quasar
      //            (not treeshaking Quasar; biggest bundle size; convenient)
      all: 'auto',

      // For special cases outside of where the auto-import stategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      components: [],
      directives: [],

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
    // https://quasar.dev/options/animations
    animations: [],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
                      // (gets superseded if process.env.PORT is specified at runtime)

      maxAge: 1000 * 60 * 60 * 24 * 30,
        // Tell browser when a file from the server should expire from cache (in ms)

      chainWebpackWebserver (/* chain */) {
        // chain.plugin('eslint-webpack-plugin')
        //   .use(ESLintPlugin, [{ extensions: [ 'js' ] }])
      }, // commented

      middlewares: [
        ctx.prod ? 'compression' : '',
        'render' // keep this as last one
      ]
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW

      // ====================Added===========================
      workboxMode: 'generateSW', // or 'injectManifest'
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
      // extendGenerateSWOptions (cfg) {},
      // extendInjectManifestOptions (cfg) {},
      // extendManifestJson (json) {},
      // extendPWACustomSWConf (esbuildConf) {},
      // =======================================================

      // for the custom service worker ONLY (/src-pwa/custom-service-worker.[js|ts])
      // if using workbox in InjectManifest mode
      chainWebpackCustomSW (/* chain */) {
        // chain.plugin('eslint-webpack-plugin')
        //   .use(ESLintPlugin, [{ extensions: [ 'js' ] }])
      }, // commented

      manifest: {
        name: 'Suguffiè - Classified Marketplace',
        short_name: 'Suguffiè',
        description: 'World Marketplace, Classified Ads, Services, Jobs, Buy & Sell',
        display: 'standalone',
        start_url: 'https://suguffie.com',
        orientation: 'any', // any - portrait
        background_color: '#ffffff', // #ffffff
        theme_color: '#027be3', // #027be3
        // gcm_sender_id: 103953800507,
        // prefer_related_applications: true, // Prompt the user to install Web App - false / Native App - true
        // related_applications: [
        //   {
        //     platform: 'play',
        //     id: 'com.google.samples.apps.iosched'
        //   } // Play Store app ID
        // ], // https://developers.google.com/web/fundamentals/app-install-banners/native#mini-info-bar
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
      }
    },

    sourceFiles: {
      pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
      pwaServiceWorker: 'src-pwa/custom-service-worker',
      pwaManifestFile: 'src-pwa/manifest.json',
    },//Added

    // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
      // id: 'org.cordova.quasar.app'
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: false //true
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
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
        appId: 'quapp'
      },

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpack(/* chain */) {
        // do something with the Electron main process Webpack cfg
        // extendWebpackMain also available besides this chainWebpackMain
      },

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpackPreload (/* chain */) {
        // do something with the Electron main process Webpack cfg
        // extendWebpackPreload also available besides this chainWebpackPreload
        // chain.plugin('eslint-webpack-plugin')
        //   .use(ESLintPlugin, [{ extensions: [ 'js' ] }])
      }, // commented

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      // chainWebpack (/* chain */) {
      //   // do something with the Electron main process Webpack cfg
      //   // extendWebpackMain also available besides this chainWebpackMain
      // },

      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      // nodeIntegration: true,

      // extendWebpack (/* cfg */) {
      //   // do something with Electron main process Webpack cfg
      //   // chainWebpack also available besides this extendWebpack
      // }
    }
  }
})
