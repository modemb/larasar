if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,f)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let r={};const d=e=>a(e,i),b={module:{uri:i},exports:r,require:d};s[i]=Promise.all(c.map((e=>b[e]||d(e)))).then((e=>(f(...e),r)))}}define(["./workbox-37fde244"],(function(e){"use strict";e.setCacheNameDetails({prefix:"larasar"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/Auth.d91cde1c.js",revision:"95c4b6395fce16b8015f70d6951da2a0"},{url:"assets/axios.3202fc3e.js",revision:"b877069f2444856ea638bd5eef896268"},{url:"assets/Chat.f693c7ff.js",revision:"6c899fbb35e915fb8f5c318ed91f9bcc"},{url:"assets/Chat.fa18ae6b.css",revision:"ebd5b52557610ba8cc17037121c57298"},{url:"assets/ClosePopup.0c5fb872.js",revision:"8ecf1c6c77145c3d2b7fe19a075621e6"},{url:"assets/ErrorNotFound.245829d6.js",revision:"1f3e2786bf39d6a1d28591c8a2fa22c6"},{url:"assets/export-file.d7fa07d8.js",revision:"3ddd8a34d6f9721fbcf459925f36e040"},{url:"assets/fa-brands-400.232c6f6a.woff2",revision:"b55b1345f0b919f0cab774ec25d6654e"},{url:"assets/fa-brands-400.e28096fa.ttf",revision:"b7dee83cb5ee2c47b053e2620f4bbb78"},{url:"assets/fa-regular-400.9174757e.ttf",revision:"3c264849ff4eb9b6e99eab9cd54c80ae"},{url:"assets/fa-regular-400.c27da6f8.woff2",revision:"aa7c5fa494807f7a9ec907defee083e8"},{url:"assets/fa-solid-900.ae17c16a.woff2",revision:"1ec0ba058c021acf7feaa18081445d63"},{url:"assets/fa-solid-900.b4990d0d.ttf",revision:"0a95f951745ba02faa8773ea6a1ebaed"},{url:"assets/fa-v4compatibility.c7a869fa.woff2",revision:"fdb652dcc200dd23b8b8040176858c36"},{url:"assets/fa-v4compatibility.ff8f525f.ttf",revision:"95b97efa98f9e3fb869bc9634c43a0cc"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.fd84f88b.woff",revision:"3e1afe59fa075c9e04c436606b77f640"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.4a4dbc62.woff2",revision:"a4160421d2605545f69a4cd6cd642902"},{url:"assets/Functions.1e50194a.js",revision:"bca6efc1805234e5fdadcfebc95c4251"},{url:"assets/GoogleAutocomplete.29d37eb4.js",revision:"4384418a7eeb402833f62db21ff9097a"},{url:"assets/GoogleAutocomplete.f9919097.css",revision:"494e4d148c16605ea11eeaeae305b57e"},{url:"assets/i18n.31f4444f.js",revision:"1b8b14a22616e50830c1ce260d9040f8"},{url:"assets/index.be7393b4.css",revision:"459282538644eb23c6d1b961ffb09f21"},{url:"assets/index.d6c95a7b.js",revision:"23f5384d212b4f9a75268e9644dabb72"},{url:"assets/IndexPage.2cf39f6b.css",revision:"9319ad0cf539e25da153c67b142d8e04"},{url:"assets/IndexPage.ae99b976.js",revision:"06e5e0821f6fa14108dd970a0128be42"},{url:"assets/KFOkCnqEu92Fr1MmgVxIIzQ.34e9582c.woff",revision:"4aa2e69855e3b83110a251c47fdd05fc"},{url:"assets/KFOlCnqEu92Fr1MmEU9fBBc-.9ce7f3ac.woff",revision:"40bcb2b8cc5ed94c4c21d06128e0e532"},{url:"assets/KFOlCnqEu92Fr1MmSU5fBBc-.bf14c7d7.woff",revision:"ea60988be8d6faebb4bc2a55b1f76e22"},{url:"assets/KFOlCnqEu92Fr1MmWUlfBBc-.e0fd57c0.woff",revision:"0774a8b7ca338dc1aba5a0ec8f2b9454"},{url:"assets/KFOlCnqEu92Fr1MmYUtfBBc-.f6537e32.woff",revision:"bcb7c7e2499a055f0e2f93203bdb282b"},{url:"assets/KFOmCnqEu92Fr1Mu4mxM.f2abf7fb.woff",revision:"d3907d0ccd03b1134c24d3bcaf05b698"},{url:"assets/LocaleDropdown.3fa271b4.js",revision:"f235611cc44e6e9914ac56345a68c084"},{url:"assets/MainLayout.c9daf7c9.js",revision:"4779a1049d05fbc26f54b16432362cc0"},{url:"assets/MainLayout.d7fb5936.css",revision:"375a73697fd39451e7d6a081ad98c047"},{url:"assets/PageContent.b139c56a.js",revision:"0f29d15820af8e1e6bbc860844c65d75"},{url:"assets/PageContent.d5463836.css",revision:"cefd339dab7bd50d92da458f11fe58a7"},{url:"assets/PagesList.8c73cf84.js",revision:"ab572f61a5e990c5ebdd5fd6dd88e508"},{url:"assets/plugin-vue_export-helper.21dcd24c.js",revision:"b29b145139fc88e89a46af507277557d"},{url:"assets/Profile.e853311d.js",revision:"c96700734f4f4ee2a79703f9f2ef9052"},{url:"assets/pwa-action-sheet.entry.eadf7222.js",revision:"88f82c56018f9520b4fc7436bbeeddb9"},{url:"assets/pwa-camera-modal-instance.entry.2a5b59c2.js",revision:"4004f3b9d020713d94aa21ed67559ca8"},{url:"assets/pwa-camera-modal.entry.97246f59.js",revision:"9486eaa3b24c3543f34f5608d03c88fd"},{url:"assets/pwa-camera.entry.7a024464.js",revision:"d5d8a6e15c36de112585e3604f5f931b"},{url:"assets/pwa-toast.entry.30914aae.js",revision:"ee53f63b54e6836d8a7d843cea95eca5"},{url:"assets/QBar.fe849e49.js",revision:"4d1c4084ec4fe5527e16aabc2e04b1fb"},{url:"assets/QCard.fc8dc166.js",revision:"75aec38817a491e1de48432f983430ba"},{url:"assets/QCardSection.539b2f31.js",revision:"b5551dc1250086d5c673c91d30eb56a1"},{url:"assets/QCheckbox.448c8bf2.js",revision:"cd5c3b4fc3f976f1fae53abc7e83bf69"},{url:"assets/QFooter.eca9f0a6.js",revision:"b20f08b096b88ffe87f88c66a6f3cee4"},{url:"assets/QForm.44517784.js",revision:"f48af8f5916f96301e65df4c5e267605"},{url:"assets/QImg.0ba9e0aa.js",revision:"85b321b189c31e59e28ce836b5c4a2ae"},{url:"assets/QLayout.8583c076.js",revision:"0bb4217a4b3e78cdd7925ee48da03b93"},{url:"assets/QPage.344c31f3.js",revision:"900136278cadc70dee87ab71f7a1a799"},{url:"assets/QPageContainer.bf5e1af8.js",revision:"9830052a03622034ed87dad70671f782"},{url:"assets/QPopupProxy.3b4924b9.js",revision:"61a7bb4a6770ed2c2f6ccd8e1da5a6bf"},{url:"assets/QSeparator.8817dad6.js",revision:"d4b0ae92ad7779f9f9184c9f86d0cfab"},{url:"assets/QTable.9d3ff620.js",revision:"527069d84add9a1e4019ece637e0d2b0"},{url:"assets/QToggle.34bdd8ca.js",revision:"eb3b59c9cb5e0982da5f905ac572952d"},{url:"assets/QTooltip.0a564bb0.js",revision:"b479e17f897dad645bf9e57a44ff3800"},{url:"assets/QTr.59c223e2.js",revision:"29e9428f9afddec6249455c5f53062b8"},{url:"assets/TestPage.5b7c3286.js",revision:"1d5670aa8cc5edde196d1d1873e0cbe6"},{url:"assets/TestPage.fd65ec74.css",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"assets/use-dark.b9235899.js",revision:"1be136fd66681cfedd12183a5b751669"},{url:"assets/use-quasar.cb55fe1d.js",revision:"3b9ea34c0984bfa6ff78ab596a97c238"},{url:"assets/UserCurrencies.21709eb3.js",revision:"374f55f075d7a65941c2636f31f69502"},{url:"assets/UserFiles.b128ef08.js",revision:"fe5f6c75a9a4440f34745cf01c8749f7"},{url:"assets/UserReports.f4e53bf1.js",revision:"26c96b3ae11b78f40fef4f9bbf7c2b6b"},{url:"assets/UsersAnalytics.d05bc13b.js",revision:"e2e837b96ae2bf3116f70c07ed9bee29"},{url:"assets/UserShare.d9969a38.js",revision:"09e933f481e1c649f0e93e712b6d3945"},{url:"assets/UsersList.206a3b2c.js",revision:"8d97949a868b130603dcd048a69db085"},{url:"assets/UsersLocations.cc755242.js",revision:"322d901a2841ae5e5ccf9c0abe22c13c"},{url:"assets/UsersViews.ea862470.css",revision:"0a491a185933c41e15f884284f642b74"},{url:"assets/UsersViews.f1a5ecda.js",revision:"2561eb5c9288888b4d0efc1e7935b62e"},{url:"css/app.css",revision:"c5bcdff05f4cdb42284b1a650cc27234"},{url:"favicon.ico",revision:"0cff64a4e94fc168fa833ac066d31a55"},{url:"favicon.png",revision:"7e16896ef9e0921a4bcaae587730ce93"},{url:"files/material.png",revision:"a700e98fc6da7c5b8e71a6ee62f5bd94"},{url:"files/suguffie_fb.png",revision:"e844c22f9e85036241d49b9b961d0f4d"},{url:"icons/apple-icon-120x120.png",revision:"bee6bbf3296d4f19574fbfc6e7aba9c4"},{url:"icons/apple-icon-152x152.png",revision:"99106c38427915808c2e8c073a7da50a"},{url:"icons/apple-icon-167x167.png",revision:"ec08d895794839ab8f2451b51196e725"},{url:"icons/apple-icon-180x180.png",revision:"37d4a502d46fce3cf98835ac1c7039c2"},{url:"icons/apple-launch-1125x2436.png",revision:"39bac5f9027803ee179401ced18b846e"},{url:"icons/apple-launch-1242x2208.png",revision:"c9df0e9c379d70ed1837df9dde00e149"},{url:"icons/apple-launch-1242x2688.png",revision:"038683e0bf9aa8f3e0c10653a2bd21c0"},{url:"icons/apple-launch-1536x2048.png",revision:"6c61ae117e32d2cfa6ef47d71842299e"},{url:"icons/apple-launch-1668x2224.png",revision:"d29381a485e5f66df808d87fcd0f8126"},{url:"icons/apple-launch-1668x2388.png",revision:"9d40e5ebea0bc64755bd50fd734402b0"},{url:"icons/apple-launch-2048x2732.png",revision:"a983115051b1ec6ae3b978186f258f80"},{url:"icons/apple-launch-640x1136.png",revision:"6a870459fe1566c088e02ef319aece0c"},{url:"icons/apple-launch-750x1334.png",revision:"357f1e3d77ea7178bf255a2f1f274ed2"},{url:"icons/apple-launch-828x1792.png",revision:"5c3e5351efcfef91da5dd27daa3f6cd2"},{url:"icons/favicon-128x128.png",revision:"b86081b1d1c4f7fdcdee51a856db1cdd"},{url:"icons/favicon-16x16.png",revision:"fdabcb9230134e5863195052fcafb964"},{url:"icons/favicon-32x32.png",revision:"680221ecdaff9fb3c8169dfba74744a1"},{url:"icons/favicon-96x96.png",revision:"98a92a5498c6e587fdb8aeaafc1205b3"},{url:"icons/icon-128x128.png",revision:"b86081b1d1c4f7fdcdee51a856db1cdd"},{url:"icons/icon-192x192.png",revision:"c05c3af7e86868a061bfd126c3a1683a"},{url:"icons/icon-256x256.png",revision:"5917a905a2e530fbd9c45c0527d4f5ba"},{url:"icons/icon-384x384.png",revision:"f502be338416c1674cae55c68eb17c28"},{url:"icons/icon-512x512.png",revision:"be7d38bb70168a51fdcbe80e21777e13"},{url:"icons/ms-icon-144x144.png",revision:"3624345a70a9b0cf40de468751289c61"},{url:"icons/safari-pinned-tab.svg",revision:"2312a9fbdde38872d36c989f33e42eed"},{url:"icons/share-apple.svg",revision:"27143b96b9f94aa7d1181dfbb634e20d"},{url:"index.html",revision:"0060927b5eef16f8ade714f90c2a5a7e"},{url:"index.php",revision:"f9b5759b193d6bcb41ce28e59781fc47"},{url:"manifest.json",revision:"d8ae91b0db604d4829384337453b2e94"},{url:"robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{denylist:[/sw\.js$/,/workbox-(.)*\.js$/]}))}));
