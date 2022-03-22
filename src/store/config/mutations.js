export function configMutation (state, { config, payload }) {
  // console.log(config.locales, 'configMutation')
  state.locale = payload.locale
  state.locales = config.locales
  state.laravel = config.laravel
  state.ipDebug = config.ipDebug
  state.appName = config.appName
  state.sanctumApi = payload.sanctumApi
  state.vapidPublicKey = config.vapidPublicKey
}
