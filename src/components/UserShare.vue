<template>
  <q-dialog v-model="share"><!--== TagShare  =============-->
    <q-card class="my-card text-black">
      <q-card-section class="bg-primary text-white">
        <q-btn dense round color="primary" class="float-right" icon="close" v-close-popup />
        <!-- <div class="text-h6">{{$t('share_post')}}</div> -->
        <div class="text-h6">{{shareData?.banner||''}}</div>
      </q-card-section>

      <template v-if="!contacts?.length">
        <q-btn color="primary" class="q-ma-sm q-dark" icon="fab fa-facebook"
          data-href="https://suguffie.com/post/1" target="_blank"
          data-layout="button_count" data-size="small" type="a" :label="$t('share_on_facebook')"
          :href="`https://www.facebook.com/sharer/sharer.php?u=https://suguffie.com/${path}`"
        /><!-- https://developers.facebook.com/docs/plugins/share-button/ -->

        <q-btn color="primary" class="q-ma-sm q-dark" icon="fas fa-link" :label="copyLink" @click.stop.prevent="copy" />
      </template><!-- TagShare withBrowser -->

      <q-card-section v-for="(contact, key) in contacts" :key="key">
        <!-- <div class="text-h6">{{JSON.stringify(contact.name).replaceAll('[','').replaceAll(']','')}}</div> fixTS-->
        <q-btn type="a" class="q-ma-md" icon="fas fa-envelope" target="_blank"
          _:href="`mailto:${JSON.stringify(contact.email).replaceAll('[','').replaceAll(']','')}?&subject=${title}&body=Checkout ${copyLink}`"
        /><!-- href="mailto:email1, email1?cc=email3&subject=Feedback&body=Message`" -->
        <q-btn type="a" class="q-ma-md" icon="fas fa-sms"
          _:href="`sms://${JSON.stringify(contact.tel).replaceAll('[','').replaceAll(']','')}?body=${copyLink}`"
        /><!-- <a v-if="ipDebug" href="sms://+14035550185?body=I%27m%20interested%20in%20your%20product.%20Please%20contact%20me.">Send SMS message</a>
        <div v-if="ipDebug">{{JSON.stringify(contact.tel).replaceAll('[','').replaceAll(']','')}}</div>.replaceAll('-','/') -->
      </q-card-section><!-- TagShare AddressBook -->

    </q-card><!-- ShareModule -->
  </q-dialog><!--================= TagShare End  =========-->

  <q-dialog v-model="reports"><!-- Reports PopUp ============-->
    <q-card class="my-card text-black">
      <q-card-section class="bg-primary text-white">
        <q-btn dense round class="float-right" icon="close" v-close-popup />
        <div class="text-h6">{{$t('reports')}}</div>
      </q-card-section>
      <Reports :users_reports="users_reports" />
    </q-card><!-- TagReports: UsersReportsModule -->
  </q-dialog><!--================== Reports PopUp End ========-->

  <template v-if="price>0||true"><!-- -->

    <q-btn class="q-ma-sm"
      @click.prevent="usersReports"
      :disabled="shareData?.price" dense
      :color="shareData?.price?'':'positive'"
      :label="shareData?.price ? Number(price).toLocaleString(locale, { style: 'currency', currency }) :
                         /* Post Price ^^^ / User Gain -> */ cy(xRate(price))"
    /><!--  -->

  </template><!-- <q-btn flat icon="fas fa-dollar-sign" :label="price" /> -->
  <!-- <q-btn flat round icon="fas fa-share-alt" icon-right="fas fa-sack-dollar" id="button" />TagShare: UserModule -->
  <q-btn dense flat round icon="fas fa-share-alt" icon-right="fas fa-sack-dollar" @click="shareT" /><!-- TagShare: UserModule -->
  <q-btn dense flat round icon="fas fa-address-book" @click="getContacts" v-if="addressBook" />
  <q-btn dense flat round icon="fas fa-question" v-if="shareData?.tooltip">
    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
      {{ $t('To gain users and earn money, you can share your affiliate link. When new users sign up using this link, you\'ll earn a percentage of their spending.') }}<br>
      {{ shareData?.tooltip||'' }} {{ 'suguffie.com/'+(auth?.name||'') }}
    </q-tooltip><!-- TagShare: ShareModule - Navigator Share -->
  </q-btn>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue'
import { copyToClipboard } from 'quasar'
import { capacitor } from './Functions'
import { useCrudStore } from 'stores/crud'
import { i18n, api, cy, xRate, mobileApp } from 'boot/axios'
import Reports from './UserReports.vue'

/**
 * Tags: TagShare
 *
 * @to CategoryController - UserController
 */
export default {
  components: {
    Reports
  },
  props: ['shareData'],
  setup (props) {
    const $t = i18n?.global?.t
    const store = useCrudStore()
    const { notifyAction } = store
    const copyLink = computed(() => !props.shareData||props.shareData?.url)
    const contacts = ref<unknown[]>([]) // TagSharePost
    const share = ref(false)
    const reports = ref(false)
    const users_reports = ref([])

    const ipDebug = computed(() => store.configGetter?.ipDebug)
    const auth = computed(() => store.authGetter)

    onMounted(() => {
      const btn = document.querySelector('#button')

      // Must be triggered some kind of "user activation"
      if (btn) btn.addEventListener('click', async () => {
        // @vite-ignore
        // if (mobile) return import('@capacitor/share')
        //   .catch(e => notifyAction({error: 'modulePath', e}))
        //   .then(({ Share }) => Share.share(props.shareData))
          // .catch(e => Promise.reject('Module ' + modulePath + ' not found.'))
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import

        try { // resultPara.textContent = $t('Shared Successfully')
          // await (capacitor()?.Share?capacitor().Share:navigator)
          //  .share(props.shareData)
          await (('share' in navigator)?navigator:capacitor().Share)
           .share(props.shareData)
        } catch (e) { // resultPara.textContent = 'Error: ' + err
          share.value = !mobileApp // notifyAction({error: 'ShareErr', e})
        } // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
      }) // TagShare: UserModule - Navigator Share
    })

    return {
      users_reports,
      contacts, reports, auth,
      copyLink, share, xRate, cy,
      addressBook: 'contacts' in navigator,
      currency: props.shareData?.currency_code||'USD',
      title: props.shareData?.title||'',
      // title: $t(props.shareData?.title||props.shareData?.post_title||''),
      path: props.shareData?.id?('post/'+props.shareData?.id):(auth.value?.name||''),

      locale: computed(() => store['configGetter']?.locale),
      price: computed(() => props.shareData?.price||props.shareData?.credit),

      usersReports() {
        if (ipDebug.value) api({
          url: 'api/users/reports',
          method: 'get', data: {
            users_reports: true,
            id: auth.value?.id }
        }).then(({ data }) => {
          users_reports.value = data
          reports.value = true
        }).catch(e => notifyAction({error: 'userReports', e}))
      }, // TagReports: UsersReportsModule

      async shareT() {
        // @vite-ignore
        // if (mobile) return import('@capacitor/share')
        //   .catch(e => notifyAction({error: 'modulePath', e}))
        //   .then(({ Share }) => Share.share(props.shareData))
          // .catch(e => Promise.reject('Module ' + modulePath + ' not found.'))
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import

        try { // resultPara.textContent = $t('Shared Successfully')
          // await (capacitor()?.Share?capacitor().Share:navigator)
          //  .share(props.shareData)
          await (('share' in navigator)?navigator:capacitor().Share)
          .share(props.shareData)
        } catch (e) { // resultPara.textContent = 'Error: ' + err
          share.value = !mobileApp // notifyAction({error: 'ShareErr', e})
        } // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
      }, // TagShare: UserModule - Navigator Share
      copy() {
        copyToClipboard(copyLink.value).then(() => notifyAction({success: $t('copy_successful')}))
          .catch(e => notifyAction({error: $t('copy_unsuccessful'), e}))
      }, // TagCopyLink: ShareModule
      async checkProperties() {
        // const supportedProperties = await navigator.contacts.getProperties()
        // if (supportedProperties.includes('name')) {
        //   // run code for name support
        // } if (supportedProperties.includes('email')) {
        //   // run code for email support
        // } if (supportedProperties.includes('tel')) {
        //   // run code for telephone number support
        // } if (supportedProperties.includes('address')) {
        //   // run code for address support
        // } if (supportedProperties.includes('icon')) {
        //   // run code for avatar support
        // } fixTS
      }, // TagShare: ShareModule - Checking for Supported Properties - NotInUse
      async getContacts() {
        const props = ['name', 'email', 'tel', 'address', 'icon']
        const opts = { multiple: true }; try { // Contact_Picker_API
          // contacts.value = [...new Set(await navigator.contacts.select(props, opts))] fixTS
          share.value = !!contacts.value?.length // https://wicg.github.io/contact-api/spec/#contacts-manager

        } catch (e) { // https://web.dev/contact-picker/
          // notifyAction({error: 'contactsSharedPostsAction', e}) // Handle any errors here.
        } // https://developer.mozilla.org/en-US/docs/Web/API/Contact_Picker_API
      } // TagShare: ShareModule - AddressBook - Selecting Contacts
    }
  }
}
</script>
