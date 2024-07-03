<template>
  <q-dialog v-model="location"><!-- Location PopUp ============-->
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <q-btn class="float-right" dense round icon="close" v-close-popup />
        <div class="text-h6">{{$t('search_in_location')}}</div>
      </q-card-section>
      <Location />
    </q-card><!-- TagPostLocation: LocationModule -->
  </q-dialog><!--================== TagApp: LocationModule ====-->
  <q-layout view="lHr LpR lFr">
    <q-pull-to-refresh @refresh="refresh"><!-- Header ===========-->
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <!-- <q-banner inline-actions rounded class="bg-primary text-white" v-if="modembIos"/> -->
        <q-banner inline-actions rounded class="bg-red text-white" v-if="!auth&&banner">
          {{$t('Register And Get 250 Suguffiès Dinar')}}

          <template v-slot:action>
            <q-btn :label="$t('register')" to="/register" class="q-mr-md" />
            <q-btn round icon="close" @click="banner = false" />
          </template>
        </q-banner>
        <q-toolbar>
          <q-btn
            dense round
            icon="menu" title="menu"
            behavior="mobile" :class="desktop || 'q-mr-sm'"
            @click="rightDrawer = !rightDrawer"
          /><!-- :class="desktop || 'q-mr-sm'" -->

          <q-toolbar-title>
            <q-btn _dense class="q-ma-xs"
              :text-color="path=='/'?'orange':color"
              :label="appName" to="/"
              icon="fas fa-store"
            ><q-badge color="orange" text-color="black" :label="locale" floating v-if="locale" />
            </q-btn><!-- Logo v-if="desktop" icon-right-->
          </q-toolbar-title>

          <!-- <q-btn id="btnInstall" class="hidden q-ma-sm" :label="$t('Install App')" /> -->

          <template v-if="desktop">

            <q-input clearable outlined :class="'col-6 search bg-'+(darkMode?'dark':'white')" @keyup.enter="search(search_posts)" v-model="search_posts" :label="$t('search_posts')">

              <q-select
                filled
                style="width: 100%"
                _class="col-lg-5"
                v-model="category"
                :options="options"
                :label="$t('all_categories')"
                color="teal"
                clearable
                options-selected-class="text-deep-orange"
              ><!-- TagSelectCategory: SearchModule -->
                <template v-slot:option="scope">
                  <q-item
                    v-bind="scope.itemProps"
                    _v-on="scope.itemEvents"
                  >
                    <q-item-section avatar>
                      <q-icon :name="scope.opt.icon" />
                    </q-item-section>
                    <q-item-section>
                      <!-- <q-item-label v-html="scope.opt.label" /> -->
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select><!--  -->
              <template v-slot:append >
                <!-- <div> -->
                  <q-btn icon="fas fa-map-pin"
                    color="primary" class="q-ma-sm"
                    :loading="loader" :label="place"
                    @click="location = true" dense
                  /><!-- TagPostLocation: LocationModule -->
                  <q-btn
                    flat :loading="loader"
                    icon="fas fa-search"
                    @click.prevent="search(search_posts)"
                  />
                <!-- </div> -->
              </template>
            </q-input><!-- TagSearch: SearchModule -->

            <q-btn class="q-ma-md"
              :icon="postPage?'fas fa-plus':'fas fa-plus-circle'"
              :to="postPage?'/post':'/post?go=categories'"
              :label="$t('add_post')"
            /><!-- TagAddPost TagRadioCategory: CategoryModule To Post.vue -->

          </template>
          <template v-else>

            <q-btn color="primary" class="q-ma-sm" icon="fas fa-user"
              :text-color="path=='/profile'?'orange':color"
              to="/profile" flat dense v-if="auth"
            />

            <q-btn flat round icon="fas fa-camera"
              _:icon="postPage?'fas fa-plus':'fas fa-plus-circle'"
              :title="$t('add_post')" @_click="addPost($t('add_post'))"
              :to="postPage?'/post':'/post?go=categories'"
            /><!-- TagAddPost: MobilModule - TagRadioCategory: CategoryModule To Post.vue -->

          </template>

          <Notifications v-if="auth" /><!-- TagNotification -->
          <ShoppingCart v-if="auth" />

          <q-btn
            dense round :flat="!desktop"
            :title="desktop?'menu':'search'"
            :icon="desktop?'menu':'fa fa-search'"
            @click="leftDrawerOpen = !leftDrawerOpen"
          ><!-- desktop ||  :class="'q-ml-sm'"-->
          </q-btn>
        </q-toolbar>
      </q-header><!-- Pull To Refresh Header -->
    </q-pull-to-refresh><!--================== Header End =======-->

    <!-- Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      side="right"
      behavior="mobile"
      bordered
      content-class="bg-grey-2"
    >
      <q-img class="absolute-top" :src="`${baseURL}/files/material.png`" style="height: 300px">
        <q-img :src="`${baseURL}/files/suguffie_fb.png`" style="height: 300px"/>
      </q-img>
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 300px; border-right: 1px solid #ddd">

        <q-input clearable outlined class="col-lg-6 search" @keyup.enter="search(search_posts)" v-if="!desktop" v-model="search_posts" :label="$t('search_posts')" >
          <template v-slot:append>
            <div>
              <q-btn class="*glossy"
                flat :loading="loader"
                icon="fas fa-search"
                @click.prevent="search(search_posts)"
              />
            </div>
          </template>
        </q-input><!-- TagSearch: MobileSearchModule -->

        <q-select
          filled v-if="!desktop"
          style="width: 100%"
          _class="col-lg-5"
          v-model="category"
          :options="options"
          :label="$t('all_categories')"
          color="teal"
          clearable
          options-selected-class="text-deep-orange"
        ><!-- TagSelectCategory: MobileSearchModule -->
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              _v-on="scope.itemEvents"
            >
              <q-item-section avatar>
                <q-icon :name="scope.opt.icon" />
              </q-item-section>
              <q-item-section>
                <!-- <q-item-label v-html="scope.opt.label" /> -->
                <div v-html="scope.opt.label" />
                <q-item-label caption>{{ scope.opt.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <div class="row">
          <div class="col-9" v-if="!desktop">
            <q-btn color="primary" class="q-ma-sm"
              icon="fas fa-map-pin" dense
              :loading="loader" :label="place"
              @click="location = true"
            /><!-- TagPostLocation: MobileLocationModule -->
          </div>
          <div class="col-3">
            <LocaleDropdown />
          </div>
          <div class="col-9">
            <Share :shareData="shareData" />
            <q-btn round dense flat icon="refresh" @click.prevent="refresh" />
          </div><!-- TagShare: UserModule -->
          <div class="col-3">
            <q-toggle :icon="darkMode?'fas fa-sun':'fas fa-moon'"
              v-model="darkMode" :val="[true]" size="lg"
            /><!-- TagDarkMode: darkModeModule -->
          </div>
        </div><!-- <q-separator /> -->

        <div class="text-center">

          <q-btn icon="fas fa-bug"
            :label="debug?$t('iP Debug On'):$t('iP Debug Off')"
            :color="debug?'red':'grey'" v-if="ipEqual?(ipDebug||!debug):''"
            @click.prevent="Switch(!debug)"
          /><!-- TagIpDebug: IpDebugModule -->

          <div class="text-weight-bold">
            {{ipData?.city}} {{ipData?.region}} {{ipData?.country}}
            <q-btn color="primary" class="q-ma-sm"
              :loading="loader" label="appDisplayMode"
              @click.prevent="getAppDisplayMode(false)"
            /><!-- TagGetAppDisplayMode -->
          </div>

          <div class="q-pa-md" style="max-width: 350px">
            <q-list bordered>

                <q-item clickable v-ripple target="_blank" href="https://laravel.com">
                  <q-item-section avatar>
                    <a class="inline-flex items-center">
                        <img class="w-12" src="https://laravel.com/img/logomark.min.svg" alt="Laravel" width="50" height="52">
                        <img class="ml-5 sm:block" src="https://laravel.com/img/logotype.min.svg" alt="Laravel" width="114" height="29">
                    </a>
                  </q-item-section>

                  <q-item-section>v{{laravel}}</q-item-section>
                </q-item><!-- Laravel -->

                <q-item clickable v-ripple target="_blank" href="https://quasar.dev">
                  <q-item-section avatar>
                    <a v-if="darkMode" class="router-link-active doc-header__logo row items-center no-wrap cursor-pointer">
                      <img class="doc-header__logo-img" src="https://cdn.quasar.dev/logo-v2/svg/logo-dark.svg" alt="Quasar Logo" width="48" height="48">
                      <img class="doc-header__logo-text q-ml-md" src="https://cdn.quasar.dev/logo-v2/svg/logotype-dark.svg" alt="Quasar Logo" width="100" height="20">
                    </a><!-- black -->
                    <a v-else class="router-link-active doc-header__logo row items-center no-wrap cursor-pointer">
                      <img class="doc-header__logo-img" src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" alt="Quasar Logo" width="48" height="48">
                      <img class="doc-header__logo-text q-ml-md" src="https://cdn.quasar.dev/logo-v2/svg/logotype.svg" alt="Quasar Logo" width="100" height="20">
                    </a><!-- white -->
                  </q-item-section>

                  <q-item-section>v{{ $q.version }}</q-item-section>
                </q-item><!-- Quasar -->

                <q-item clickable v-ripple target="_blank" href="https://vuejs.org">
                  <q-item-section avatar>
                      <svg class="logo" viewBox="0 0 128 128" width="50" height="50" data-v-11b02119="">
                        <path fill="#42b883" d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z" data-v-11b02119=""></path>
                        <path fill="#35495e" d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z" data-v-11b02119=""></path>
                      </svg>
                  </q-item-section>

                  <q-item-section>Vue.js v{{version}}</q-item-section>
                </q-item><!-- Vue -->


              <q-separator />

              <q-item clickable v-ripple
                :target="ipDebug?'_blank':''"
                :href="appName==='Larasar'?'https://suguffie.com/'
                  :ipDebug?'https://github.com/modemb/suguffie':'#'"
              >
                <q-item-section avatar>
                  <q-avatar rounded>
                    <img :src="`${baseURL}/files/suguffie_fb.png`">
                  </q-avatar>
                </q-item-section>
                <q-item-section>Copyright &copy; {{new Date().getFullYear()}} Suguffiè</q-item-section>
              </q-item><!-- Suguffiè -->

            </q-list>
          </div><!-- Logos -->

        </div>
      </q-scroll-area>
    </q-drawer><!-- rightDrawer -->

    <q-drawer
      show-if-above
      v-model="rightDrawer"
      bordered
      content-class="bg-grey-2"
    >

      <q-img class="absolute-top" :src="`${baseURL}/files/material.png`" style="height: 150px">
        <div class="absolute-bottom bg-transparent text-center"><!-- https://cdn.quasar.dev/img/material.png -->
          <template v-if="auth">
            <q-avatar size="70px" class="*q-mb-sm">
              <img :src="avatar" /><!-- https://quasar.dev/vue-components/img#fit-mode -->
            </q-avatar><!-- TagAvatar: UserModule -->
            <div class="text-weight-bold">
              <q-btn-dropdown
                rounded
                :label="auth?.first_name"
                @click.prevent="authDropdown = !authDropdown"
              /><!-- <LocaleDropdown /> -->
            </div>
            <div>{{ auth?.email }}</div>
          </template>
        </div>
      </q-img>
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list v-if="authDropdown&&appName==='Larasar'">
          <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Docs</q-item-label>
              <q-item-label caption>quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://github.quasar.dev">
            <q-item-section avatar>
              <q-icon name="code" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Github</q-item-label>
              <q-item-label caption>github.com/quasarframework</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://chat.quasar.dev">
            <q-item-section avatar>
              <q-icon name="chat" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Discord Chat Channel</q-item-label>
              <q-item-label caption>chat.quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://forum.quasar.dev">
            <q-item-section avatar>
              <q-icon name="record_voice_over" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Forum</q-item-label>
              <q-item-label caption>forum.quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://twitter.quasar.dev">
            <q-item-section avatar>
              <q-icon name="rss_feed" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Twitter</q-item-label>
              <q-item-label caption>@quasarframework</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://facebook.quasar.dev">
            <q-item-section avatar>
              <q-icon name="public" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Facebook</q-item-label>
              <q-item-label caption>@QuasarFramework</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://awesome.quasar.dev">
            <q-item-section avatar>
              <q-icon name="favorite" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Quasar Awesome</q-item-label>
              <q-item-label caption>Community Quasar projects</q-item-label>
            </q-item-section>
          </q-item>
        </q-list><!--========================== Quasar ===============-->
        <q-list v-else-if="authDropdown"><!--== Pages ================-->
          <div v-for="(page, key) in pages" :key="key">
            <q-item clickable tag="a" :to="'/page/'+page.slug" v-if="page.active">
              <q-item-section avatar>
                <q-icon :name="page.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{page.page_title}}</q-item-label>
                <q-item-label caption>{{page.description}}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-list><!--========================== Pages End ============-->
        <q-list v-else><!--==================== AuthDrawer ===========-->
          <q-item clickable to='/profile'>
            <q-item-section avatar>
              <q-icon name="fas fa-user" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$t('profile')}}</q-item-label>
              <q-item-label caption>{{auth?.role}}</q-item-label>
            </q-item-section>
          </q-item>
          <div v-if="(auth?.role==='Admin') || (auth?.role==='User')"><!-- Admins and Users View ====-->
            <q-item clickable to='/users'>
              <q-item-section avatar>
                <q-icon name="fas fa-users" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('users')}}</q-item-label>
                <q-item-label caption>{{auth?.role}}'s Users</q-item-label>
              </q-item-section>
            </q-item>
          </div><!--================================ Admins and Users View End -->
          <div v-if="(auth?.role==='Admin') || (auth?.role==='User') || (auth?.role==='Editor')"><!-- Admins, Users and Editors View ==============-->
            <q-item clickable to='/posts'>
              <q-item-section avatar>
                <q-icon name="fas fa-list-alt" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('posts')}}</q-item-label>
                <q-item-label caption>{{auth?.role}}'s {{$t('posts')}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to="/messages">
              <q-item-section avatar>
                <q-icon name="fas fa-comments" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('Messages')}}</q-item-label>
                <q-item-label caption>{{auth?.role}}'s {{$t('Messages')}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to='/favorites' v-if="(auth?.role==='Admin') || (auth?.role==='User')">
              <q-item-section avatar>
                <q-icon name="fas fa-heart" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('favorites')}}</q-item-label>
                <q-item-label caption>{{auth?.role}}'s Posts</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to='/library'>
              <q-item-section avatar>
                <q-icon name="fas fa-photo-video" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('My Library')}}</q-item-label>
                <q-item-label caption>{{auth?.role}}'s {{$t('Library')}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to='/reports'>
              <q-item-section avatar>
                <q-icon name="fas fa-file-alt" /><!-- FixHere -->
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('reports')}}</q-item-label>
                <q-item-label caption>{{auth?.role}}'s {{$t('reports')}}</q-item-label>
              </q-item-section>
            </q-item>
          </div><!--================================================ Admins, Users and Editors View End ==========-->
          <div v-if="auth?.role==='Admin'"><!--============================== Admins View =================================-->
            <q-item clickable to='/analytics'>
              <q-item-section avatar>
                <q-icon name="fas fa-chart-bar" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('analytics')}}</q-item-label>
                <q-item-label caption>{{auth?.role}}'s Analytics</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to='/views'>
              <q-item-section avatar>
                <q-icon name="fas fa-eye" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('views')}}</q-item-label>
                <q-item-label caption>{{auth?.role}}'s views</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to="/locations">
              <q-item-section avatar>
                <q-icon name="fas fa-location-arrow" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('locations')}}</q-item-label>
                <q-item-label caption>{{auth?.role}}'s locations</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to="/currencies">
              <q-item-section avatar>
                <q-icon name="fas fa-cent-sign" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('currencies')}}</q-item-label>
                <q-item-label caption>{{auth?.role}}'s currencies</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to='/pages'>
              <q-item-section avatar>
                <q-icon name="fas fa-pager" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('pages')}}</q-item-label>
                <q-item-label caption>{{auth?.role}}'s pages</q-item-label>
              </q-item-section>
            </q-item>
          </div><!--================================================ Admins View End =============================-->
          <q-item clickable :to="{name: 'auth.test'}" v-if="ipDebug">
            <q-item-section avatar>
              <q-icon name="fas fa-check" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Test</q-item-label>
              <q-item-label caption>@CheckCode</q-item-label>
            </q-item-section>
          </q-item>
        </q-list><!--========================== AuthDrawer End =======-->

        <div class="q-pa-md row items-start q-gutter-md" v-if="false">
          <q-card class="my-card">
            <q-list>{{ appName }}
              <q-item clickable to="/post/1">
                <q-img :src="baseURL+'/images/post/1612077682.jpeg'" />
              </q-item>

              <q-item clickable to="/post/1">
                <q-item-section avatar>
                  <q-icon color="primary" name="fas fa-laptop-code" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Software Development</q-item-label>
                  <q-item-label caption>Desktop, Mobil, And Web</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable tag="a" href="tel:+1(410)645-0520">
                <q-item-section avatar>
                  <q-icon color="red" name="fas fa-phone-alt" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>+1(410)645-0520</q-item-label>
                  <q-item-label caption>United States</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable tag="a" target="_blank" href="https://wa.me/c/15149225392">
                <q-item-section avatar>
                  <q-icon color="green" name="fab fa-whatsapp-square" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>+1(514)922-5392</q-item-label>
                  <q-item-label caption>Canada</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div><!-- TagLeftAd: AdModule -->

        <div v-if="auth" class="q-pa-md"><!--======= Authenticated ============-->
          <q-btn icon="lock_open" :label="admin?'Admin':$t('logout')" @click.prevent="logout" />
        </div><!--================================== Authenticated End ========-->
        <div v-else class="q-pa-md"><!--============ Guest ====================-->
          <q-btn icon="vpn_key" :label="$t('login')" to='/login' />
          <q-btn icon="add_to_queue" :label="$t('register')" to='/register' />
        </div><!--================================== Guest End ================-->
      </q-scroll-area>
    </q-drawer><!-- leftDrawer -->
    <!-- Drawer End -->

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer -->
    <q-footer elevated v-if="desktop">
      <q-toolbar v-if="false"><!-- Desktop View -->
        <q-toolbar-title>
          <template v-if="superAdmin || ipDebug">
            <q-btn round type="a" target="_blank"  href="https://quasar.dev">
              <q-avatar>
                <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
              </q-avatar>
            </q-btn>
              Quasar v{{ $q.version }}
              Vue v{{version}}
              Laravel v{{laravel}}
          </template>
          Copyright &copy; {{new Date().getFullYear()}} Suguffiè
        </q-toolbar-title>
        <q-btn glossy unelevated to="/messages">
            <i class="fas fa-comments fa-2x"/>
        </q-btn>
      </q-toolbar>
    </q-footer>
    <q-footer elevated v-else>
      <q-toolbar><!-- Mobile View -->
        <q-toolbar-title>
          <div class="q-gutter-sm text-center">
            <q-btn color="primary" :text-color="path==='/'?'orange':color" glossy unelevated icon="fas fa-store" to="/" />
            <template v-if="auth"><!-- :icon="'fas '+ (path=='/'?'fa-store':'fa-left-long')" -->
              <q-btn color="primary" :text-color="path==='/users'?'orange':'white'" glossy unelevated icon="people" to="/users" />
              <q-btn color="primary" :text-color="path==='/analytics'?'orange':'white'" glossy unelevated icon="assessment" to="/analytics" v-if="auth?.role==='Admin'" />
              <q-btn color="primary" :text-color="path==='/views'?'orange':'white'" glossy unelevated icon="fas fa-eye" to="/views" v-if="auth?.role==='Admin'" />
              <q-btn color="primary" :text-color="path==='/locations'?'orange':'white'" glossy unelevated icon="fas fa-location-arrow" to="/locations" v-if="auth?.role==='Admin'" />
              <q-btn color="primary" :text-color="path==='/posts'?'orange':'white'" glossy unelevated icon="fas fa-list-alt" to="/posts" v-else />
              <q-btn color="primary" :text-color="path==='/favorites'?'red':'white'" glossy unelevated icon="fas fa-heart" to='/favorites' v-if="auth?.role==='User'" />
            </template>
            <template v-else>
              <q-btn color="primary" :text-color="path==='/login'?'orange':'white'" glossy unelevated icon="vpn_key" to="/login" />
              <q-btn color="primary" :text-color="path==='/register'?'orange':'white'" glossy unelevated icon="add_to_queue" to="/register" />
            </template>
            <q-btn color="primary" :text-color="path==='/reports'?'orange':'white'" glossy unelevated icon="fas fa-file-alt" to="/reports" v-if="auth?.role==='Admin'" />
            <!--<q-btn :text-color="path=='/currencies'?'orange':'white'" glossy unelevated icon="fas fa-cent-sign fa-2x" to="/currencies" v-if="role.admins" />-->
            <q-btn :text-color="path==='/messages'?'orange':'white'" glossy unelevated icon="fas fa-comments fa-2x" to="/messages" v-else />
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
    <!-- Footer End -->

    <QAjaxBar :hijack-filter="myFilterFn" size="5px"/>
    <!-- <link rel="manifest" href="/manifest.json"> -->
    <!-- config('webpush.gcm.sender_id') v-if="config.gcm_sender_id" -->
  </q-layout>
</template>

<script lang="ts">
import { openURL, QAjaxBar, useQuasar } from 'quasar'
import { ref, computed, watch, onMounted, version } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ipData, baseURL, getAppDisplayMode, authAction, logoutAction, shareMutation } from 'boot/axios'
import { useCrudStore } from 'stores/crud'
import { defineCustomElements } from '@ionic/pwa-elements/loader'
import { pwaInstall } from 'components/Functions'
import LocaleDropdown from 'components/LocaleDropdown.vue'
import Location from 'components/PostLocation.vue'
import Notifications from 'components/UserNotifications.vue'
import ShoppingCart from 'components/ShoppingCart.vue'
import Share from 'components/UserShare.vue'

/**
 * Tags: SearchModule - AdModule - IpDebugModule - ShoppingCart
 *       TagPostLocation - TagDarkMode - TagAddPost
 *
 * @to
 */
export default {
  openURL,
  components: {
    Location,
    QAjaxBar,
    Share,
    LocaleDropdown,
    Notifications,
    ShoppingCart
  },
  setup () {
    // const $t = i18n?.global?.t
    const $q = useQuasar()
    const store = useCrudStore()
    const { crudAction, notifyAction } = store
    const $route = useRoute()
    const $router = useRouter()
    const pages = ref<any>([])
    const darkMode = ref<any>($q.localStorage.getItem('darkMode'))
    const category = ref(null)
    const leftDrawerOpen = ref(false)

    window.scroll({
      top: 100,
      left: 100,
      behavior: 'smooth',
    }) // https://developer.mozilla.org/en-US/docs/Web/API/Window/scroll

    const postPage = computed(() => store.postPageGetter?.postPage)
    const location = computed(() => store.locationGetter?.location)
    const categories = computed(() => store.categoriesGetter?.data||[])
    const locale = computed(() => store.configGetter?.locale)
    const auth = computed(() => store.authGetter)

    const authDropdown = ref(!auth.value)

    watch(auth, val => shareMutation(val))
    watch(auth, val => authDropdown.value = !val)
    watch(darkMode, val => {
      $q.localStorage.set('darkMode', val)
      darkModeClass(val)
    })

    onMounted(() => {
      if ($route.path.includes('verify/')) notifyAction({message: 'Please'})
      const debug = $q.localStorage.getItem('debug')
      const ip = $q.localStorage.getItem('ip')
      crudAction({debug, mutate: 'debugGetter'})
      crudAction({ip, mutate: 'ipGetter'})
      darkModeClass(darkMode.value)
      shareMutation(auth.value)
      pwaInstall(notifyAction)
    })

    if ($route.query.verified) notifyAction({success: 'Email Verified Successfully'})

    function darkModeClass(val: boolean) {
      if (darkMode.value===null) darkMode.value = val = true
      $q.dark.set(val) // https://quasar.dev/quasar-plugins/dark#introduction

      crudAction({darkMode, mutate: 'darkModeGetter'})

    } /* TagDarkMode: darkModeModule */ document.getElementById('root')

    defineCustomElements(window) // Call the element loader after the app has been rendered the first time

    return {
      addPost(m: string) {
        // if (confirm(m))
        $router.push({ path: postPage.value?'/post':'/post?go=categories' })
      }, // TagAddPost: MobilModule
      path: computed(() => $route.path),
      notify: computed(() => store['notifyGetter']?.notify),
      darkMode,
      version,
      auth, locale,
      pages, //mobile,
      tab: ref('mails'),
      color: ref('white'),
      banner: ref(true),
      desktop: $q.platform.is.desktop,
      modembIos: navigator.userAgent.match(/(modembIos)/),
      authDropdown,
      leftDrawerOpen,//: ref(false), // $q.platform.is.desktop,
      rightDrawer: ref(false),
      loader: ref(false),
      baseURL,
      ipData,
      getAppDisplayMode, // TagGetAppDisplayMode
      // ====Search=== \\
      search_posts: ref(null),
      location: ref(false),
      // ============== \\
      category, //: ref(null),
      // ================== \\
      postPage,
      appName: computed(() => store.configGetter?.appName),
      laravel: computed(() => store.configGetter?.laravel),
      ipEqual: computed(() => store.ipGetter?.ip === ipData?.ip),
      ipDebug: computed(() => store.configGetter?.ipDebug),
      debug: computed(() => store.debugGetter?.debug),
      Switch(bool: boolean) {
        $q.localStorage.set('debug', store.configGetter.ipDebug = store.debugGetter.debug = bool)
      }, // TagIpDebug: IpDebugModule
      refresh (done: () => void) {
        setTimeout(() => {
          crudAction({
            reload: Date.now(),
            mutate: 'reloadGetter',
            refresh: ['reloadApp']
          }); done()
        }, 1000) // Reload Session
      }, // https://quasar.dev/vue-components/pull-to-refresh
      superAdmin: computed(() => auth.value?.id === 1),
      admin: computed(() => store.authIdGetter?.authID),
      place: computed(() => location.value),
      avatar: computed(() => {
        if (auth.value?.avatar) {
          if (auth.value.avatar?.includes('files/')) return baseURL + '/' + auth.value.avatar
          else return auth.value.avatar
        } else return auth.value?.new?.avatar
      }),
      options: computed(() => {
        const data: {
          label: string;
          value: number;
          // disable: boolean;
          description: string;
          icon: string
        } [] = []

        categories.value?.forEach((Category: { locales: { categoryName: string; description: string }; id: number; icon: string }) => {
          data.push({
            label: Category?.locales?.categoryName,
            value: Category?.id,
            // disable: true,
            description: Category?.locales?.description,
            icon: Category?.icon
          }) // TagSelectCategory: SearchModule
        }); return data.sort((a, b) => a?.label?.localeCompare(b?.label))
      }), // TagOptionSearch: SearchModule

      shareData: computed(() => store.shareDataGetter?.shareData),

      myFilterFn (url='*') {
        return origin?.includes('localhost') || /^https:\/\/suguffie\.com/.test(url)
        // example (only https://my-service.com/* should trigger)
        // return /^https:\/\/my-service\.com/.test(url)
      }, // wss://ws-us2.pusher.com/app/d3fd7fdfa9b5dc8edffc?protocol=7&client=js&version=7.6.0&flash=false

      // ========Method=======
      search(posts: null) {
        const query = {
            location: location.value,
            categoryID: category.value?.['value']
        };  $router.push({ path: `/search/${posts}`, query })
        console.log('query', query)
      }, // TagSearch: SearchModule to Categories.vue
      logout() {

        const authID = store['authIdGetter']?.authID

        crudAction({authID: 0, mutate: 'authIdGetter'})

        if (authID) crudAction({
              url: 'api/users',
              method: 'post',
              log: true,
              userId: authID,
              refresh: ['reloadApp']
            }).then(() => authAction()?.then(() => $router.push({ path: '/users' })))
              .catch((e: unknown) => notifyAction({error: 'logAuth', e}))
        else logoutAction()

      }
    }
  }
}
</script>

<style scoped>
/* .my-card {
  width: 100%;
  max-width: 300px;
} */
/* .q-btn {
    *text-transform: none;
    *color: black;
} */
.search {
    border-radius: 4px;
    /* background: white; */
}
[v-cloak] {
  display: none !important;
}
@media all and (display-mode: standalone) {
  body {
    background-color: yellow;
  }
}
</style>
