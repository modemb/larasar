/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.conf.js > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/

<<<<<<< HEAD
=======
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'

>>>>>>> modemb/dev
import '@quasar/extras/roboto-font/roboto-font.css'

import '@quasar/extras/material-icons/material-icons.css'




// We load Quasar stylesheet file
import 'quasar/dist/quasar.sass'




import 'src/css/app.sass'


import createApp from './app.js'
import Vue from 'vue'



import qboot_Booti18n from 'boot/i18n'

import qboot_Bootaxios from 'boot/axios'


// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {
  return new Promise(async (resolve, reject) => {
    const { app, store, router } = await createApp(context)

    
    let routeUnchanged = true
    const redirect = url => {
      routeUnchanged = false
      reject({ url })
    }

    const bootFiles = [qboot_Booti18n,qboot_Bootaxios]
    for (let i = 0; routeUnchanged === true && i < bootFiles.length; i++) {
      if (typeof bootFiles[i] !== 'function') {
        continue
      }

      try {
        await bootFiles[i]({
          app,
          router,
          store,
          Vue,
          ssrContext: context,
          redirect,
          urlPath: context.url
        })
      }
      catch (err) {
        reject(err)
        return
      }
    }

    if (routeUnchanged === false) {
      return
    }
    

    const
      { url } = context,
      { fullPath } = router.resolve(url).route

    if (fullPath !== url) {
      return reject({ url: fullPath })
    }

    // set router's location
    router.push(url)

    // wait until router has resolved possible async hooks
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
        .map(m => m.options /* Vue.extend() */ || m)

      // no matched routes
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      

      context.state = store.state

      
      const App = new Vue(app)
      context.$getMetaHTML = App.$getMetaHTML(App)
      resolve(App)
      

      
    }, reject)
  })
}
