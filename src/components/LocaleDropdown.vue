<template>
  <div class="q-pa-md">
    <q-btn-dropdown color="primary" :label="locales[locale]">
      <q-list>
        <q-item
          v-for="(value, key) in locales" :key="key"
          clickable v-close-popup
          @click.prevent="setLocale(key)"
          >
          <q-item-section>
            <q-item-label>{{ value }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { loadMessages } from '~/plugins/i18n'

export default {
  computed: mapGetters({
    locale: 'config/localeGetter',
    locales: 'config/localesGetter'
  }),

  methods: {
    setLocale (locale) {
      // console.log(this.$i18n.locale, locale)
      if (this.$i18n.locale !== locale) {
        // loadMessages(locale)

        this.$store.dispatch('config/configAction', locale)
      }
    }
  }
}
</script>
