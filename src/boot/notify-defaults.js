import { Notify } from 'quasar'

// "async" is optional
export default async ({ app, router, Vue }) => {
  Notify.setDefaults({
    position: 'top-right',
    timeout: 2500,
    textColor: 'white',
    actions: [{ icon: 'close', color: 'white' }]
  })
}
