import { Cookies } from 'quasar'
import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';

export type MessageLanguages = keyof typeof messages;
// Type-define 'en' as the master schema for the resource
export type MessageSchema = typeof messages['en']

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-interface */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}

const i18n = createI18n({
  locale: Cookies.get('locale')||'fr',
  fallbackLocale: 'fr', // set fallback locale
  legacy: false,
  globalInjection: true,
  messages,
}) // https://quasar.dev/start/upgrade-guide#vue-i18n-v9

/* eslint-enable @typescript-eslint/no-empty-interface */

export default boot(({ app }) => {
  app.use(i18n) // Set i18n instance on app
}) // https://vue-i18n.intlify.dev/guide/essentials/scope.html#locale-changing

export { i18n }
