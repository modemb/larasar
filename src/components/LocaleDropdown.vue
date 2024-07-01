<template>
  <div class="q-ma-sm">
    <!-- <select v-model="$i18n.locale">
      <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
    </select> -->
    <q-btn-dropdown dense color="primary" :label="locales?.[locale]">
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
import { Cookies } from 'quasar'
import { computed } from 'vue'
import { useCrudStore } from 'stores/crud'
import { i18n, configAction, mSession } from 'boot/axios'

export default {
  setup () {
    const store = useCrudStore()
    // const { crudAction, notifyAction } = store

    return {
      locale: computed(() => store['configGetter']?.locale),//computed(() => $store.getters['config/localeGetter']),
      locales: computed(() => store['configGetter']?.locales),//computed(() => $store.getters['config/localesGetter']),
      setLocale(locale) {
        Cookies.set('locale', i18n.global.locale.value = locale, { expires: 365 })
        mSession(['reloadApp']); configAction()
      }
    } // https://www.askvg.com/tip-enable-new-translator-bubble-ui-in-google-chrome
  }
}
</script>
