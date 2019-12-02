export function configMutation (state, { config, locale }) {
  // console.log(config.locales, 'configMutation')
  state.locale = locale
  state.locales = config.locales
<<<<<<< HEAD
=======
  state.githubAuth = config.githubAuth
>>>>>>> modemb/dev
}
