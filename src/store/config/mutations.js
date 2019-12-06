export function configMutation (state, { config, locale }) {
  // console.log(config.locales, 'configMutation')
  state.locale = locale
  state.locales = config.locales
  state.githubAuth = config.githubAuth
}
