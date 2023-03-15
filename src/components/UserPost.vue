<template>
  <q-dialog v-model="print"><!--========== Receipt PopUp ============-->
    <q-card class="my-card text-black">
      <q-card-section class="bg-primary text-white">
        <q-btn color="primary" text-color="white" class="float-right" dense round icon="close" v-close-popup />
        <!-- <div class="text-h6">{{$t('reports')}}</div> -->
      </q-card-section>
      <Reports :post_reports="post?.reports" />
    </q-card>
  </q-dialog><!--=========================== Receipt PopUp End ========-->

  <q-dialog v-model="viewMap"><!--== popMap =====================-->
    <q-card class="my-card text-white" style='width:800px'>
      <q-card-section class="bg-primary">
        <q-btn color="primary" text-color="white" class="float-right" dense round icon="close" v-close-popup />
        <div class="text-h6">
          {{address}} {{city}} {{postal_code}}
        </div>
      </q-card-section>
      <div  v-html="map"/>
    </q-card><!-- TagViewMap: PostModule -->
  </q-dialog><!--=================== popMap End =================-->

  <q-dialog v-model="postPlace"><!-- Loaction PopUp =============-->
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <q-btn color="primary" text-color="white" class="float-right" dense round icon="close" v-close-popup />
        <div class="text-h6">{{$t('post_location')}}</div>
      </q-card-section>
      <postLocation /><!-- TagAddLocation ToFix -->
    </q-card>
  </q-dialog><!--=================== Loaction PopUp End =========-->

  <q-dialog v-model="filesLibrary"><!-- TagFiles =============-->
    <q-card class="my-card col-12" style="width:100%; max-width: 1000px">
      <files v-on:reload="onLoad" :post="post"/>
    </q-card><!-- TagFiles: FilesModule -->
  </q-dialog><!--====================== TagFiles End =========-->

  <q-layout view="lHh lpr lFf" container :style="'height:' + height + 'px'" class="shadow-2 rounded-borders">

    <q-header elevated>
      <q-card class="my-card" v-if="!subcategory_id&!param_id&view">
        <!-- <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{$t('post_category')}}</div>
          <div class="text-subtitle2">by John Doe</div>
        </q-card-section> -->
        <q-bar class="bg-primary">{{$t('post_category')}}</q-bar>
        <q-card-section :class="'row '+(darkMode||'text-black')">
          <q-list class="col-6">
            <!--
              Rendering a <label> tag (notice tag="label")
              so QRadios will respond to clicks on QItems to
              change Toggle state.
            -->
            <!-- <span> -->
              <q-item tag="label" v-ripple v-for="(category, key) in categories" :key="key">
                <q-item-section avatar>
                  <q-radio v-model="subcategories" :val="category.subcategories"  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{category.locales ? category.locales.categoryName : 'categoryName'}}</q-item-label>
                </q-item-section>
              </q-item><!-- TagRadioCategory: CategoryModule -->
            <!-- </span> -->
          </q-list>
          <q-list class="col-6">
              <q-item tag="label" :key="key"
                v-ripple clickable @click.prevent="onLoad(subcategory)"
                v-for="(subcategory, key) in subcategoriesSorted(subcategories)"
              ><!-- Post :to="`/post/${subcategory.subcategoryName}`"-->

                <q-item-section avatar>
                  <q-icon name="fas fa-arrow-alt-circle-right" />
                </q-item-section>
                <q-item-section v-for="(locale, key) in subcategory.locales" :key="key">
                  <q-item-label>{{locale.subcategoryName}}</q-item-label>
                </q-item-section>
              </q-item><!-- TagRadioSubcategory: SubcategoryModule -->
            <!-- </div> -->
          </q-list>
        </q-card-section>
      </q-card><!--===================== TagPostCategory: PostModule -->

      <q-bar v-else-if="view"><!-- ifHere -->

          <q-btn v-for="(postLocale, key) in postSubcategoryLocales" :key="key"
            :label="mobile||postLocale.subcategoryName" icon="fas fa-undo"
            :to="{ name: 'public.subcategory.id', params: { id: postSubcategoryID || subcategory_id } }"
          /><!-- TagCategoryPosts: CategoryModule From Category.vue -->

          <q-btn label="flag"
            :icon="`fas ${flag}`" v-if="!preview&&!post?.fav"
            @click.prevent="flagPost(param_id)"
          /><!-- TagFlagPostButton: PostModule -->

          <q-btn v-if="token"
            icon="fas fa-cart-arrow-down"
            @click.prevent="paymentValidation"
          /><!-- TagPayment: PaymentValidationPostModule -->

          <q-space />

          <wish :post="post" :auth="auth&&!postData"
            @favorite="wish" v-if="param_id"
          /><!-- TagFavorite: FavoriteModule -->

          <template v-if="newPost&&preview">

            <q-btn flat icon="fas fa-street-view"
              :label="$t(location)" class="float-right"
              @click.prevent="postPlace = true"
            /><!-- TagAddLocation - TagUpdateLocation: CategoryModule  v-if="ipDebug"-->

            <q-btn dense flat icon="fas fa-eye"
              title="Views" @click.prevent="previewPost"
              class="float-right"
              ><q-badge color="orange" text-color="black" :label="count" floating v-if="count" /><!-- TagView: ViewModule -->
            </q-btn><!-- TagPreviewPost -->
          </template>

          <q-btn v-else-if="newPost"
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
      <q-page class="flex flex-center q-pa-md">

        <q-form class="q-gutter-md">
          <div class="*col-md-12 *q-pa-md" v-if="preview&newPost">

            <div class="row">
              <div class="col-xs-12 col-md-6">
                <q-input
                  filled
                  type="text"
                  v-model="post_title"
                  :label="$t('post_title')+'*'" clearable
                  :error="post_title_data ? true : false"
                  :error-message='post_title_data'
                /><!-- lazy-rules -->
              </div><!-- post_title -->
              <div class="col-xs-6 col-md-4">
                <q-input
                  filled
                  type="text"
                  v-model="price"
                  :label="$t('Price')" clearable
                  :error="price_data ? true : false"
                  :error-message='price_data'
                /><!-- lazy-rules -->
              </div><!-- price -->
              <div class="col-xs-6 col-md-2">
                <q-input
                  filled
                  type="text"
                  maxlength="3"
                  v-model="currency_code"
                  :label="$t('currency_code')" clearable
                  :error="currency_code_data ? true : false"
                  :error-message='currency_code_data'
                /><!-- lazy-rules -->
              </div><!-- currency_code -->
              <div class="col-xs-12 col-md-6">
                <q-input
                  filled
                  type="text"
                  v-model="address"
                  :label="$t('address')" clearable
                  :error="address_data ? true : false"
                  :error-message='address_data'
                />
              </div><!-- address -->
              <div class="col-xs-6 col-md-4">
                <q-input
                  filled
                  lazy-rules
                  type="text"
                  v-model="city"
                  :label="$t('city')" clearable
                  :rules="[val => val && val.length > 0 || $t('add_city')]"
                  :error="city_data ? true : false"
                  :error-message='city_data'
                />
              </div><!-- city -->
              <div class="col-xs-6 col-md-2">
                <q-input
                  filled
                  lazy-rules
                  type="text"
                  v-model="region"
                  :label="$t('region')" clearable
                  :error="region_data ? true : false"
                  :error-message='region_data'
                />
              </div><!-- region -->
              <div class="col-xs-6 col-md-4">
                <q-input
                  filled
                  lazy-rules
                  type="text"
                  v-model="postal_code"
                  :label="$t('postal_code')" clearable
                  :error="postal_code_data ? true : false"
                  :error-message='postal_code_data'
                />
              </div><!-- postal_code -->
              <div class="col-xs-6 col-md-4">
                <q-input
                  filled
                  lazy-rules
                  type="text"
                  v-model="country"
                  :label="$t('country')" clearable
                  :rules="[val => val && val.length > 0 || $t('country_city')]"
                  :error="country_data ? true : false"
                  :error-message='country_data'
                />
              </div><!-- country -->
              <div class="col-xs-12 col-md-4">
                <q-input
                  v-model="phone"
                  filled type="tel"
                  :label="$t('phone')"
                  lazy-rules clearable
                  :rules="[val => val && val.length > 0 || $t('add_phone')]"
                />
              </div><!-- phone -->
            </div><!-- Coordinate -->

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

            <div class="cards row" v-if="param_id && (payment_expiry || amount || !PayerID)"><!-- toFix - watchWorking -->
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
                  </div>
                  <div class="text-center q-pa-md" buttom>
                    <q-btn flat round icon="fas fa-question">
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
                        {label: $t('free'), value: 0 }
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
                        {label: cy($5=xRate(5)), value: 5}
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
                        {label: cy($10=xRate(10)), value: 10}
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
                        {label: cy($15=xRate(15)), value: 15}
                      ]"
                    />
                  </div>

                </q-list>
              </div><!-- card-4 -->
            </div><!-- TagPayment: CardPaymentPostModule -->

            <q-btn flat class="row" @click="print=true" v-else-if="start_date">
              <div class="col-md-12 q-pa-md">
                {{$t('plan')}}: {{plan}} | {{start_date}} <q-icon name='fas fa-long-arrow-alt-right'/> {{end_date}}
              </div>
            </q-btn><!-- TagActivePlan end_date-->

            <div class="row" v-if="param_id">

              <div class="col-md-3 q-pa-md">
                {{$t('email')}}: {{user.email}}
              </div><!-- TagEmail -->
              <div class="col-md-3 q-gutter-sm" v-if="!post.gallery_page">
                <q-btn flat round icon="fas fa-question">
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
                    {{$t('gallery_page_tooltip')}}
                  </q-tooltip>
                </q-btn>
                <q-checkbox v-model="gallery_page"
                  :label="`${$t('Gallery Page')} ${cy($20=xRate(20))}`"
                  :true-value="20"
                ><!-- TagGallery -->
                </q-checkbox>
              </div><!-- TagGallery -->
              <div class="col-md-3 q-gutter-sm" v-if="!post.worldwide">
                <q-btn flat round icon="fas fa-question">
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
                    {{$t('worldwide_tooltip')}}
                  </q-tooltip>
                </q-btn>
                <q-checkbox v-model="worldwide"
                  :label="`${$t('Worldwide')} ${cy($200=xRate(200))}`"
                  :true-value="200"
                >
                </q-checkbox>
              </div><!-- TagWorldwide -->
              <div class="col-md-3 q-gutter-sm" v-if="!amount">
                <q-btn flat round icon="fas fa-question">
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
                    {{$t('bump_up_tooltip')}}
                  </q-tooltip>
                </q-btn>
                <q-checkbox v-model="bump_up"
                  :label="`${$t('Bump Up')} ${cy($2=xRate(2))}`"
                  :true-value="2"
                /><!-- https://quasar.dev/vue-components/checkbox#custom-model-values -->
              </div><!-- TagBumpUp -->
              <div v-if="amount" class="col-md-3 q-gutter-sm">
                <q-select v-model="month" :options="options" :label="$t('Month')" style="min-width: 300px">
                  <template v-slot:prepend>
                    <q-icon name="fas fa-sync" />
                  </template>
                </q-select>
              </div><!-- TagMonth -->

            </div><!-- TagPayment: OptionPaymentPostModule -->

            <div class="col-md-12 q-pa-md" v-if="(amount||bump_up||gallery_page||worldwide)"><!-- toFix - watchWorking -->
            <!-- <div class="col-md-12 q-pa-md" v-if="(amount||bump_up||gallery_page||worldwide||(bump_up&&!(payment_expiry||!PayerID)))"> -->
              <checkout v-on:paypal="paymentResponse" :payload="payload" /><!-- TagPaymentCheckout:  -->
            </div><!--TODO <div class="text-h6 bg-red" v-else>{{$t('Currency Not Available Yet')}}</div> -->

            <div class="q-ma-md"  v-if="!auth"><!--===== Guest ====================-->
              <q-btn icon="add_to_queue" :label="$t('register')" to='/register'/>
              <q-btn icon="warning" :label="$t('Login Before Posting')" to='/login'/>
            </div><!--================================== Guest End ================-->

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
                    :label="location_data || $t('update_post')"
                    class="q-ma-md"
                    @click.prevent="update_post(param_id)"
                  /><!-- UpdatePostModule -->
                </div><!--======= TagUpdatePost =============-->
                <div v-else>
                  <q-btn color="primary"
                    icon="fas fa-plus-circle"
                    :loading="loader"
                    :label="location_data || $t('add_post')"
                    class="q-ma-md"
                    @click.prevent="add_post(subcategory_id)"
                  /><!-- AddPostModule -->
                </div><!--======= TagAddPost ================-->
              </div><!--========= CrUp =======================-->
              <div class="col-md-3" v-if="param_id">
                <q-btn color="primary"
                  icon="fas fa-edit"
                  :loading="loader"
                  :label="$t('update_category')"
                  class="q-ma-md"  v-if="role.admins"
                  :to="'/post/'+param_id+'/categories'"
                /><!-- TagUpdatePost: UpdateCategoryPostModule -->
              </div><!-- q-btn dense round flat icon="fas fa-eye" -->
              <div class="col-md-3" v-if="param_id">
                <q-btn color="orange" class="q-ma-md"
                  icon="fas fa-upload"
                  :label="$t('Publish Post')"
                  :loading="loader" v-if="!post_end_date"
                  @click.prevent="publishPost(param_id)"
                /><!-- TagPublishPost: PostModule -->
              </div>
            </div><!--=========== CRUD =======================-->

            <q-separator /><br />

            <div class="q-col-gutter-md row items-start"><!-- v-if="pics" -->
              <div class="col-2" v-for="(data, key) in pics" :key="key">
                <q-img :src="baseURL+'/'+data.pic" :ratio="1">
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

          </div><!--======== TagNewPost ===============-->

          <div class="*col-md-12 *q-pa-md" v-else>

            <q-card class="my-card">
              <div class="text-h4" v-html="post_title"/>

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
                  :name="key" :img-src="`${baseURL}/${data.pic}`"
                ><q-img :src="`${baseURL}/${data.pic}`" v-if="zoom"/><!-- https://quasar.dev/vue-components/img#example--fit-modes -->
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
                  /><!-- TagViewMap: PostModule -->
                  <q-btn type="a" class="*col-lg-3 *q-mb-md"
                    icon="fas fa-envelope" target="_blank" v-if="user?.email" flat
                    :href="'mailto:' + user?.email + '?subject=' + post_title + '&body=From ' + copyLink"
                  /><!-- :label="user.email" -->
                  <q-btn type="a" class="*col-lg-2 *q-mb-md"
                    icon="fas fa-phone" v-if="phone"
                    :href="'tel:' + phone" flat
                  /><!-- :label="phone" -->
                  <q-btn flat round v-if="myRoom"
                    icon="fas fa-comments fa-2x"
                    @click.prevent="chatRoom"
                  /><!-- TagChatRoom: chatRoomModule -->
                </q-card-section>

                <q-card-section class="col-6 *q-mb-md" align="right">
                  <share :shareData="shareData"/>
                </q-card-section><!-- TagSharePost: PostModule - Navigator Share -->
              </div>

              <q-separator />

              <div class="text-h6" behavior="mobile" v-html="description"/>
            </q-card>

          </div><!--======== TagPreviewPost ============-->
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
import { i18n, baseURL, api, xRate, cy, ipData } from 'boot/axios'
import { useCrudStore } from 'stores/crud'
import { dateDiffIndays } from './Functions.ts'
import postLocation from './PostLocation.vue'
import Checkout from './UserCheckout.vue'
import Reports from './UserReports.vue'
import Wish from './UserWish.vue'
import Files from './UserFiles.vue'
import Share from './UserShare.vue'

/**
 * Tags: TagFlagPost - TagAddPost - TagPayment - TagAddLocation - TagPublishPost
 *       TagPreviewPost - TagCheckout - TagPostPic - TagSharePost - TagActivePlan
 *       TagRadioCategory - TagRadioSubcategory - TagImplementTestPayment - TagPostCarousel
 *       FavoriteModule - PaymentPostModule - ViewModule - chatRoomModule - SubcategoryModule
 *       LinkPaymentPostModule - CategoryModule - ipDebugPaymentPostModule - PostModule - FilesModule
 *
 * @from CategoryController
 */
export default {
  components: {
    postLocation,
    Checkout,
    Reports,
    Files, // TagFiles: FilesModule
    Share,
    Wish
  }, props: ['postData', 'myPosts'],
  setup (props, context) {
    const $t = i18n.global.t
    const $q = useQuasar()
    const $store = useStore()
    const store = useCrudStore()
    const { crudAction, notifyAction } = store
    const $route = useRoute()
    const $router = useRouter()
    const state = ref(false)
    const param_id = ref(false)
    const post = ref(null)
    const plan = ref(null)
    const payment_expiry = ref(null)
    const postSubcategoryLocales = ref([])
    const postSubcategoryID = ref(false)
    const newPost = ref(false)
    const end_date = ref(null)
    const post_end_date = ref(null)
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
    const month = ref(1)
    const payload = ref({})
    const $5 = ref(null)
    const $10 = ref(null)
    const $15 = ref(null)
    const $2 = ref(null)
    const $20 = ref(null)
    const $200 = ref(null)
    // === TagPayment end === \\
    const post_title = ref(null)
    const post_title_data = ref(null)
    const price = ref(null)
    const price_data = ref(null)
    const currency_code = ref(null)
    const currency_code_data = ref(null)
    const address = ref(null)
    const address_data = ref(null)
    const city = ref(null)
    const city_data = ref(null)
    const region = ref(null)
    const region_data = ref(null)
    const postal_code = ref(null)
    const postal_code_data = ref(null)
    const country = ref(null)
    const country_data = ref(null)
    const phone = ref(null)
    const phone_data = ref(null)
    const description = ref(null)
    const description_data = ref(null)
    const location = ref(null)
    // const update_location = ref(false)
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
    const flag = ref('fa-flag')
    const shareData = ref({})
    const myRoom = ref(0)
    const update_category = ref(false)

    const Route = props.postData?{ params: { id: props.postData.id }, name: 'public.post.id' }:$route
    const payment = computed(() => amount.value*month.value + gallery_page.value + worldwide.value +
                                 (!amount.value?bump_up.value:0))
    const ipDebug = computed(() => $store.getters['config/ipDebugGetter'])
    const loc = computed(() => $store.getters['users/locationGetter'])
    const role = computed(() => $store.getters['users/rolesGetter'])
    const auth = computed(() => $store.getters['users/authGetter'])
    const position = computed(() => store['position']?.position)
    const post_id = computed(() => Route.params?.id)

    const copyLink = window.origin+'/post/'+post_id.value // TagCopyPostLink

    onUpdated(() => onLoad(Route))

    onMounted(() => {
      if (props.postData) getPost(props.postData)
      else onLoad(Route)
    })

    function postAction(payload) {
      return crudAction({...payload, ...{
        url: 'api/categories/postAction',
      }})
    } watch(position, val => !val||update_post(post_id.value))

    async function getPost(authPost) {

      const flagPost = authPost?.flag; view.value = true
      const payment_end_date = authPost?.payments.filter(p => p.PayerID)?.[0]?.end_date

      post.value = authPost; param_id.value = authPost?.id
      state.value = flagPost?.state // TagFlagPost: PostModule
      user.value = authPost?.user // Post Owner
      newPost.value = user.value?.id === auth.value?.id
      flag.value = state.value ? 'fa-trash-restore-alt' : 'fa-flag'
      links.value = authPost?.payments?.[0]?.links // TagImplementTestPayment - DBLinks - TagLinks
      plan.value = authPost?.payments?.[0]?.plan // TagActivePlan
      start_date.value = authPost?.payments?.[0]?.start_date
      end_date.value = authPost?.payments?.[0]?.end_date
      post_end_date.value = authPost?.end_date
      PayerID.value = authPost?.payments?.[0]?.PayerID
      token.value = authPost?.payments?.filter(t => t?.token)?.[0]?.token
      /* Payment Validation Token */               || $route.query?.token

      payment_expiry.value = dateDiffIndays(Date(), payment_end_date) < 1

      postSubcategoryLocales.value = authPost?.subcategory?.locales||[{subcategoryName: authPost?.subcategoryName}]
      postSubcategoryID.value = authPost?.subcategory_id

      post_title.value = authPost?.post_title
      price.value = authPost?.price>0?authPost?.price:null
      currency_code.value = authPost?.currency_code
      count.value = authPost?.count // TagView: ViewModule
      location.value = authPost?.location
      address.value = authPost?.address || ''
      city.value = authPost?.city || ''
      region.value = authPost?.region || ''
      postal_code.value = authPost?.postal_code || ''
      country.value = authPost?.country || ''
      phone.value = authPost?.phone || user.value?.phone || ''
      description.value = authPost?.description

      shareData.value = {
        title: authPost?.post_title,
        text: authPost?.post_title,
        price: authPost?.price,
        price: authPost?.price,
        currency_code: authPost?.currency_code,
        url: copyLink
      }; myRoom.value = authPost?.user_id !== auth.value?.id
      if (!authPost) {$router.push({ path: '/' }); notifyAction({message: 'postNotAvailable'})}
      if (props.myPosts==='flag') crudAction({flag, mutate: 'postPage'})
      if ($route.query?.token) paymentValidation()
      if (props.postData) crudAction({
        url: auth.value?.id?'api/users/view':'api/users',
        method: auth.value?.id?'put':'post',
        id: auth.value?.id||0,
        post_id: props.postData?.id,
        ip: ipData?.ip,
        slug: `/post/${props.postData?.id}` // Post View
      }).catch(e => notifyAction({error: 'popupView', e}))

    } // watch(state, val => crudAction({flag: val}))

    async function onLoad(route) {
      const radioCategory = route?.meta?.radioCategory
      if (route.name === 'public.post.id') { // TagCategoryPosts: Sub/CategoryModule From Categories.vue

        postAction({ post_id: route.params?.id, auth_id: auth.value?.id, method: 'get' })
        .then(authPost => getPost(authPost)).catch(e => notifyAction({error: 'postAction', e}))

      } else if (radioCategory) { // TagRadioCategory: CategoryModule

        const res = computed(() => store['categoriesGetter'])

        post.value = plan.value = start_date.value = end_date.value = post_title.value = price.value = currency_code.value =
        address.value = city.value = region.value = postal_code.value = country.value = phone.value = description.value = null
        subcategory_id.value = param_id.value = false; view.value = true; location.value = loc.value
        // Categories Sorted
        categories.value = res.value?.sort((a, b) => a?.locales?.categoryName?.localeCompare(b?.locales?.categoryName))

      } else { // TagRadioSubcategory: SubcategoryModule

        const getSubcategory = route
        subcategory_id.value = getSubcategory.id

        postSubcategoryLocales.value = getSubcategory.locales

        subcategory.value = getSubcategory
        newPost.value = preview.value = true // TagFlagPostButton
        if (props.postData) newPost.value = !props.postData

        const post_id = route=='file'?param_id.value:Route.params.id

        if (post_id) postAction({ post_id, auth_id: auth.value?.id, method: 'get' }).then(res => {
            param_id.value = $route.params.id; getPost(res) // TagUpdatePost: UpdateCategoryPostModule
          }).catch(e => notifyAction({error: 'postCategoriesAction', e}))
        else crudAction({ postPage: $route.query.go=='categories', mutate: 'postPage' })
          .catch(e => notifyAction({error: 'postPageAction', e}))
      }
    } watch(payment, () => savePayment())

    function savePayment() {
      payload.value = {
        capture: !!token.value, token, // Update/Validate Payment
        // =======================Create Payment====================================== \\
        url: token.value?'api/categories/payment':'api/categories',
        method: token.value?'put':'post',
        order: !token.value,
        // currency_code: auth.value?.currency_code||ipData?.currency_code||'USD',
        href: props.postData?window.origin+'/post/'+props.postData.id:window.location.href,
        liveMode: ipDebug.value ? !ipDebug.value : auth.value.id !== 1,
        plans: [ // Payment plans
          {name: amount.value!==15||'Ultimate', payment: amount.value, amount: amount.value*month.value, total: $15.value*month.value},
          {name: amount.value!==10||'Gold', payment: amount.value, amount: amount.value*month.value, total: $10.value*month.value},
          {name: amount.value!==5||'Silver', payment: amount.value, amount: amount.value*month.value, total: $5.value*month.value},
          {name: !!amount.value||'Bump Up', payment: bump_up.value, amount: bump_up.value, total: $2.value},
          // {name: !bump_up.value||'Bump Up', payment: bump_up.value, amount: bump_up.value, total: $2.value},
          {name: !gallery_page.value||'Gallery Page', payment: gallery_page.value, amount: gallery_page.value, total: $20.value},
          {name: !worldwide.value||'Worldwide', payment: worldwide.value, amount: worldwide.value, total: $200.value}
        ], month, payment, post, post_id, auth
      } // Payment Data
    } // TagPaymentCreate: PaymentPostModule

    function paymentValidation() {
      savePayment(); preview.value = true; payload.value.currency_code = null
      crudAction(payload.value).then(() => paymentResponse())
        .catch(e => notifyAction({error: 'PaymentValidationAction', e}))
      $router.replace({'query': null})
    } // TagPayment: PaymentValidationPostModule

    function paymentResponse(apiLinks) {

      crudAction({reload: Math.floor(Math.random() * 9), mutate: 'reload'})

      if (apiLinks) {
        preview.value = true
      } else {
        count.value=amount.value=gallery_page.value=worldwide.value=bump_up.value=0
        $store.dispatch('users/authAction')
      } onLoad(Route)

    } // TagPayment: UpdatePaymentPostModule

    function update_post(postID) {
      api({
        url: 'api/categories/update_post',
        method: 'put',
        data: {
          post_id: postID,
          post_title: post_title.value,
          price: price.value,
          currency_code: currency_code.value,
          address: address.value,
          city: city.value,
          phone: phone.value,
          country: country.value,
          postal_code: postal_code.value,
          description: description.value,
          category_id: !subcategory.value||subcategory.value.category_id,
          subcategory_id: subcategory_id.value,
          // update_location: update_location.value,
          location: loc.value, // TagUpdateLocation: CategoryModule
          // location: postPlace.value || loc.value, // TagUpdateLocation: CategoryModule
          lat: position.value?.lat,//??ipData.latitude??ipData.lat,// ToFix
          lon: position.value?.lng//??ipData.longitude??ipData.lon
        }
      }).then(res => {
        location.value = res?.data?.post?.location
        notifyAction({message: res?.data?.success})
        context.emit('reload', props.postData) // TagEditPost

        crudAction({reload: Math.floor(Math.random() * 9), mutate: 'reload'})

      }).catch(e => {
        notifyAction({error: 'updatePostAction', e})
        location_data.value = e?.response?.data?.errors?.location?.[0] || e?.response?.data?.message
      })
    } // TagUpdatePost: PostModule

    return {
      ipDebug,
      xRate, cy,
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
      $5, $10, $15, $2, $20, $200,
      cardHeight: ref('height: 200px;'),
      count,
      // payment,
      // diff,
      print: ref(false),
      amount,
      gallery_page,
      worldwide,
      bump_up,
      month,
      payload,
      options: [1,2,3,4,6,7,8,9,10,11,12],
      // === TagPayment end === \\
      baseURL,
      post,
      post_title,
      post_title_data,
      price,
      price_data,
      currency_code,
      currency_code_data,
      address,
      address_data,
      city,
      city_data,
      region,
      region_data,
      postal_code,
      postal_code_data,
      country,
      country_data,
      phone,
      phone_data,
      description,
      description_data,
      location,
      // update_location,
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
      newPost,
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
      post_end_date,
      PayerID,
      state,
      update_category,

      slide: ref(0),
      fullscreen: ref(false),
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
            currency_code: currency_code.value,
            address: address.value,
            city: city.value,
            region: region.value,
            postal_code: postal_code.value,
            country: country.value,
            description: description.value,
            phone: phone.value,
            location: loc.value, // TagAddLocation: CategoryModule
            // location: postPlace.value || loc.value, // TagAddLocation: CategoryModule
            lat: ipData?.latitude??ipData?.lat,
            lon: ipData?.longitude??ipData?.lon
          }
        }).then(res => {
          loader.value = false; notifyAction({success: res.data.success})
          $router.push({ path: `/post/${res.data.post_id}?preview=1` }) // Go To Edit Post
        }).catch(e => {
          loader.value = false // price_data
          const message = e?.response?.data?.message
          post_title_data.value = e?.response?.data?.errors?.post_title?.[0] || message
          price_data.value = e?.response?.data?.errors?.price?.[0] //|| message
          currency_code_data.value = e?.response?.data?.errors?.currency_code?.[0]
          description_data.value = e?.response?.data?.errors?.description?.[0] || message
          city_data.value = e?.response?.data?.errors?.city?.[0] //|| message
          location_data.value = e?.response?.data?.errors?.location?.[0] //|| message
        })
      }, // TagAddPost: PostModule
      update_post, // TagUpdatePost: PostModule
      publishPost(postID) {
        crudAction({
          url: 'api/categories/renewPost',
          method: 'put',
          post_id: postID,
          success: $t('Post Published Successfully')
        }).then(() => onLoad(Route))
          .catch(e => notifyAction({error: 'PublishPost', e}))
      }, // TagPublishPost: PostModule
      flagPost(postID) {
        crudAction({
          url: 'api/categories/flagPost',
          method: 'put',
          flagState: 1,
          ip: ipData?.ip,
          post_id: postID,
          user_id: auth.value?.id,
          admin: role.value?.admins,
          success: role.value?.admins&state.value ? 'Post Take Off From Flag' : 'Post Flag Successfully'
        }).then(() => onLoad(Route))
          .catch(e => notifyAction({error: 'flagPostErr', e}))
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
        }).then(() => onLoad('file')).catch(e => notifyAction({error: 'DeletePicsAction', e}))

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
