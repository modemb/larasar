<template>

  <q-dialog v-model="viewMap"><!--== popMap =====================-->
    <q-card class="my-card text-white" style='width:800px'>
      <q-card-section class="bg-primary">
        <q-btn color="primary" text-color="white" class="float-right" dense round icon="close" v-close-popup />
        <div class="text-h6">
          {{address}} {{city}} {{postal_code}}
        </div>
      </q-card-section>
      <div  v-html="map"></div>
    </q-card><!-- TagViewMap: PostModule -->
  </q-dialog><!--=================== popMap End =================-->

  <q-dialog v-model="postPlace"><!-- Loaction PopUp =============-->
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <q-btn color="primary" text-color="white" class="float-right" dense round icon="close" v-close-popup />
        <div class="text-h6">{{$t('post_location')}}</div>
      </q-card-section>
      <post-location/><!-- TagAddLocation -->
    </q-card>
  </q-dialog><!--=================== Loaction PopUp End =========-->

  <q-dialog v-model="filesLibrary"><!-- TagFiles =============-->
    <q-card class="my-card col-12" style="width:100%; max-width: 1000px">
      <files v-on:reload="onLoad" :post="post"/>
    </q-card><!-- TagFiles: FilesModule -->
  </q-dialog><!--====================== TagFiles End =========-->

  <q-layout view="lHh lpr lFf" container :style="'height:' + height + 'px'" class="shadow-2 rounded-borders col-8-md">

    <q-header elevated>
      <q-card class="my-card" v-if="!subcategory_id&!param_id&view">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{$t('post_category')}}</div>
          <!-- <div class="text-subtitle2">by John Doe</div> -->
        </q-card-section>
        <div :class="'row '+(darkMode||'text-black')">
          <q-list class="col-6">
            <!--
              Rendering a <label> tag (notice tag="label")
              so QRadios will respond to clicks on QItems to
              change Toggle state.
            -->
            <div v-for="(category, key) in categories" :key="key">
              <q-item tag="label" v-ripple>
                <q-item-section avatar>
                  <q-radio v-model="subcategories" :val="category.subcategories"  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{category.locales ? category.locales.categoryName : 'categoryName'}}</q-item-label>
                </q-item-section>
              </q-item>
            </div><!-- TagRadioCategory: CategoryModule -->
          </q-list>
          <q-list class="col-6">
            <div v-for="(subcategory, key) in subcategoriesSorted(subcategories)" :key="key">
              <q-item tag="label"
                v-ripple clickable
                @click.prevent="onLoad(subcategory)"

              ><!-- Post :to="`/post/${subcategory.subcategoryName}`"-->

                <q-item-section avatar>
                  <q-icon name="fas fa-arrow-alt-circle-right" />
                </q-item-section>
                <!-- <q-item-section v-for="(locale, key) in subcategory.locales.sort((a, b) => a.subcategoryName.localeCompare(b.subcategoryName))" :key="key"> -->
                <!-- <q-item-section v-for="(locale, key) in subcategoryLocalesSorted(subcategory)" :key="key"> -->
                <q-item-section v-for="(locale, key) in subcategory.locales" :key="key">
                  <q-item-label>{{locale.subcategoryName}}</q-item-label>
                </q-item-section>
              </q-item>
            </div><!-- TagRadioSubcategory: SubcategoryModule -->
          </q-list>
        </div>
      </q-card><!--===================== TagPostCategory: PostModule -->

      <q-bar v-else-if="view"><!-- ifHere -->

          <q-btn v-for="(postLocale, key) in postSubcategoryLocales" :key="key"
            :label="mobile||postLocale.subcategoryName" icon="fas fa-undo"
            :to="{ name: 'public.subcategory.id', params: { id: postSubcategoryID || subcategory_id } }"
          /><!-- TagCategoryPosts: CategoryModule From Category.vue -->

          <q-btn label="flag"
            :icon="`fas ${flag}`" v-if="!preview"
            @click.prevent="flagPost(param_id)"
          /><!-- TagFlagPostButton: PostModule -->

          <q-btn v-if="token"
            icon="fas fa-cart-arrow-down"
            @click.prevent="paymentValidation"
          /><!-- TagPayment: PaymentValidationPostModule -->

          <q-space />

          <wish :post="post" :auth="auth&&!postData"
            @favorite="wish" v-if="param_id"
          /><!-- TagFavorite: FavoriteModule v-on:favorite="wish" -->

          <template v-if="userPost&&preview">

            <q-btn flat icon="fas fa-street-view"
              :label="location" class="float-right"
              @click.prevent="postPlace = true"
            /><!-- TagAddLocation - TagUpdateLocation: CategoryModule  v-if="ipDebug"-->

            <q-btn dense flat icon="fas fa-eye"
              title="Views" @click.prevent="previewPost"
              class="float-right"
              ><q-badge color="orange" text-color="black" :label="count" floating v-if="count" /><!-- TagView: ViewModule -->
            </q-btn><!-- TagPreviewPost -->
          </template>

          <q-btn v-else-if="userPost"
            dense flat icon="edit"
            class="float-right"
            @click.prevent="previewClose"
          /><!--======= TagPreviewClose =============-->

          <q-btn dense flat icon="close" v-close-popup v-if="postData" />

      </q-bar><!--===================== TagPost: PostModule ========-->
    </q-header>

    <q-btn flat class="fixed-center" :loading="true" v-if="!subcategory_id&!param_id"/>
    <!-- <q-btn flat class="fixed-center" :label="plan" :icon="!plan?'fas fa-thumbs-up':'fas fa-thumbs-down'" v-if="!subcategory_id&!param_id"/> -->

    <q-page-container v-else-if="view"><!-- ifHere -->
      <q-page class="flex flex-center *q-pa-md">

        <q-form class="q-gutter-md">
          <div class="row">
            <div class="col-md-12 q-pa-md" v-if="preview&userPost">

              <div class="row">
                <div class="col-8">
                  <q-input
                    filled
                    type="text"
                    v-model="post_title"
                    :label="$t('post_title')+'*'"
                    :error="post_title_data ? true : false"
                    :error-message='post_title_data'
                  /><!-- lazy-rules -->
                </div>
                <div class="col-4">
                  <q-input
                    filled
                    type="text"
                    v-model="price"
                    :label="$t('Price')"
                    :error="price_data ? true : false"
                    :error-message='price_data'
                  /><!-- lazy-rules -->
                </div>
                <div class="col-8">
                  <q-input
                    filled
                    type="text"
                    v-model="address"
                    :label="$t('address')"
                    :error="address_data ? true : false"
                    :error-message='address_data'
                  />
                </div>
                <div class="col-4">
                  <q-input
                    filled
                    lazy-rules
                    type="text"
                    v-model="postal_code"
                    :label="$t('postal_code')"
                    :error="postal_code_data ? true : false"
                    :error-message='postal_code_data'
                  />
                </div>
                <div class="col-4">
                  <q-input
                    filled
                    lazy-rules
                    type="text"
                    v-model="city"
                    :label="$t('city')"
                    :rules="[val => val && val.length > 0 || $t('add_city')]"
                    :error="city_data ? true : false"
                    :error-message='city_data'
                  />
                </div>
                <div class="col-4">
                  <q-input
                    filled
                    lazy-rules
                    type="text"
                    v-model="country"
                    :label="$t('country')"
                    :rules="[val => val && val.length > 0 || $t('country_city')]"
                    :error="country_data ? true : false"
                    :error-message='country_data'
                  />
                </div>
                <div class="col-4">
                  <q-input
                    v-model="phone"
                    filled type="tel"
                    :label="$t('phone')"
                    lazy-rules
                    :rules="[val => val && val.length > 0 || $t('add_phone')]"
                  />
                </div>
              </div><!-- address -->

              <!--TODO <div class="row" v-if="!auth">
                <div class="col-6">
                  <q-input
                    filled
                    type="email"
                    v-model="email"
                    :label="$t('email')"
                    lazy-rules
                    :error="email_data ? true : false"
                    :error-message="email_data"
                  />
                </div>
                <div class="col-6">
                  <q-input
                    v-model="phone"
                    filled type="tel"
                    :label="$t('phone')"
                    lazy-rules
                    :rules="[val => val && val.length > 0 || $t('add_phone')]"
                  />
                </div>
                <div class="col-6">
                  <q-input
                    filled
                    type="text"
                    v-model="first_name"
                    :label="$t('first_name')"
                    lazy-rules
                    :error="first_name_data ? true : false"
                    :error-message='first_name_data'
                    :rules="[val => val && val.length > 0 || $t('first_name')]"
                  />
                </div>
                <div class="col-6">
                  <q-input
                    filled
                    type="text"
                    v-model="last_name"
                    :label="$t('last_name')"
                    lazy-rules
                    :error="last_name_data ? true : false"
                    :error-message='last_name_data'
                    :rules="[val => val && val.length > 0 || $t('last_name')]"
                  />
                </div>
                <div class="col-6">
                  <q-input
                    filled
                    v-model="password"
                    lazy-rules
                    class="col-12"
                    :label="$t('password')"
                    :type="isPwd ? 'password' : 'text'"
                    :error="password_data ? true : false"
                    :error-message='password_data'
                  />
                </div>
                <div class="col-6">
                  <q-input
                    filled
                    v-model="password_confirmation"
                    class="col-12"
                    :type="isPwd ? 'password' : 'text'"
                    :label="$t('confirm_password')"
                    >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </div>
              </div> SignIn Before Post -->

              <q-editor v-model="description" min-height="5rem" />
              <p class="text-negative">{{description_data}}</p>

              <div class="cards row" v-if="param_id && (payment_expiry || !PayerID)">
                <!-- <div class="col-md-3 q-pa-md" v-if="role.admins">
                  <q-list bordered padding class="rounded-borders cardBorderTop-1">
                    <div :style="'max-height: 416px;' + cardHeight">
                      <q-item-label header class="text-center text-h5 *text-white *bg-primary">
                        <q-item-label lines="1">{{$t('Basic')}}</q-item-label>
                        <q-item-label caption>{{$t('standard_ad')}}</q-item-label>
                      </q-item-label>

                      <q-item>
                        <q-item-section avatar top>
                          <q-avatar icon="check" color="*primary" text-color="*white" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label lines="1">Test Plan</q-item-label>
                        </q-item-section>
                      </q-item><q-separator />
                    </div>
                    <div class="text-center q-pa-md" buttom>
                      <q-btn flat round icon="fas fa-question">
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
                          {{$t('Test Plan Tooltip')}}
                        </q-tooltip>
                      </q-btn>
                      <q-btn-toggle
                        v-model="amount"
                        push
                        glossy
                        toggle-color="primary"
                        :options="[
                          {label: $t('0.01'), value: 0.01}
                        ]"
                      />
                    </div>
                  </q-list>
                </div>card-0 -->
                <div class="col-md-3 q-pa-md">
                  <q-list bordered padding class="rounded-borders cardBorderTop-1">
                    <div :style="'max-height: 416px;' + cardHeight">
                      <q-item-label header class="text-center text-h5 *text-white *bg-primary">
                        <q-item-label lines="1">{{$t('Basic')}}</q-item-label>
                        <q-item-label caption>{{$t('standard_ad')}}</q-item-label>
                      </q-item-label>

                      <q-item>
                        <q-item-section avatar top>
                          <q-avatar icon="check" color="*primary" text-color="*white" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label lines="1">{{$t('expire_in_a_month')}}</q-item-label>
                        </q-item-section>
                      </q-item><q-separator />

                      <q-item>
                        <div class="*col-md-3 q-gutter-sm">
                          <q-btn flat round icon="fas fa-question">
                            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
                              {{$t('bump_up_tooltip')}}
                            </q-tooltip>
                          </q-btn>
                          <q-checkbox v-model="bump_up"
                            :label="$t('Bump Up')+' 2.00 USD'"
                            :true-value="2"
                          /><!-- TagBumpUp v-if="!gallery_page&&!worldwide" -->
                        </div>
                      </q-item><q-separator />
                    </div>
                    <div class="text-center q-pa-md" buttom>
                      <q-btn flat round icon="fas fa-question" v-if="!bump_up">
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
                          {{$t('basic_plan_tooltip')}}
                        </q-tooltip>
                      </q-btn>
                      <q-btn-toggle
                        v-model="amount"
                        push
                        glossy
                        toggle-color="primary"
                        :options="[
                          {label: bump_up?'$2.00 USD':$t('free'), value: bump_up||0} // TODO chooseByItself
                        ]"
                      /><!-- TagBumpUp -->
                    </div>
                  </q-list>
                </div><!-- card-1 -->
                <div class="col-md-3 q-pa-md">
                  <q-list bordered padding class="rounded-borders cardBorderTop-2" style="*max-width: 350px">
                    <div :style="'max-height: 416px;' + cardHeight">
                      <q-item-label header class="text-center text-h5">
                        <q-item-label lines="1">{{$t('Silver')}}</q-item-label>
                        <q-item-label caption>{{$t('automatic_bump_up')}}</q-item-label>
                      </q-item-label>

                      <q-item>
                        <q-item-section avatar top>
                          <q-avatar icon="check" color="*primary" text-color="*white" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label lines="1">{{$t('expire_in_a_month')}}</q-item-label>
                        </q-item-section>
                      </q-item><q-separator />

                      <q-item>
                        <q-item-section avatar top>
                          <q-avatar icon="check" color="*primary" text-color="*white" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label lines="1">{{$t('every_7_days')}}</q-item-label>
                        </q-item-section>
                      </q-item><q-separator />

                    </div>

                    <div class="text-center q-pa-md">
                      <q-btn flat round icon="fas fa-question">
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
                          {{$t('silver_plan_tooltip')}}
                        </q-tooltip>
                      </q-btn>
                      <q-btn-toggle
                        v-model="amount"
                        push
                        glossy
                        toggle-color="primary"
                        :options="[
                          {label: '$5.00 USD', value: 5}
                        ]"
                      />
                    </div>

                  </q-list>
                </div><!-- card-2 -->
                <div class="col-md-3 q-pa-md">
                  <q-list bordered padding class="rounded-borders cardBorderTop-3" style="*max-width: 350px">
                    <div :style="'max-height: 416px;' + cardHeight">
                      <q-item-label header class="text-center text-h5">
                        <q-item-label lines="1">{{$t('Gold')}}</q-item-label>
                        <q-item-label caption>{{$t('automatic_bump_up')}}</q-item-label>
                      </q-item-label>

                      <q-item>
                        <q-item-section avatar top>
                          <q-avatar icon="check" color="*primary" text-color="*white" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label lines="1">{{$t('expire_in_a_month')}}</q-item-label>
                        </q-item-section>
                      </q-item><q-separator />

                      <q-item>
                        <q-item-section avatar top>
                          <q-avatar icon="check" color="*primary" text-color="*white" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label lines="1">{{$t('every_5_days')}}</q-item-label>
                        </q-item-section>
                      </q-item><q-separator />

                    </div>

                    <div class="text-center q-pa-md">
                      <q-btn flat round icon="fas fa-question">
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
                          {{$t('gold_plan_tooltip')}}
                        </q-tooltip>
                      </q-btn>
                      <q-btn-toggle
                        v-model="amount"
                        push
                        glossy
                        toggle-color="primary"
                        :options="[
                          {label: '$10.00 USD', value: 10}
                        ]"
                      />
                    </div>

                  </q-list>
                </div><!-- card-3 -->
                <div class="col-md-3 q-pa-md">
                  <q-list bordered padding class="rounded-borders cardBorderTop-4" style="*max-width: 350px">
                    <div :style="'max-height: 416px;' + cardHeight">
                      <q-item-label header class="text-center text-h5">
                        <q-item-label lines="1">{{$t('Ultimate')}}</q-item-label>
                        <q-item-label caption>{{$t('automatic_bump_up')}}</q-item-label>
                      </q-item-label>

                      <q-item>
                        <q-item-section avatar top>
                          <q-avatar icon="check" color="*primary" text-color="*white" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label lines="1">{{$t('expire_in_a_month')}}</q-item-label>
                        </q-item-section>
                      </q-item><q-separator />

                      <q-item><!-- clickable v-ripple -->
                        <q-item-section avatar top>
                          <q-avatar icon="check" color="*primary" text-color="*white" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label lines="1">{{$t('every_3_days')}}</q-item-label>
                        </q-item-section>
                      </q-item><q-separator />

                    </div>

                    <div class="text-center q-pa-md">
                      <q-btn flat round icon="fas fa-question">
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
                          {{$t('ultimate_plan_tooltip')}}
                        </q-tooltip>
                      </q-btn>
                      <q-btn-toggle
                        v-model="amount"
                        push
                        glossy
                        toggle-color="primary"
                        :options="[
                          {label: '$15.00 USD', value: 15}
                        ]"
                      />
                    </div>

                  </q-list>
                </div><!-- card-4 -->
              </div><!-- TagPayment: CardPaymentPostModule ToFixPostPopUp -->

              <div class="row" v-else-if="start_date">
                <div class="col-md-12 q-pa-md">{{$t('plan')}}: {{plan}} | {{start_date}} <q-icon name='fas fa-long-arrow-alt-right'/> {{end_date}}</div>
              </div><!-- TagActivePlan end_date-->

              <div class="row" v-if="param_id">
                <div class="col-md-3 q-pa-md">
                  {{$t('email')}}: {{user.email}}
                </div><!-- TagEmail -->
                <div class="col-md-3 q-gutter-sm" v-if="!post.gallery_page&&!bump_up">
                  <q-btn flat round icon="fas fa-question">
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
                      {{$t('gallery_page_tooltip')}}
                    </q-tooltip>
                  </q-btn>
                  <q-checkbox v-model="gallery_page"
                    :label="$t('Gallery Page')+' 20.00 USD'"
                    :true-value="20"
                  ><!-- TagGallery -->
                  </q-checkbox>
                </div><!-- TagGallery -->
                <div class="col-md-3 q-gutter-sm" v-if="!post.worldwide&&!bump_up">
                  <q-btn flat round icon="fas fa-question">
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
                      {{$t('worldwide_tooltip')}}
                    </q-tooltip>
                  </q-btn>
                  <q-checkbox v-model="worldwide"
                    :label="$t('Worldwide')+' 200.00 USD'"
                    :true-value="200"
                  >
                  </q-checkbox>
                </div><!-- TagWorldwide -->
                <div class="col-md-3 q-gutter-sm" v-if="!gallery_page&&!worldwide&&!(payment_expiry || !PayerID)">
                  <q-btn flat round icon="fas fa-question">
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
                      {{$t('bump_up_tooltip')}}
                    </q-tooltip>
                  </q-btn>
                  <q-checkbox v-model="bump_up"
                    :label="$t('Bump Up')+' 2.00 USD'"
                    :true-value="2"
                  /><!-- https://quasar.dev/vue-components/checkbox#custom-model-values -->
                </div><!-- TagBumpUp -->
                <div v-if="!bump_up&&amount" class="col-md-3 q-gutter-sm">
                  <q-select v-model="recurring" :options="options" :label="$t('Recurring')" style="min-width: 300px">
                    <template v-slot:prepend>
                      <q-icon name="fas fa-sync" />
                    </template>
                  </q-select>
                </div><!-- TagRecurring -->

              </div><!-- TagPayment: OptionPaymentPostModule -->

              <div class="col-md-12 q-pa-md" v-if="amount || gallery_page || worldwide || (bump_up && !(payment_expiry || !PayerID))">

                <checkout v-on:paypal="paymentResponse" :payload="payload" />

              </div><!-- TagPaymentCheckout: PaymentPostModule https://quasar.dev/vue-components/button-toggle#Example--Some-design-examples -->


              <div class="q-ma-md"  v-if="!auth"><!-- Guest ====================-->
                <q-btn icon="add_to_queue" :label="$t('register')" to='/register'/>
                <q-btn icon="warning" :label="$t('Login Before Posting')" to='/login'/>
              </div><!--======================================== Guest End ================-->

              <div class="row">
                <div class="col-md-3">

                  <!-- <q-uploader
                    style="*max-width: 300px"
                    class="q-mt-md"
                    :factory="storeImage"
                    label="Batch upload"
                    multiple
                    batch
                  />TagPostImage: PostModule -->

                  <!-- <input type="file"
                    v-if="param_id"
                    v-on:change="onImageChange"
                    class="q-ma-lg"
                  > -->

                  <q-btn color="primary"
                    :loading="loader"
                    :label="$t('library')"
                    icon="fas fa-photo-video"
                    class="q-ma-md" v-if="param_id"
                    @click.prevent="filesLibrary = true"
                  /><!-- TagFiles: FilesModule -->

                </div><!-- TagPostPic: PostModule -->
                <div class="col-md-3">
                  <div v-if="param_id">
                    <q-btn color="primary"
                      icon="fas fa-edit"
                      :loading="loader"
                      :label="location_data || $t('update_category')"
                      class="q-ma-md" v-if="update_category"
                      :to="'/post/'+param_id+'/categories'"
                    /><!-- TagUpdatePost: UpdateCategoryPostModule -->
                    <q-btn color="primary"
                      icon="fas fa-edit"
                      :loading="loader"
                      :label="location_data || $t('update_post')"
                      class="q-ma-md" v-else
                      @click.prevent="update_post(param_id)"
                    /><!-- </q-btn> @click.prevent="update_post(param_id)"  v-if="role.admins || ipDebug" -->
                  </div><!--======= TagUpdatePost =============-->
                  <div v-else>
                    <q-btn color="primary"
                      icon="fas fa-plus-circle"
                      :loading="loader"
                      :label="location_data || $t('add_post')"
                      class="q-ma-md"
                      @click.prevent="add_post(subcategory_id)"
                    />
                  </div><!--======= TagAddPost ================-->
                </div><!--========= CrUp =======================-->
                <div class="col-md-3">
                  <q-checkbox class="q-ma-md" v-model="update_category" :label="$t('update_category')" v-if="role.admins"/>
                </div><!-- q-btn dense round flat icon="fas fa-eye" -->
                <div class="col-md-3">
                  <q-checkbox class="q-ma-md" v-model="update_location" :label="$t('update_location')"/>
                </div>
              </div><!--=========== CRUD =======================-->

              <q-separator /><br />

              <div class="q-col-gutter-md row items-start"><!-- v-if="pics" -->
                <div class="col-2" v-for="(data, key) in pics" :key="key">
                  <q-img :src="url+'/'+data.pic" :ratio="1">
                    <div class="absolute-bottom-right text-subtitle2">
                      <q-btn
                        text-color="white"
                        class="float-right"
                        dense round
                        icon="close"
                        @click.prevent="deleteImage(data.id)"
                      /><!--======= TagDeleteImage: PicModule =============-->
                    </div>
                  </q-img>
                </div>
              </div>

            </div><!--======== TagUserPost ===============-->

            <div class="col-md-12 q-pa-md" v-else>

              <q-card class="my-card">
                <q-card-section class="*row text-h4 *bg-grey-3" v-html="post_title"/>

                <q-carousel
                  swipeable
                  animated
                  arrows
                  v-model="slide"
                  v-if="pics[0]"
                  thumbnails
                  infinite
                  @mouseenter="autoplay = false"
                  @mouseleave="autoplay = true"
                  :autoplay="autoplay"
                  v-model:fullscreen="fullscreen"
                > <!-- https://quasar.dev/vue-components/carousel#QCarousel-API height="4000px" -->

                  <q-carousel-slide v-for="(data, key) in pics" :key="key"
                    :name="key" :img-src="`${url}/${data.pic}`"
                  ><q-img :src="`${url}/${data.pic}`" v-if="zoom"/><!-- https://quasar.dev/vue-components/img#example--fit-modes -->
                  </q-carousel-slide><!-- TagPostCarousel: PostModule -->

                  <template v-slot:control>
                    <q-carousel-control
                      position="top-right"
                      :offset="[18, 18]"
                    >
                      <q-btn color="white" text-color="primary">
                        <q-btn push dense
                          :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                          @click="fullscreen = !fullscreen"
                        />
                        <q-btn push dense class="q-ml-sm"
                          :icon="zoom ? 'fas fa-minus' : 'fas fa-plus'"
                          @click="zoom = !zoom"
                        />
                      </q-btn>
                    </q-carousel-control>
                  </template>
                </q-carousel>

                <q-separator />

                <div class="row">
                  <q-card-section class="col-6 row">
                    <q-btn type="a" class="*col-lg-5 *q-mb-md" v-if="city"
                      icon="fas fa-map-marker-alt" behavior="mobile"
                      @click.prevent="googleMap" flat round
                    /><!-- TagViewMap: PostModule :label="address + ' ' + city + ' ' + postal_code"-->
                    <q-btn type="a" class="*col-lg-3 *q-mb-md"
                      icon="fas fa-envelope" target="_blank" v-if="user.email" flat
                      :href="'mailto:' + user.email + '?subject=' + post_title + '&body=From ' + copyLink"
                    /><!-- :label="user.email" -->
                    <q-btn type="a" class="*col-lg-2 *q-mb-md"
                      icon="fas fa-phone" v-if="phone"
                      :href="'tel:' + phone" flat
                    /><!-- :label="phone" -->
                    <q-btn v-if="myRoom"
                      icon="fas fa-comments fa-2x" class="*q-mb-md"
                      @click.prevent="chatRoom" flat round
                    /><!-- TagChatRoom: chatRoomModule -->
                  </q-card-section>

                  <q-card-section class="col-6 *q-mb-md" align="right">
                    <share :shareData="shareData"/>
                  </q-card-section><!-- TagSharePost: PostModule - Navigator Share -->
                </div>

                <q-separator />

                <q-card-section class="text-h6" behavior="mobile" v-html="description"/>
              </q-card>

            </div><!--======== TagPreviewPost ============-->
          </div>
        </q-form>

      </q-page>
    </q-page-container>

  </q-layout>

</template>

<script>
import { ref, onMounted, onUpdated, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { i18n, url, api, crudAction, notifyAction, userData } from 'boot/axios'
import { dateDiffIndays } from '../components/functions'
import postLocation from './Location'
import Checkout from './Checkout'
import Wish from './Wish'
import Files from './Files'
import Share from './Share'

/**
 * Tags: TagFlagPost - TagAddPost - TagPayment - TagAddLocation - FilesModule
 *       TagPreviewPost - TagCheckout - TagPostPic - TagSharePost - TagActivePlan
 *       TagRadioCategory: CategoryModule  - TagRadioSubcategory: SubcategoryModule
 *       FavoriteModule - PaymentPostModule - ViewModule - chatRoomModule - TagPostCarousel
 *       LinkPaymentPostModule - TagImplementTestPayment - ipDebugPaymentPostModule - PostModule
 *
 * @from CategoryController
 */
export default {
  components: {
    postLocation,
    Checkout,
    Files, // TagFiles: FilesModule
    Share,
    Wish
  }, props: ['postData'],
  setup (props, context) {
    const $store = useStore()
    const $route = useRoute()
    const $router = useRouter()
    const $q = useQuasar()
    const $t = i18n.global.t
    const state = ref(false)
    const param_id = ref(false)
    const post = ref(null)
    const plan = ref(null)
    const payment_expiry  = ref(null)
    const postSubcategoryLocales = ref([])
    const postSubcategoryID = ref(false)
    const userPost = ref(false)
    const end_date = ref(null)
    const subcategory = ref({})
    const contacts = ref(null) // TagSharePost
    const view = ref(false)
    const apiLinks = ref(false)
    const links = ref(false) // LinkPaymentPostModule
    // === TagPayment ====== \\
    const count = ref(0)
    // const payment = ref(0)
    // const diff = ref(0)
    const token = ref(null)
    const PayerID = ref(null)
    const amount = ref(0)
    const gallery_page = ref(0)
    const worldwide = ref(0)
    const bump_up = ref(0)
    const recurring = ref(1)
    const payload = ref({})
    // === TagPayment end === \\
    const post_title = ref(null)
    const post_title_data = ref(null)
    const price = ref(null)
    const price_data = ref(null)
    const address = ref(null)
    const address_data = ref(null)
    const city = ref(null)
    const city_data = ref(null)
    const postal_code = ref(null)
    const country = ref(null)
    const country_data = ref(null)
    const phone = ref(null)
    const phone_data = ref(null)
    const postal_code_data = ref(null)
    const description = ref(null)
    const description_data = ref(null)
    const location = ref(null)
    const update_location = ref(false)
    const location_data = ref(null)
    // ======================== \\
    const postPlace = ref(false)
    const sharePost = ref(false)
    const filesLibrary = ref(false)
    const categories = ref([])
    const subcategories = ref(null)
    const preview = ref(false)
    const subcategory_id = ref(false)
    const loader = ref(false)
    const images = ref([])
    const user = ref({})
    const viewMap = ref(false)
    const map = ref(null)
    const start_date = ref(null)
    const  flag = ref('fa-flag')
    const shareData = ref({})
    const myRoom = ref(0)

    const payment = computed(() => amount.value*recurring.value + gallery_page.value + worldwide.value +
                    ((payment_expiry.value || !PayerID.value) ? 0 : bump_up.value))
    const Route = props.postData?{ params: { id: props.postData.id }, name: 'public.post.id' }:$route
    const ipDebug = computed(() => $store.getters['config/ipDebugGetter'])
    const loc = computed(() => $store.getters['users/locationGetter'])
    const auth = computed(() => $store.getters['users/authGetter'])
    const post_id = computed(() => Route.params?.id)

    const copyLink = window.origin+'/post/'+post_id.value // TagCopyPostLink

    onUpdated(() => onLoad(Route))

    onMounted(() => {
      if (props.postData) getPost({post: props.postData})
      else onLoad(Route)
    })

    function postAction(payload) {
      return crudAction({...payload, ...{
        url: 'api/categories/postAction',
      }})
    }

    async function getPost(res) {
      const authPost = post.value = res.post; param_id.value = res.post?.id

      links.value = authPost?.payments?.[0]?.links // TagImplementTestPayment - DBLinks - TagLinks
      plan.value = authPost?.payments?.[0]?.plan // TagActivePlan
      start_date.value = authPost?.payments?.[0]?.start_date
      end_date.value = authPost?.payments?.[0]?.end_date
      PayerID.value = authPost?.payments?.[0]?.PayerID
      token.value = authPost?.payments?.filter(t => t?.token!==null)[0]?.token
                                                         ||$route.query?.token
      console.log('token.value', token.value)

      let payment_end_date = new Date(); authPost.payments.forEach(payment => {
        if (payment.PayerID) return payment_end_date = payment.end_date
      }); payment_expiry.value = dateDiffIndays(new Date(), payment_end_date) < 1  // ToFixPostPopUp
      // payment_expiry.value = res.payment_expiry < 1 // TagCheckout

      user.value = authPost?.user
      userPost.value = user.value?.id === auth.value?.id

      postSubcategoryLocales.value = authPost?.subcategory?.locales||[{subcategoryName: authPost?.subcategoryName}]
      postSubcategoryID.value = authPost?.subcategory_id

      post_title.value = authPost?.post_title
      price.value = authPost?.price>0?authPost?.price:null
      count.value = authPost?.count // TagView: ViewModule
      address.value = authPost?.address || ''
      city.value = authPost?.city || ''
      country.value = authPost?.country || ''
      phone.value = authPost?.phone || user.value?.phone || ''
      location.value = authPost?.location
      postal_code.value = authPost?.postal_code || ''
      description.value = authPost?.description

      JSON.parse(authPost?.flags || '[]').forEach(flagPost => {
        if (flagPost?.user_id === auth.value?.id && authPost?.id === flagPost?.post_id) {
          flag.value = flagPost?.state ? 'fa-flag' : 'fa-trash-restore-alt'
          state.value = flagPost?.state; return '' // Auth Flag
        } // TagFlagPost: PostModule
      }); view.value = true

      shareData.value = {
        title: authPost?.post_title,
        text: authPost?.post_title,
        price: authPost?.price,
        url: copyLink
      }; myRoom.value = authPost?.user_id !== auth.value?.id
      if ($route.query?.token) paymentValidation()
      if (props.postData) crudAction({
        url: auth.value?.id?`api/users/${auth.value?.id}`:'api/users',
        method: auth.value?.id?'put':'post',
        id: auth.value?.id||0,
        post_id: props.postData?.id,
        ip: userData?.ip,
        slug: `/post/${props.postData?.id}` // Post View
      }).catch(e => notifyAction({error: 'popupView', e}))
    }

    async function onLoad(route) {
      const radioCategory = route?.meta?.radioCategory
      if (route.name === 'public.post.id') { // TagCategoryPosts: Sub/CategoryModule From Categories.vue

        postAction({ post_id: route.params?.id, auth_id: auth.value?.id, method: 'get' })
        .then(res => getPost(res)).catch(e => notifyAction({error: 'postAction', e}))

      } else if (radioCategory) { // TagRadioCategory: CategoryModule

        const res = computed(() => $store.getters['categories/categoriesGetter'])

        post.value = plan.value = start_date.value = end_date.value = post_title.value = price.value =
        address.value = city.value = postal_code.value = phone.value = description.value = null
        subcategory_id.value = param_id.value = false; view.value = true; location.value = loc.value
        // Categories Sorted
        categories.value = res.value?.sort((a, b) => a?.locales?.categoryName?.localeCompare(b?.locales?.categoryName))

      } else { // TagRadioSubcategory: SubcategoryModule

        const getSubcategory = route
        subcategory_id.value = getSubcategory.id

        postSubcategoryLocales.value = getSubcategory.locales

        subcategory.value = getSubcategory
        userPost.value = preview.value = true // TagFlagPostButton
        if (props.postData) userPost.value = !props.postData

        const post_id = route=='file'?param_id.value:Route.params.id

        if (post_id) postAction({ post_id, auth_id: auth.value?.id, method: 'get' }).then(res => {
            param_id.value = $route.params.id; getPost(res) // TagUpdatePost: UpdateCategoryPostModule
          }).catch(e => notifyAction({error: 'postCategoriesAction', e}))
        else crudAction({ postPage: $route.query.go=='categories' })
          .catch(e => notifyAction({error: 'postPageAction', e}))
      }
    } watch(payment, () => savePayment())

    function savePayment() {
      payload.value = {
        // token, PayerID, // Update Payment
        // token: token.value, PayerID: PayerID.value,
        token: token.value,
        capture: !!token.value,
        // PayerID: $route.query?.PayerID,
        // =======================Create Payment====================================== \\
        url: token.value?'api/categories/payment':'api/categories',
        method: token.value?'put':'post',
        order: !token.value,
        href: props.postData?window.origin+'/post/'+props.postData.id:window.location.href,
        sAdminIP: ipDebug.value ? !ipDebug.value : auth.value.id !== 1,
        plans: [
          {name: amount.value!==15||'Ultimate', payment: amount.value, amount: amount.value*recurring.value},
          {name: amount.value!==10||'Gold', payment: amount.value, amount: amount.value*recurring.value},
          {name: amount.value!==5||'Silver', payment: amount.value, amount: amount.value*recurring.value},
          {name: !bump_up.value||'Bump Up', payment: bump_up.value, amount: bump_up.value},
          {name: !gallery_page.value||'Gallery Page', payment: gallery_page.value, amount: gallery_page.value},
          {name: !worldwide.value||'Worldwide', payment: worldwide.value, amount: worldwide.value}
        ],recurring, payment, post_id//, auth
      }
    } // TagPaymentCreate: PaymentPostModule

    function paymentValidation() {
      preview.value = true
      savePayment()
      crudAction(payload.value).then(() => paymentResponse(), $router.replace({'query': null}))
        .catch(e => notifyAction({error: 'PaymentValidationAction', e}))
    } // TagPayment: PaymentValidationPostModule

    function paymentResponse(apiLinks) {
      console.log('paymentResponse', apiLinks)

      crudAction({checkout: true}); if (apiLinks) {
        preview.value = true
      } else {
        count.value=amount.value=gallery_page.value=worldwide.value=bump_up.value=0
        $store.dispatch('users/authAction')
      } onLoad(Route)

    } // TagPayment: UpdatePaymentPostModule

    return {
      ipDebug,
      auth,
      myRoom,
      height: screen.height/($q.platform.is.mobile?1.2:1.35),
      desktop: $q.platform.is.desktop,
      mobile: $q.platform.is.mobile,
      contacts, // TagSharePost
      copyLink,
      shareData,
      view,
      flag,
      apiLinks,
      links, // LinkPaymentPostModule
      // === TagPayment ====== \\
      cardHeight: ref('height: 200px;'),
      count,
      // payment,
      // diff,
      amount,
      gallery_page,
      worldwide,
      bump_up,
      recurring,
      payload,
      options: [1,2,3,4,6,7,8,9,10,11,12],
      // === TagPayment end === \\
      url,
      post,
      post_title,
      post_title_data,
      price,
      price_data,
      address,
      address_data,
      city,
      city_data,
      postal_code,
      country,
      country_data,
      phone,
      phone_data,
      postal_code_data,
      description,
      description_data,
      location,
      update_location,
      location_data,
      // ============ \\
      postPlace,
      sharePost,
      filesLibrary,
      categories,
      subcategories,
      subcategory_id,
      param_id,
      preview,
      postSubcategoryID,
      postSubcategoryLocales,
      autoplay: ref(true),
      userPost,
      loader,
      images,
      user,
      viewMap,
      map,
      token,

      plan,
      subcategory,
      payment_expiry,
      start_date,
      end_date,
      PayerID,
      state,

      slide: ref(0),
      fullscreen: ref(false),
      update_category: ref(false),
      zoom: ref(false),

      darkMode: computed(() => $q.localStorage.getItem('darkMode')),
      role: computed(() => $store.getters['users/rolesGetter']),
      pics: computed(() => post.value?.pics),

      onLoad,
      dateDiffIndays,
      paymentValidation,
      paymentResponse,

      wish: () => onLoad(Route), // TagFavorite: FavoriteModule
      previewPost: () => preview.value = false, // TagPreviewPost: PostModule
      previewClose: () => preview.value = true, // TagPreviewClose: PostModule

      subcategoriesSorted (subcategories) {
        let NewSubcategories = []; if (subcategories) subcategories.forEach(subcategory => {
          NewSubcategories.push({id: subcategory.id, category_id: subcategory.category_id, locales: [subcategory.locales[0]] })
        }); try {NewSubcategories.sort((a, b) => a.locales[0].subcategoryName.localeCompare(b.locales[0].subcategoryName))}
        catch (e) {notifyAction({error: 'RadioSubcategory', e})}; return NewSubcategories
      }, // TagRadioSubcategory: SubcategoryModule

      googleMap () {
        if (!auth.value) return $router.push({ path: '/login' })
        viewMap.value = true
        map.value = `
            <iframe
                width="100%"
                height="300"
                frameborder="0" style="border:0"
                src="https://www.google.com/maps/embed/v1/place?key=${process.env.MAP_API_KEY}
                    &q=${address.value}, ${city.value}, ${postal_code.value}" allowfullscreen>
            </iframe>` // https://vuejs.org/v2/cookbook/practical-use-of-scoped-slots.html#1-Create-a-component-that-initializes-our-map
      }, // TagViewMap: PostModule
      chatRoom () {
        loader.value = true
        crudAction({
          url: 'api/categories',
          method: 'post',
          post_id: post_id.value,
          user_id: auth.value?.id||null,
          create_room: true
        }).then(roomId => {
          console.log('roomId', roomId)
          $router.push({ path: `/chat/${roomId}` })
        }).catch(e => notifyAction({error: 'chatRoom', e}))
      }, // TagChatRoom: chatRoomModule
      add_post (subcategoryID) {
        loader.value = true
        api({
          url: 'api/categories',
          method: 'post',
          data: {
            addPost: true,
            user_id: auth.value.id,
            category_id: subcategory.value?.category_id,
            subcategory_id: subcategoryID,
            post_title: post_title.value,
            price: price.value,
            address: address.value,
            city: city.value,
            country: country.value,
            phone: phone.value,
            postal_code: postal_code.value,
            description: description.value,
            location: postPlace.value || loc.value, // TagAddLocation: CategoryModule
            lat: userData.latitude??userData.lat,
            lon: userData.longitude??userData.lon
          }
        }).then(res => {
          loader.value = false; notifyAction({success: res.data.success})
          $router.push({ path: `/post/${res.data.post_id}?preview=1` }) // Go To Edit Post
        }).catch(e => {
          loader.value = false // price_data
          const message = e?.response?.data?.message
          post_title_data.value = e?.response?.data?.errors?.post_title?.[0] || message
          price_data.value = e?.response?.data?.errors?.price?.[0] //|| message
          description_data.value = e?.response?.data?.errors?.description?.[0] || message
          city_data.value = e?.response?.data?.errors?.city?.[0] //|| message
          location_data.value = e?.response?.data?.errors?.location?.[0] //|| message
        })
      }, // TagAddPost: PostModule
      update_post(postID) {
        api({
          url: 'api/categories/update_post',
          method: 'put',
          data: {
            post_id: postID,
            post_title: post_title.value,
            price: price.value,
            address: address.value,
            city: city.value,
            phone: phone.value,
            country: country.value,
            postal_code: postal_code.value,
            description: description.value,
            category_id: !subcategory.value||subcategory.value.category_id,
            subcategory_id: subcategory_id.value,
            update_location: update_location.value,
            location: postPlace.value || loc.value, // TagUpdateLocation: CategoryModule
            lat: userData.latitude??userData.lat,
            lon: userData.longitude??userData.lon
          }
        }).then(res => {
          location.value = res?.data?.post?.location
          notifyAction({success: res?.data?.success})
          context.emit('reload', props.postData) // TagEditPost
        }).catch(e => {
          notifyAction({error: 'updatePostAction', e})
          location_data.value = e?.response?.data?.errors?.location?.[0] || e?.response?.data?.message
        })
      }, // TagUpdatePost: PostModule
      flagPost(postID) {
        crudAction({
          url: 'api/categories/flagPost',
          method: 'put',
          flagState: 1,
          post_id: postID,
          user_id: auth.value?.id,
          success: state.value ? 'Post Flag Successfully' : 'Post Take Off From Flag'
        }).then(() => onLoad(Route)).catch(e => notifyAction({error: 'flagPostErr', e}))
      }, // TagFlagPostButton: PostModule
      deleteImage (picID) {
        crudAction({
          url: `api/categories/${picID}`,
          method: 'delete',
          deletePic: true,
          success: $t('Picture Deleted Successfully')
          // auth: auth||null,
          // forever: pic.forever,
          // pic: pic
        }).then(() => {
          onLoad('file')
        }).catch(e => notifyAction({error: 'DeletePicsAction', e}))

        // api.delete(`api/categories/${picID}?pic=1`)
      }, // TagDeleteImage: PicModule
    }
  }
}
</script>

<style scoped>
  [v-cloak] {
    display: none !important;
  }
  .cardBorderTop-1 {
    border-top-color: rgba(0, 0, 0, 0.12);
    border-top-width: 20px;
  }
  .cardBorderTop-2 {
    border-top-color: rgba(192, 192, 192, 1);
    border-top-width: 20px;
  }
  .cardBorderTop-3 {
    border-top-color: rgba(255, 215, 0, 1);
    border-top-width: 20px;
  }
  .cardBorderTop-4 {
    border-top-color: rgba(0, 0, 0, 0.50);
    border-top-width: 20px;
  }
</style>
