export function configMutation (state, { config, locale }) {
  // console.log(config.locales, 'configMutation')
  state.locale = locale
  state.locales = config.locales
<<<<<<< HEAD
  state.githubAuth = config.githubAuth
=======
  state.services = config.services
  state.appName = config.appName
>>>>>>> modemb/dev
}
