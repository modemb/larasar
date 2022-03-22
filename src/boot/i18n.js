import { boot } from 'quasar/wrappers'
import { Quasar } from 'quasar'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

const i18n = createI18n({
  // legacy: false, // you must set `false`, to use Composition API
  locale: Quasar.lang.getLocale(), // set locale
  // fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
})// https://quasar.dev/options/app-internationalization#setting-up-translation-blocks-in-your-sfcs

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n)
})

export { i18n }
