<template>
  <q-dialog v-model="share"><!-- TagShare  =============-->
    <q-card class="my-card text-black">
      <q-card-section class="bg-primary text-white">
        <q-btn color="primary" text-color="white" class="float-right" dense round icon="close" v-close-popup />
        <div class="text-h6">{{$t('share_post')}}</div>
      </q-card-section>

      <template v-if="desktop">
        <q-btn icon="fab fa-facebook" target="_blank"
          data-href="https://suguffie.com/post/1" class="q-ma-sm"
          data-layout="button_count" data-size="small" type="a" :label="$t('share_on_facebook')"
          :href="`https://www.facebook.com/sharer/sharer.php?u=https://suguffie.com/post/${param_id}`"
        /><!-- https://developers.facebook.com/docs/plugins/share-button/ -->

        <q-btn icon="fas fa-link" :label="copyLink" class="q-ma-sm" @click.stop.prevent="copy" />
        <!-- <input type="hidden" id="link" :value="copyLink">TagCopyLink: ShareModule -->
      </template>

      <q-card-section v-for="(contact, key) in contacts" :key="key">
        <div class="text-h6">{{JSON.stringify(contact.name).replaceAll('[','').replaceAll(']','')}}</div>
        <q-btn type="a" class="*col-lg-3 q-ma-md" icon="fas fa-envelope" target="_blank"
          :href="`mailto:${JSON.stringify(contact.email).replaceAll('[','').replaceAll(']','')}?&subject=${title}&body=Checkout ${copyLink}`"
        /><!-- href="mailto:email1, email1?cc=email3&subject=Feedback&body=Message`" -->
        <q-btn type="a" class="q-ma-md" icon="fas fa-sms"
          :href="`sms://${JSON.stringify(contact.tel).replaceAll('[','').replaceAll(']','')}?body=${copyLink}`"
        /><!-- <a v-if="ipDebug" href="sms://+14035550185?body=I%27m%20interested%20in%20your%20product.%20Please%20contact%20me.">Send SMS message</a>
        <div v-if="ipDebug">{{JSON.stringify(contact.tel).replaceAll('[','').replaceAll(']','')}}</div>.replaceAll('-','/') -->
      </q-card-section>

    </q-card><!-- ShareModule -->
  </q-dialog><!--=================== TagShare End  =========-->

  <q-btn flat icon="fas fa-dollar-sign" :label="price" />
  <q-btn flat round icon="fas fa-share-alt" id="button" /><!-- TagShare: UserModule -->
  <q-btn flat round icon="fas fa-address-book" @click="getContacts" />
  <q-btn flat round icon="fas fa-question" v-if="shareData.tooltip">
    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
      {{shareData.tooltip}}
    </q-tooltip><!-- TagShare: ShareModule - Navigator Share -->
  </q-btn>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import { i18n, notifyAction, ipDebug } from 'boot/axios'
// import { i18n } from 'boot/i18n'
// import postLocation from './Location'
// import Wish from './Wish'
// import Files from './Files'

/**
 * Tags: TagShare
 *
 * @from CategoryController
 */
export default {
  props: ['shareData'],
  setup (props) {
    // const $route = useRoute()
    // const $router = useRouter()
    const $q = useQuasar()
    const $t = i18n?.global?.t
    const copyLink = ref(!props.shareData||props.shareData.url)
    const contacts = ref(null) // TagSharePost
    const share =ref(null)

    // const ipDebug = computed(() => $store.getters['config/ipDebugGetter'])

    onMounted(() => {
      const btn = document.querySelector('#button')
      // Must be triggered some kind of "user activation"
      if (btn) btn.addEventListener('click', async () => {
        try { // resultPara.textContent = $t('Shared Successfully')
          await navigator.share(props.shareData)
        } catch (e) { // resultPara.textContent = 'Error: ' + err
          // notifyAction({error: 'ShareUsersAtsAction', e})
        } // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
      }) // TagShare: UserModule - Navigator Share
    })

    return {
      ipDebug,
      contacts,
      copyLink,
      desktop: $q.platform.is.desktop,
      price: props.shareData.price||props.shareData.gain,
      title: props.shareData.title||props.shareData.post_title,
      share,
      copy () {
        copyToClipboard(copyLink.value).then(() => notifyAction({message: $t('copy_successful')}))
          .catch(e => notifyAction({error: $t('copy_unsuccessful'), e}))
      }, // TagCopyLink: ShareModule
      async checkProperties () {
        const supportedProperties = await navigator.contacts.getProperties()
        if (supportedProperties.includes('name')) {
          // run code for name support
        }
        if (supportedProperties.includes('email')) {
          // run code for email support
        }
        if (supportedProperties.includes('tel')) {
          // run code for telephone number support
        }
        if (supportedProperties.includes('address')) {
          // run code for address support
        }
        if (supportedProperties.includes('icon')) {
          // run code for avatar support
        }
      }, // TagShare: ShareModule - Checking for Supported Properties - NotInUse
      async getContacts () {
        const props = ['name', 'email', 'tel', 'address', 'icon']
        const opts = { multiple: true }; try { // Contact_Picker_API
          share.value = true // https://wicg.github.io/contact-api/spec/#contacts-manager
          contacts.value = [...new Set(await navigator.contacts.select(props, opts))]

        } catch (e) { // https://web.dev/contact-picker/
          // notifyAction({error: 'contactsSharedPostsAction', e}) // Handle any errors here.
        } // https://developer.mozilla.org/en-US/docs/Web/API/Contact_Picker_API
      } // TagShare: ShareModule - Selecting Contacts
    }
  }
}
</script>
