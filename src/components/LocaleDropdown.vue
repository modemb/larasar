<template>
  <div class="q-pa-md">
    <q-btn-dropdown color="*primary" :label="locales[locale]">
      <q-list>
        <q-item
          v-for="(lang, key) in locales" :key="key"
          clickable v-close-popup
          @click.prevent="setLocale(key)"
          ><q-item-section>
            <q-item-label>
              {{ lang }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div><!-- https://quasar.dev/options/app-internationalization#create-language-switcher -->
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { i18n } from 'boot/axios'
// import { i18n } from 'boot/i18n'

export default {
  setup () {
    const $store = useStore()

    return {
      locale: computed(() => $store.getters['config/localeGetter']),
      locales: computed(() => $store.getters['config/localesGetter']),
      setLocale (locale) {
        if (i18n?.global?.locale !== locale) {
          $store.dispatch('config/configAction', { locale })
        } // https://www.askvg.com/tip-enable-new-translator-bubble-ui-in-google-chrome
      }
    }
  }
}
</script>
