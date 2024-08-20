// import { Share } from '@capacitor/share'
// import { Browser } from '@capacitor/browser'
// import { Geolocation } from '@capacitor/geolocation'
// import { Capacitor, CapacitorHttp } from '@capacitor/core'
// import { Camera, CameraResultType } from '@capacitor/camera'
// import { PushNotifications } from '@capacitor/push-notifications'
// import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'

// const Comp: any = async (component: string) =>
//   await import(/* @vite-ignore */ `@capacitor/${component}`)

// const { Share } = Comp('share')
// const { Browser } = Comp('browser')
// const { Geolocation } = Comp('geolocation')
// const { Capacitor, CapacitorHttp } = Comp('core')
// const { Camera, CameraResultType } = Comp('camera')
// const { PushNotifications } = Comp('push-notifications')
// const { Filesystem, Directory, Encoding } = Comp('filesystem')

export function capacitor() {
  // if(Capacitor.isNativePlatform())
  try { return {
    Share, Browser, Geolocation, Capacitor,
    Camera, CameraResultType, CapacitorHttp
  } } catch (e) { return {} }
} // https://github.com/vitejs/vite/issues/6393

// if(Capacitor.isNativePlatform()) {
//   // Platform is mobile
// } else {
//   // Platform is not mobile
// } //https://github.com/vitejs/vite/issues/11377

// const Comp = (component: string) => import(/* @vite-ignore */ component)
// const Comp = (component: string) => import(component)
// const { Camera, CameraResultType } = await Comp('@capacitor/camera')
// const { Camera, CameraResultType } = await import(/* @vite-ignore */ '@capacitor/camera')

// const Comp = (component: string) => import(/* @vite-ignore */ `@capacitor/${component}`)
// const Comp = async (component: string) => import(/* @vite-ignore */ `@capacitor/${component}`)
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import

// vite.config.js
// import { defineConfig } from "vite"
// import viteIgnoreStaticImport from "vite-plugin-ignore-static-import"

// export default defineConfig({
//   plugins: [
//     viteIgnoreStaticImport(['@capacitor/share'])
//   ]
// }) https://github.com/vitejs/vite/issues/1007


export const reloadPosts = [
  'my_posts', 'expired_posts', 'trashed_posts', 'all_posts', 'users_posts',
  'gallery', 'flag', 'galleryGetter', 'favoritesGetter', 'flagGetter'
] // NotInUse Replaced with reloadApp

export function dateDiffInDays(date1: string, date2: string) {
  // export function dateDiffInDays(date1: string | number | Date, date2: string | number | Date) {
  const dt1 = new Date(date1); const dt2 = new Date(date2)
  return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
    Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24))
} // Date Diff In Days

export function printEl(el: string) {

  const getEl: HTMLElement | null = document.getElementById(el)
  const w = window.open();
  // const w = window.open('', 'PRINT', 'height=800,width=1000');

  w?.document.write('<html><head><title>' + document.title  + '</title>')
  w?.document.write('</head><body>')
  w?.document.write('<h1>' + document.title  + '</h1>')
  w?.document.write(getEl?getEl.innerHTML:'')
  w?.document.write('</body></html>')

  w?.document.close(); // necessary for IE >= 10
  w?.focus(); // necessary for IE >= 10*/

  w?.print(); // w.close();

  return true;
}

export function pwaInstall(notifyAction: (arg0: { error?: string; e?: unknown; message?: string }) => void) {

  // ================================================================
  // Initialize deferredPrompt for use later to show browser install prompt.
  // let deferredPrompt: Event | null
  // const divInstall: HTMLElement | null = document.getElementById("installContainer")
  const btnInstall: HTMLElement | null = document.getElementById('btnInstall')

  // ===================================
  // const userAgent = navigator.userAgent
  // const android = userAgent.includes('Android')&&!userAgent.includes('modembAndroid')
  // const ios = userAgent.includes('iPhone')&&!userAgent.includes('modembIos')

  // const url = ios ? 'https://itunes.apple.com/appdir' :
  //     (android ? 'https://play.google.com/store/apps' : '')

  // if (url) { // https://www.youtube.com/watch?v=SCl_rdp0Wik&ab_channel=AndroidDevelopers
  //   setTimeout(() => window.location = url, 25)
  //   window.location = 'appname://org.modemb.suguffie.app'
  // } // https://findnerd.com/list/view/How-to-Detect-if-an-app-is-installed-in-iOS-or-Android-Using-Javascript-and-Deep-Linking/4287/
  // ===============================

  /**
   * The `beforeinstallprompt` event won't fire if the page is served over HTTP.
   */
  if (window.location.protocol === 'http:') {
    // const requireHTTPS = document.getElementById('requireHTTPS')
    // const link = requireHTTPS.querySelector('a')
    // link.href = window.location.href.replace('http://', 'https://')
    // requireHTTPS.classList.remove('hidden')
    notifyAction({error: 'requireHTTPS', e:''})
  } // Warn the page must be served over HTTPS

  if (window.self !== window.top) {
    // const requireTopLevel = document.getElementById('requireTopLevel')
    // const link = requireTopLevel.querySelector('a')
    // link.href = window.location.href
    // requireTopLevel.classList.remove('hidden')
    notifyAction({error: 'requireTopLevel', e:''})
  } // Warn the page must not be served in an iframe.

  window.addEventListener('beforeinstallprompt', e => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    // Stash the event so it can be triggered later.
    window.deferredPrompt = e
    // Update UI notify the user they can install the PWA
    btnInstall?.classList.remove('hidden') // showInstallPromotion()
    // Optionally, send analytics event that PWA install promo was shown.
    // console.log('\'beforeinstallprompt\' event was fired.')
    // notifyAction({message: 'beforeinstallprompt event was fired.'})
  }) // https://github.com/quasarframework/quasar/tree/dev/docs/src
  btnInstall?.addEventListener('click', async () => {
    // async function showInstallPromotion() {
    const promptEvent: Event | any = window.deferredPrompt
    // Hide the app provided install promotion
    btnInstall?.classList.add('hidden') // hideInstallPromotion()
    // if (confirm('Install App') === true)
    // notifyAction({error: 'promptEvent' ,e: 'Show the install prompt'})
    promptEvent?.prompt().catch((e: unknown) => notifyAction({error: 'promptEvent', e}))
    // Wait for the user to respond to the prompt
    const { outcome } = await promptEvent?.userChoice
    // Optionally, send analytics event with outcome of user choice
    notifyAction({message: `User response to the install prompt: ${outcome}`})
    // We've used the prompt, and can't use it again, throw it away
    window.deferredPrompt = null
  }) // https://developer.chrome.com/blog/app-install-banners-native
  window.addEventListener('appinstalled', () => {
    // Hide the app-provided install promotion
    // hideInstallPromotion()
    // Clear the deferredPrompt so it can be garbage collected
    window.deferredPrompt = null
    // Optionally, send analytics event to indicate successful install
    console.log('PWA was installed')
    notifyAction({message: 'PWA was installed'})
  })
  window.matchMedia('(display-mode: standalone)').addEventListener('change', e => {
    const displayMode = e.matches?'standalone':'browser'
    // Log display mode change to analytics
    console.log('DISPLAY_MODE_CHANGED', displayMode);
    notifyAction({message: displayMode})
  })//https://web.dev/customize-install/
} // https://play.google.com/store/apps/details?id=org.modemb.suguffie.app

// ======================Browser Push Notifications===========================

export function initializePush() {
  navigator.serviceWorker.ready.then(function(swReg) {
    swReg.pushManager.getSubscription().then(function(subscription) {
      if (subscription === null) {
        // Subscribe the user
        swReg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.VAPID_PUBLIC_KEY)
          // applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        }).then(function(newSubscription) {
          // Send the subscription details to the server
          fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(newSubscription),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        }).catch(function(e) {
          console.error('Unable to subscribe to push', e);
        })
      }
    })
  })
} // Subscribing to Push Notifications

function urlBase64ToUint8Array(base64String: string | any[]) {
  // Convert the URL-safe base64 string to a standard base64 string
  const padding = '='.repeat((4 - (base64String?.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  // Decode the base64 string
  const rawData = atob(base64)

  // Create a Uint8Array from the decoded base64 string
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

self.addEventListener('push', function(event: Event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
}) // Handling Push Events in the Service Worker

// =======================Browser Push Notifications End==============================

// =======================Mobil Push Notifications====================================

export const addListeners = async () => {
  await PushNotifications.addListener('registration', (token: { value: unknown }) => {
    console.info('Registration token: ', token.value);
  });

  await PushNotifications.addListener('registrationError', (err: { error: unknown }) => {
    console.error('Registration error: ', err.error);
  });

  await PushNotifications.addListener('pushNotificationReceived', (notification: unknown) => {
    console.log('Push notification received: ', notification);
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', (notification: { actionId: unknown; inputValue: unknown }) => {
    console.log('Push notification action performed', notification.actionId, notification.inputValue);
  });
} // https://capacitorjs.com/docs/apis/push-notifications

export const registerNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions!');
  }

  await PushNotifications.register();
} // https://developer.apple.com/documentation/usernotifications/registering_your_app_with_apns

export const getDeliveredNotifications = async () => {
  const notificationList = await PushNotifications.getDeliveredNotifications();
  console.log('delivered notifications', notificationList);
} // https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/pushing_background_updates_to_your_app

// addListeners(); registerNotifications(); getDeliveredNotifications()

// =======================Mobil Push Notifications End=================================================

export function onRequest (props: { pagination: { page: number; rowsPerPage: number; sortBy: string; descending: boolean }; filter?: string; rows: any[] }) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  const filter = props.filter; //galleryAction({load: true})
  const rows = props.rows // Original Rows
  const Rows: any[] = []

  // loading.value = true

  function fetchFromServer (startRow: number, count: number, filter: string, sortBy: string | number, descending: boolean) {
    const data: any[] = filter
      ? rows.filter((row: { name: string | any[] }) => row.name.includes(filter))
      : rows.slice();

    if (sortBy) {
      const sortFn = sortBy === 'desc'
        ? (descending
            ? (a: { name: number }, b: { name: number }) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
            : (a: { name: number }, b: { name: number }) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
          )
        : (descending
            ? (a: { [x: string]: string }, b: { [x: string]: string }) => (parseFloat(b[ sortBy ]) - parseFloat(a[ sortBy ]))
            : (a: { [x: string]: string }, b: { [x: string]: string }) => (parseFloat(a[ sortBy ]) - parseFloat(b[ sortBy ]))
          )
      data.sort(sortFn) // handle sortBy
    } return data.slice(startRow, startRow + count)
  } // emulate ajax call // SELECT * FROM ... WHERE...LIMIT...

  function getRowsNumberCount (filter: string) {
    let count = 0
    if (!filter) return rows.length
    rows.forEach((treat: { name: string | string[] }) => {
      if (treat.name.includes(filter)) ++count
    }); return count
  } // emulate 'SELECT count(*) FROM ...WHERE...'

  return setTimeout(() => {
    // update rowsCount with appropriate value
    // pagination.value.rowsNumber = getRowsNumberCount(filter)

    // get all rows if "All" (0) is selected
    const fetchCount = rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage

    const startRow = (page - 1) * rowsPerPage // calculate starting row of data

    // fetch data from "server"
    const returnedData = fetchFromServer(startRow, fetchCount, filter, sortBy, descending)

    Rows.splice(0, Rows.length, ...returnedData) // clear out existing data and add new

    // loading.value = false // ...and turn of loading indicator

    // don't forget to update local pagination object
    // pagination.value.page = page
    // pagination.value.rowsPerPage = rowsPerPage
    // pagination.value.sortBy = sortBy
    // pagination.value.descending = descending
    return { page, rowsPerPage, sortBy, descending }
  }, 0) // emulate server

} // https://quasar.dev/vue-components/table#example--synchronizing-with-server

// https://dev.to/soyleninjs/3-ways-to-remove-duplicates-in-an-array-in-javascript-259o
// export const findDuplicates = (array: unknown[]) => array?.filter((item, index) => array?.indexOf(item) !== index)
// const duplicateElements = findDuplicates(test);//https://flexiple.com/javascript/find-duplicates-javascript-array/#section3

export const videoFileBool = (file: {
  filter: (arg0: (f: string) => boolean) => string[];
  endsWith: (arg0: string) => unknown
}) => { // File Mime Type video/*

  try { // Get Video File Extension Within The Array
    const e = file.filter((f: string) =>
      f.endsWith('.mp4') || f.endsWith('.avi')||
      f.endsWith('.mov') || f.endsWith('.webm'))

    if (e.length) return true

  } catch (error) { }

  try { // Get Video File Extension
    const extension = ['.mp4', '.avi', '.mov', '.webm', '.mkv']
      .filter(type => file.endsWith(type))
      return file.endsWith(extension[0])
  } catch (error) { } return false

} // TagVideoFileBool: FilesModule

export const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl // Uri - DataUrl - Base64
  }); return image.dataUrl // webPath - base64String - dataUrl

  // image.webPath will contain a path that can be set as an image src.
  // You can access the original file using image.path, which can be
  // passed to the Filesystem API to read the raw data of the image,
  // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  const imageUrl = image.webPath

  // Can be set to the src of an image now
  SVGImageElement.src = imageUrl
  HTMLImageElement.src = imageUrl
  // imageElement.src = imageUrl
}

export const writeSecretFile = async () => {
  await Filesystem.writeFile({
    path: 'secrets/text.txt',
    data: 'This is a test',
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
  })
} // https://capacitorjs.com/docs/apis/camera

export const readSecretFile = async () => {
  const contents = await Filesystem.readFile({
    path: 'secrets/text.txt',
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
  });

  console.log('secrets:', contents);
}

export const deleteSecretFile = async () => {
  await Filesystem.deleteFile({
    path: 'secrets/text.txt',
    directory: Directory.Documents,
  });
}

export const readFilePath = async () => {
  // Here's an example of reading a file with a full file path. Use this to
  // read binary data (base64 encoded) from plugins that return File URIs, such as
  // the Camera.
  const contents = await Filesystem.readFile({
    path: 'file:///var/mobile/Containers/Data/Application/22A433FD-D82D-4989-8BE6-9FC49DEA20BB/Documents/text.txt',
  });

  console.log('data:', contents);return contents
}
