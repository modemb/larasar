<template>
  <q-dialog v-model="print"><!--========== Receipt PopUp ============-->
    <q-card class="my-card text-black">
      <q-card-section class="bg-primary text-white">
        <q-btn dense round class="float-right" icon="close" v-close-popup />
        <!-- <div class="text-h6">{{$t('reports')}}</div> -->
      </q-card-section>
      <Reports :post_reports="post?.reports" />
    </q-card>
  </q-dialog><!--=========================== Receipt PopUp End ========-->

  <q-dialog v-model="viewMap"><!--== popMap =====================-->
    <q-card class="my-card text-white" style='width:800px'>
      <q-card-section class="bg-primary">
        <q-btn dense round class="float-right" icon="close" v-close-popup />
        <div class="text-h6">
          {{address}} {{city}} {{postal_code}}
        </div>
      </q-card-section>
      <div  v-html="map"/>
    </q-card><!-- TagGoogleMap: PostModule -->
  </q-dialog><!--=================== popMap End =================-->

  <q-dialog v-model="postPlace"><!-- Location PopUp =============-->
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <q-btn dense round class="float-right" icon="close" v-close-popup />
        <div class="text-h6">{{$t('post_location')}}</div>
      </q-card-section>
      <PostLocation /><!-- TagAddLocation -->
    </q-card>
  </q-dialog><!--=================== Location PopUp End =========-->

  <q-dialog v-model="filesLibrary"><!-- TagFiles =============-->
    <q-card class="my-card" style="width:100%; max-width: 1080px">
      <Files v-on:reload="onLoad" :post="post"/>
    </q-card><!-- TagFiles: FilesModule -->
  </q-dialog><!--====================== TagFiles End =========-->

  <q-layout view="lHh lpr lFf" container :style="'height:' + screenHeight + 'px'" class="shadow-2 rounded-borders">

    <q-header elevated>
      <q-card class="my-card" v-if="!subcategory_id&&!param_id&&view">
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
                  <q-item-label>{{locale?.subcategoryName}}</q-item-label>
                </q-item-section>
              </q-item><!-- TagRadioSubcategory: SubcategoryModule -->
            <!-- </div> -->
          </q-list>
        </q-card-section>
      </q-card><!--===================== TagPostCategory: PostModule -->

      <q-bar v-else-if="view"><!-- ifHere v-for="(postLocale, key) in postSubcategoryLocales" :key="key" -->

          <q-btn icon="fas fa-undo" flat densePus
            :label="mobile?'':postLocale"
            :to="{ name: 'public.subcategory.id', params: { id: postSubcategoryID || subcategory_id } }"
          /><!-- TagCategoryPosts: CategoryModule From PostsCategory.vue -->

          <q-btn flat dense :label="mobile?'':$t('Flag The Post')"
            :icon="`fas ${flag}`" v-if="!preview&&!post?.fav"
            @click.prevent="flagPost(param_id)"
          /><!-- TagFlagPostButton: PostModule -->
            <!-- :to="'/post/'+param_id+'/categories'" -->

          <q-btn size="12px" flat dense
            v-else-if="param_id"
            :loading="loader" icon="fas fa-edit"
            :label="mobile?'':$t('update_category')"
            @click="UpdateCategory"
          /><!-- TagUpdateCategory: PostModule auth?.role==='Admin'||ipDebug -->

          <q-btn v-if="token"
            :title="$t('Finalize Payment')"
            icon="fas fa-cart-arrow-down"
            @click.prevent="paymentValidation"
          /><!-- TagPayment: PaymentValidationPostModule -->

          <q-space />

          <Wish v-if="param_id"
            :post="post" :auth="auth&&!postData"
          /><!-- TagFavorite: FavoriteModule @favorite="wish"-->

          <template v-if="param_id&&newPost&&preview">

            <!--<q-btn size="12px" flat dense
              v-if="auth?.role==='Admin'||ipDebug"
              :loading="loader" icon="fas fa-edit"
              :label="mobile?'':$t('update_category')"
              :to="'/post/'+param_id+'/categories'"
            /> TagUpdateCategory: PostModule -->

            <q-btn size="12px" flat dense icon="fas fa-sign-in-alt"
              v-if="ipDebug?(auth?.id!==user?.id):''"
              @click.prevent="logUserAction(user?.id)"
            /><!-- TagLogUser: UserModule -->

            <q-btn flat dense icon="fas fa-street-view"
              :class="(location_data?'bg-red':'')+'float-right'"
              :label="mobile?'':$t(location)"
              @click.prevent="postPlace = true"
            /><!-- TagAddLocation - TagUpdateLocation: CategoryModule -->

            <q-btn dense flat icon="fas fa-eye"
              title="Views" class="float-right"
              @click.prevent="previewPost"
              ><q-badge color="orange" text-color="black" :label="count" floating v-if="count" /><!-- TagView: ViewModule -->
            </q-btn><!-- TagPreviewPost -->

          </template>

          <template v-else-if="param_id">

            <q-toggle v-model="hideLabels" /><!-- label="Hide labels" -->

            <q-btn v-if="newPost"
              dense flat icon="edit"
              :label="$t('edit')"
              class="float-right"
              @click.prevent="previewClose"
            />

          </template><!--======= TagPreviewClose =============-->

          <q-btn dense flat icon="close" v-close-popup v-if="postData" />

      </q-bar><!--===================== TagPost: PostModule ========-->
    </q-header>

    <q-btn flat class="fixed-center" :loading="true" v-if="!subcategory_id&&!param_id"/>
    <!-- <q-btn flat class="fixed-center" :label="plan" :icon="!plan?'fas fa-thumbs-up':'fas fa-thumbs-down'" v-if="!subcategory_id&!param_id"/> -->

    <q-page-container v-else-if="view"><!-- ifHere -->
      <q-page class="flex flex-center q-pa-md" @keyup.enter="param_id?update_post(param_id):add_post"><!-- add_post(subcategory_id -->

        <q-form class="q-gutter-md" :style="'width:' + screenWidth + 'px'">
          <div class="*col-md-12 *q-pa-md" v-if="preview&&newPost">

            <div class="q-col-gutter-md row items-start" v-if="!boost"><!-- -->
              <div class="col-4 col-md-2" v-for="(data, key) in pics" :key="key">
                <q-img :src="data.pic?(baseURL+'/'+data.pic):data" :ratio="1">
                  <div class="absolute-bottom-right text-subtitle2">
                    <q-btn
                      text-color="white"
                      class="float-right"
                      dense round
                      icon="close"
                      @click.prevent="deleteImage(data)"
                    /><!--======= TagDeleteImage: PicModule =============-->
                  </div>
                </q-img><!-- Post Pics -->
              </div><!-- FilesModule -->
              <div :class="mobileApp?'col-2':'col-xs-12 col-md-3'">
                <q-btn color="primary" icon="fas fa-camera"
                  @click="takePhoto" v-if="mobileApp"
                /><!-- TagTakePhoto: FilesModule - PostModule -->
                <q-uploader v-else
                  :factory="readFiles" batch
                  _:filter="checkFileType"
                  _rejected="onRejected"
                  :label="$t('Batch upload')"
                  multiple hide-upload-btn
                  auto-upload max-files="10"
                /><!-- TagUpload: FilesModule v-if="upload" -->
              </div><!-- https://quasar.dev/vue-components/uploader#introduction -->
            </div><br/><!--====== TagImage: PicModule =============-->

            <div v-if="boost">{{  param_id + ' && ' + (payment_expiry +' || '+ amount +' || '+ !PayerID) }}

              <div v-if="param_id && (payment_expiry || amount || !PayerID)"><!-- toFix - watchWorking -->
                <div class="cards row" v-if="desktop">
                  <div class="col-xs-12 col-md-3 q-pa-md">
                    <q-list bordered padding class="rounded-borders cardBorderTop-1">
                      <div :style="'max-height: 416px;' + cardHeight">
                        <q-item-label header class="text-center text-h5">
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
                      <div class="text-center q-pa-md" bottom>
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
                  <div class="col-xs-12 col-md-3 q-pa-md">
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
                  <div class="col-xs-12 col-md-3 q-pa-md">
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
                  <div class="col-xs-12 col-md-3 q-pa-md">
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
                </div><!-- desktop -->
                <dev class="row" v-else>
                  <div class="col-xs-3 *text-center *q-pa-md" bottom>
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
                  </div><!-- card-1 -->
                  <div class="col-xs-3 *text-center *q-pa-md">
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
                  </div><!-- card-2 -->
                  <div class="col-xs-3 *text-center *q-pa-md">
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
                  </div><!-- card-3 -->
                  <div class="col-xs-3 *text-center *q-pa-md">
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
                  </div><!-- card-4 -->
                </dev><!-- mobile -->
              </div><!-- TagPayment: CardPaymentPostModule -->

              <q-btn flat class="row" @click="print=true" v-else-if="start_date">
                <div class="col-md-12 q-pa-md">
                  {{$t('plan')}}: {{plan}} | {{start_date}} <q-icon name='fas fa-long-arrow-alt-right'/> {{end_date}}
                </div>
              </q-btn><!-- TagActivePlan end_date -->

              <div class="row" v-if="param_id">

                <div class="col-xs-12 col-md-3">
                  <q-btn flat round icon="fas fa-question">
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
                      {{$t('gain_tooltip')}}
                    </q-tooltip>
                  </q-btn>{{$t('Earned Money')}}: {{cy(xRate(user?.gain))}}
                </div><!-- TagGain -->
                <div class="col-xs-12 col-md-3 q-gutter-sm" v-if="!post.gallery_page">
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
                <div class="col-xs-12 col-md-3 q-gutter-sm" v-if="!post.worldwide">
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
                <div class="col-xs-12 col-md-3 q-gutter-sm" v-if="!amount">
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
                <div v-if="amount" class="col-xs-12 col-md-3 q-gutter-sm">
                  <q-select v-model="month" :options="options" :label="$t('Month')" _style="min-width: 300px">
                    <template v-slot:prepend>
                      <q-icon name="fas fa-sync" />
                    </template>
                  </q-select>
                </div><!-- TagMonth -->

              </div><!-- TagPayment: OptionPaymentPostModule -->

              <div class="col-md-12 q-pa-md" v-if="(amount||bump_up||gallery_page||worldwide)"><!-- toFix - watchWorking -->
                <Checkout v-on:paypal="paymentResponse" :payload="payload" /><!-- TagPaymentCheckout:  -->
              </div><!--TODO <div class="text-h6 bg-red" v-else>{{$t('Currency Not Available Yet')}}</div> -->

              <q-btn dense round icon="close"
                color="primary" class="float-right"
                @click="boost=!boost"
              />

            </div><!-- TagBoost -->
            <div class="row" v-else>
              <div class="col-xs-12 col-md-8">
                <q-input
                  filled
                  type="text"
                  v-model="post_title"
                  :label="$t('post_title')+'*'" clearable
                  :error="post_title_data ? true : false"
                  :error-message='post_title_data'
                /><!-- lazy-rules -->
              </div><!-- post_title -->
              <div class="col-xs-6 col-md-2">
                <q-input
                  filled
                  type="number"
                  v-model="price" maxlength="10"
                  :label="$t('Price')" clearable
                  :rules="[(val: string | any[]) => val && val.length <= 12||'']"
                  :error="price_data ? true : false"
                  :error-message='price_data'
                /><!-- lazy-rules counter -->
              </div><!-- price -->
              <div class="col-xs-6 col-md-2">
                <!-- <q-input
                  filled
                  type="text"
                  maxlength="3"
                  v-model="currency_code"
                  :label="$t('currency_code')" clearable
                  :error="currency_code_data ? true : false"
                  :error-message='currency_code_data'
                />lazy-rules -->

                <q-select
                  filled
                  v-model="currency_code"
                  clearable
                  fill-input
                  use-input
                  hide-selected
                  transition-show="*flip-up"
                  transition-hide="*flip-down"
                  _behavior="*dialog"
                  input-debounce="0"
                  @filter="filterFn"
                  @filter-abort="abortFilterFn"
                  :options="currencies"
                  :label="Currencies[currency_code]?.name"
                  :hint="$t('currency_code')"
                  style="width: 100%; padding-bottom: 32px"
                ><!-- :disable="!(profile||ipDebug)"
                  :hint="$t(advance?'Advanced Filter':'Filter')"
                 -->
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        {{ $t('No results') }}
                      </q-item-section>
                    </q-item>
                  </template>
                  <!--<q-btn :color="advance?'negative':'grey'"
                    @click="advance=!advance"
                    icon="fas fa-search"
                  /> TagAdvanceSearch: CurrencyModule -->
                </q-select><!-- use-input hide-selected -->

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
                  :rules="[(val: string | any[]) => val && val.length > 0 || $t('add_city')]"
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
                  :rules="[(val: string | any[]) => val && val.length > 0 || $t('country_city')]"
                  :error="country_data ? true : false"
                  :error-message='country_data'
                />
              </div><!-- country -->
              <div class="col-xs-12 col-md-4">
                <q-input
                  v-model="phone"
                  filled type="tel"
                  :label="$t('phone')+' - '+(user?.email||'')"
                  :hint="$t('Including area code')" lazy-rules clearable
                  :rules="[(val: string | any[]) => val && val.length > 0 || $t('add_phone')]"
                 >
                </q-input>
              </div><!-- phone -->

              <q-editor v-model="description"  class="col-xs-12" min-height="5rem" />
              <p class="text-negative">{{description_data}}</p>
            </div><!-- Coordinate !param_id||post_end_date -->

            <div class="q-ma-md"  v-if="!auth"><!--===== Guest ====================-->
              <q-btn icon="add_to_queue" :label="$t('register')" to='/register'/>
              <q-btn icon="warning" :label="$t('Login Before Posting')" to='/login'/>
            </div><!--================================== Guest End ================-->

            <div class="row" v-if="!boost">
              <div class="col-xs-6 col-md-3">
                <div v-if="param_id">

                  <q-btn color="primary" class="q-ma-md" v-if="post_end_date"
                    :loading="loader" icon="fas fa-edit"
                    :label="$t('update_post')"
                    @click.prevent="update_post(param_id)"
                  /><!-- UpdatePostModule -->
                  <q-btn icon="fas fa-upload"
                    color="negative" class="q-ma-md"
                    :label="$t('Publish Post')"
                    :loading="loader" v-else
                    @click.prevent="publishPost(param_id)"
                  /><!-- TagPublishPost: PostModule -->
                </div><!--======= TagUpdatePost =============-->
                <div v-else>

                  <q-btn class="q-ma-md"
                    :loading="loader" icon="fas fa-plus-circle"
                    :color="location_data?'red':'primary'"
                    :label="location_data || $t('add_post')"
                    @click.prevent="add_post()"
                  /><!-- AddPostModule -->

                </div><!--======= TagAddPost ================-->
              </div><!--========= CrUp =======================-->
              <div class="col-xs-6 col-md-3" v-if="param_id">

                <q-btn color="green" class="q-ma-md"
                  icon="fa-solid fa-rocket"
                  :label="$t('Boost Post')"
                  @click="boost=!boost"
                /><!-- boost -->

              </div><!-- TagBoost -->
              <div class="col-xs-6 col-md-3">

                <q-btn color="orange" class="q-ma-md"
                  :loading="loader" v-if="param_id"
                  :label="$t('My Library')"
                  icon="fas fa-photo-video"
                  @click.prevent="filesLibrary = true"
                /><!-- TagFiles: FilesModule -->

              </div><!-- TagPostPic: PostModule -->
              <div class="col-xs-6 col-md-3" v-if="param_id">

                <q-btn color="primary" class="q-ma-md" v-if="token"
                  icon="fas fa-cart-arrow-down"
                  :label="$t('Finalize Payment')"
                  @click.prevent="paymentValidation"
                /><!-- TagPayment: PaymentValidationPostModule -->
                <q-btn class="q-ma-md" icon="fas fa-street-view" v-else
                  :color="location_data?'red':'primary'"
                  :label="location_data || $t(location)"
                  @click.prevent="postPlace = true"
                /><!-- TagAddLocation - TagUpdateLocation: CategoryModule -->

              </div><!-- Payment - Location -->
            </div><!--=========== CRUD =======================-->

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
                infinite height="600px"
                @mouseenter="autoplay = false"
                @mouseleave="autoplay = true"
                :autoplay="autoplay"
                v-model:fullscreen="fullscreen"
              > <!-- https://quasar.dev/vue-components/carousel#QCarousel-API height="4000px" -->

              <!-- :style="'width:' + screenWidth + 'px; height:' + screenHeight + 'px'" -->

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

              <!-- <q-separator /> -->

              <q-page-sticky position="bottom-right" :offset="fabPos">
                <q-fab
                  icon="keyboard_arrow_left"
                  :label="$t('drag')"
                  direction="left"
                  color="primary"
                  :disable="draggingFab"
                  v-touch-pan.prevent.mouse="moveFab"
                  :hide-label="hideLabels"
                ><!-- TagFab -->
                  <div class="bg-primary *row">
                    <q-fab-action class="*col-6 *row">
                      <q-btn type="a" class="*col-lg-3 *q-mb-md"
                        icon="fas fa-envelope" target="_blank" v-if="user?.email" flat
                        :href="'mailto:' + user?.email + '?subject=' + post_title + '&body=From ' + copyLink"
                      /><!-- :label="user.email" -->
                      <q-btn type="a" class="*col-lg-2 *q-mb-md"
                        icon="fas fa-phone" v-if="phone"
                        :href="'tel:' + phone" flat
                      /><!-- :label="phone" -->
                      <q-btn flat round target="_blank" type="a"
                        icon="fa-brands fa-whatsapp fa-md" v-if="phone"
                        :href="'https://wa.me/' + phone"
                      /><!-- fa-brands fa-square-whatsapp -->
                      <q-btn flat round v-if="myRoom"
                        icon="fas fa-comments fa-2x"
                        @click.prevent="chatRoom"
                      /><!-- TagChatRoom: chatModule -->
                    </q-fab-action>

                    <q-fab-action class="*col-6 *q-mb-md float-right">
                      <q-btn type="a" class="*col-lg-5 *q-mb-md" v-if="city"
                        icon="fas fa-map-marker-alt" behavior="mobile"
                        @click.prevent="googleMap" flat round
                      /><!-- TagGoogleMap: PostModule -->
                      <Share :shareData="shareData"/>
                    </q-fab-action><!-- TagSharePost: PostModule - Navigator Share -->
                  </div>
                </q-fab>
              </q-page-sticky>

              <q-separator />

              <div class="text-h6" behavior="mobile" v-html="description"/>
            </q-card>

          </div><!--======== TagPreviewPost ============-->
        </q-form><!-- :style="'width:' + width + 'px'" -->

      </q-page>
    </q-page-container>

  </q-layout>

</template>

<script lang="ts">
import { ref, computed, watch, reactive, onMounted, onUpdated } from 'vue'
import { useQuasar, QUploaderFactoryFn } from 'quasar'
import { useRouter, useRoute, RouteLocationNormalizedLoaded } from 'vue-router'
import { i18n, api, cy, xRate, baseURL, ipData, mobileApp, authAction,
  categoriesAction, logUserAction, currenciesAction,
  filesMutation
} from 'boot/axios'
import { useCrudStore } from 'stores/crud'
import { dateDiffInDays, takePicture } from './Functions'
import { Param, AuthPost } from 'components/models'
import Currencies from './json/Currencies.json'
import PostLocation from './PostLocation.vue'
import Checkout from './UserCheckout.vue'
import Reports from './UserReports.vue'
import Wish from './UserWish.vue'
import Files from './UserFiles.vue'
import Share from './UserShare.vue'
import Auth from './Auth.vue'

/**
 * Tags: TagAddPost - TagFlagPost - TagPayment - TagTakePhoto - TagPostPic - TagFab - TagBoost - TagFiles
 *       TagPreviewPost - TagCheckout - TagSharePost - TagPublishPost - TagActivePlan - TagUpdateCategory
 *       TagRadioCategory - TagRadioSubcategory - TagImplementTestPayment - TagPostCarousel - TagAddLocation
 *       LinkPaymentPostModule - CategoryModule - PaymentPostModule - ipDebugPaymentPostModule - TagPosition
 *       FavoriteModule - ViewModule - chatModule - SubcategoryModule - FilesModule - PostModule
 *
 * @to CategoryController
 */
export default {
  components: {
    PostLocation,
    Checkout,
    Reports,
    Files, // TagFiles: FilesModule
    Share,
    // eslint-disable-next-line vue/no-unused-components
    Auth,
    Wish
  }, props: ['postData', 'getPosts'],
  setup (props) {
    const $t = i18n.global.t
    const $q = useQuasar()
    const store = useCrudStore()
    const { crudAction, notifyAction } = store
    const $route = useRoute()
    const $router = useRouter()
    const state = ref(false)
    const param_id = ref(0)
      const post = ref<any>({})
    const plan = ref(null)
    const payment_expiry = ref(false)
    // const postSubcategoryLocales = ref([])
    const postLocale = ref('')
    const postSubcategoryID = ref(0)
    const newPost = ref(false)
    const end_date = ref<Date | null>(null)
    const post_end_date = ref<Date | null>(null)
    const subcategory = ref<any>({})
    const contacts = ref(null) // TagSharePost
    const view = ref(false)
    const apiLinks = ref(false)
    const links = ref(false) // LinkPaymentPostModule
    const fabPos = ref([ 18, 50 ]) // TagFab
    const draggingFab = ref(false)
    // === TagPayment ====== \\
    const boost = ref(false)
    const count = ref(0)
    const token = ref<unknown>('')
    const PayerID = ref<string>('')
    const amount = ref(0)
    const gallery_page = ref(0)
    const worldwide = ref(0)
    const bump_up = ref(0)
    const month = ref(1)
    const payload = ref<any>({})
    const $5 = ref(0)
    const $10 = ref(0)
    const $15 = ref(0)
    const $2 = ref(0)
    const $20 = ref(0)
    const $200 = ref(0)
    // === TagPayment end === \\
    const post_title = ref<string | null>('')
    const post_title_data = ref('')
    const price = ref(0)
    const price_data = ref('')
    const currencies = ref<any>([])
    const currency_code = ref<'USD'>(store.authGetter?.currency_code)
    const currency_code_data = ref('')
    const address = ref('')
    const address_data = ref('')
    const city = ref('')
    const city_data = ref('')
    const region = ref('')
    const region_data = ref('')
    const postal_code = ref('')
    const postal_code_data = ref('')
    const country = ref('')
    const country_data = ref('')
    const phone = ref('')
    const phone_data = ref('')
    const description = ref('')
    const description_data = ref('')
    const location = ref('')
    // const update_location = ref(false)
    const location_data = ref('')
    // ======================== \\
    const postPlace = ref(false)
    const sharePost = ref(false)
    const filesLibrary = ref(false)
    const categories = ref<any>([])
    const subcategories = ref(null)
    const preview = ref(false)
    const subcategory_id = ref(0)
    const category_id = ref(0)
    const loader = ref(false)
    const images = ref<any>([]) // QUploaderFactoryFn
    const user = ref()
    const viewMap = ref(false)
    const map = ref('')
    const start_date = ref(null)
    const flag = ref('fa-flag')
    const shareData = ref({})
    const myRoom = ref(false)
    const update_category = ref(false)

    const Route = props.postData ? { params: { id: props.postData.id }, name: 'public.post.id' } : $route

    const payment = computed(() => amount.value*month.value + gallery_page.value + worldwide.value +
                                 (!amount.value?bump_up.value:0))
    const position = computed(() => store.positionGetter?.position)
    const getCurrencies = computed(() => store.currenciesGetter)
    const ipDebug = computed(() => store.configGetter?.ipDebug)
    const loc = computed(() => store.locationGetter?.location)
    const locale = computed(() => store.configGetter?.locale)
    const files = computed(() => store.filesGetter?.array)
    const post_id = computed(() => Route.params?.id)
    const auth = computed(() => store.authGetter)

    const copyLink = window.origin+'/post/'+post_id.value // TagCopyPostLink

    const readFiles = (files: Blob[]) => filesMutation(files) // TagReadFiles: FileModule
    const postAction = (params: Partial<Param>) => crudAction({
      url: 'api/categories/postAction', method: 'get', ...params
    }) // TagPostAction: PostModule
    const postLocales = (postLocales: any[]) => postLocales?.forEach(locale => {
          postLocale.value = locale?.subcategoryName
            ? (locale?.categoryName +' --> '+ locale?.subcategoryName) :
               locale?.categoryName
          }) // TagPostLocales: PostModule

    // watch(position, val => !val||update_post(post_id.value))
    watch([position, files], val => {
      if (val[1]) val[1].forEach((i: object) => images.value.push(i))
      update_post(post_id.value) // ^^^ Load Image Before Uploading
    }) // TagPosition / TagFiles: FilesModule
    watch(locale, () => categoriesAction({}).then(() => onLoad(Route)))

    onMounted(() => props.postData ? getPost(props.postData) : onLoad(Route))
    onUpdated(() => onLoad(Route))

    // onMounted(() => {
    //   if (props.postData) getPost(props.postData)
    //   else onLoad(Route)
    // });

    async function getPost(authPost: AuthPost) {

      const flagPost = authPost?.flag; view.value = true;
      const payment_end_date = `${authPost?.payments?.filter((p) => p?.PayerID)?.[0]?.end_date}`

      post.value = authPost; param_id.value = authPost?.id
      // state.value = flagPost?.state // TagFlagPost: PostModule
      state.value = flagPost // TagFlagPost: PostModule
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

      payment_expiry.value = dateDiffInDays(Date(), payment_end_date) < 1

      console.log(
        'PayerID', PayerID.value,
        'payment_expiry', payment_expiry.value,
        'Date()', Date(),
        'payment_end_date', payment_end_date
      )

      if (authPost?.subcategory) postLocales(authPost?.subcategory?.locales)
      else postLocale.value = authPost?.subcategoryName
       ? (authPost?.categoryName +' --> '+ authPost?.subcategoryName) :
          authPost?.categoryName

      postSubcategoryID.value = authPost?.subcategory_id

      post_title.value = authPost?.post_title
      price.value = (authPost?.price>0)?authPost?.price:0
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
        price: authPost?.price,
        banner: 'share_post',
        id: authPost?.id,
        title: authPost?.post_title,
        text: authPost?.post_title,
        currency_code: authPost?.currency_code,
        url: copyLink
      }; myRoom.value = authPost?.user_id !== auth.value?.id
      if (!authPost) notifyAction({message: 'Post Not Available'})
      // if (props.getPosts==='flag') crudAction({flag, mutate: 'flagGetter'})
      if (ipDebug.value) newPost.value = ipDebug.value // Can Edit All Posts
      if ($route.query?.token) paymentValidation()
      if (props.postData) crudAction({
        url: auth.value?.id?'api/users/view':'api/users',
        method: auth.value?.id?'put':'post',
        id: auth.value?.id||0,
        post_id: props.postData?.id,
        ip: ipData?.ip,
        mutate: 'viewGetter'+props.postData?.id,
        slug: `/post/${props.postData?.id}` // Post View
      }).catch((e: unknown) => notifyAction({error: 'popupView', e}))
      if ($route.path.includes('categories')) {
        $router.replace({path: `/post/${authPost?.id}`})
        update_post(authPost?.id) // Update Post Category
      } // TagUpdateCategory: PostModule

      //mSession(['reloadApp']) //mSession(reloadPosts) // Reload Posts
      // crudAction({reload: Date.now(), mutate: 'reloadGetter'})

    } // watch(state, val => crudAction({flag: val}))

    async function onLoad(route: any | RouteLocationNormalizedLoaded | { params: { id: number }; name: string }) {
      const radioCategory = route?.meta?.radioCategory
      if (route.name === 'public.post.id') { // TagCategoryPosts: Sub/CategoryModule From Categories.vue

        postAction({
          auth_id: auth.value?.id,
          post_id: route.params?.id,
          mutate: 'postGetter'+route.params?.id
        }).then((authPost: AuthPost) => getPost(authPost)) // Auth Post
          .catch((e: unknown) => notifyAction({error: 'postAction', e}))

      } else if (radioCategory) { // TagRadioCategory: CategoryModule

        const res = computed(() => store.categoriesGetter?.data||[])

        post.value = plan.value = start_date.value = end_date.value = null//currency_code.value =
        address.value = city.value = region.value = post_title.value = postal_code.value =
        country.value = phone.value = description.value = ''; price.value = 0
        subcategory_id.value = param_id.value = 0; view.value = true; location.value = loc.value;
        currency_code.value = auth.value?.currency_code
        categories.value = res.value // Categories Sorted
          ?.sort((a: { locales: { categoryName: string } }, b: { locales: { categoryName: string } }) =>
            a?.locales?.categoryName?.localeCompare(b?.locales?.categoryName))

      } else { // TagRadioSubcategory: SubcategoryModule

        const getSubcategory: any = route
        subcategory_id.value = getSubcategory?.id
        category_id.value = getSubcategory?.category_id

        // postSubcategoryLocales.value = getSubcategory.locales
        postLocales(getSubcategory.locales)

        subcategory.value = getSubcategory
        newPost.value = preview.value = true // TagFlagPostButton
        if (props.postData) newPost.value = !props.postData

        const post_id = route==='postFilePopUp'?param_id.value:Route.params.id

        if (post_id) postAction({
            auth_id: auth.value?.id, post_id,
            mutate: 'postGetter'+post_id
          }).then((authPost: AuthPost) => { // TagUpdateCategory: PostModule
            param_id.value = Number($route.params.id)
            if (authPost) getPost(authPost)
          }).catch((e: unknown) => notifyAction({error: 'postCategoriesAction', e}))
        else crudAction({ postPage: $route.query.go==='categories',
            mutate: 'postPageGetter', refresh: ['postPageGetter']
          }) // Post Page Before Adding

      } // crudAction({reload: Date.now(), mutate: 'reloadGetter', refresh: ['reloadApp'] })
    } watch(payment, () => savePayment())

    function savePayment() {
      payload.value = {
        url: token.value?'api/categories/payment':'api/categories',
        method: token.value?'put':'post',
        data: { capture: !!token.value, token, // Update/Validate Payment
          // =======================Create Payment====================================== \\
          order: !token.value,
          // currency_code: auth.value?.currency_code||ipData?.currency_code||'USD',
          href: props.postData?window.origin+'/post/'+props.postData.id:window.location.href,
          liveMode: ipDebug.value ? !ipDebug.value : auth.value.id !== 1,
          plans: [ // Payment plans
            {name: amount.value!==15||'Ultimate', payment: amount.value, amount: amount.value*month.value, total: $15.value*month.value},
            {name: amount.value!==10||'Gold', payment: amount.value, amount: amount.value*month.value, total: $10.value*month.value},
            {name: amount.value!==5||'Silver', payment: amount.value, amount: amount.value*month.value, total: $5.value*month.value},
            {name: (!!amount.value||!bump_up.value)||'Bump Up', payment: bump_up.value, amount: bump_up.value, total: $2.value},
            // {name: !bump_up.value||'Bump Up', payment: bump_up.value, amount: bump_up.value, total: $2.value},
            {name: !gallery_page.value||'Gallery Page', payment: gallery_page.value, amount: gallery_page.value, total: $20.value},
            {name: !worldwide.value||'Worldwide', payment: worldwide.value, amount: worldwide.value, total: $200.value}
          ], month, payment, post, post_id, auth }
      } // Payment Data
    } // TagPaymentCreate: PaymentPostModule

    function paymentValidation() {
      const nullQuery: any = null
      // const nullQuery: RouteQuery = null
      savePayment(); preview.value = true; payload.value.data.currency_code = null
      api(payload.value).then(({ data: { success }}) => {
        paymentResponse(''); notifyAction({ success }) // crudAction(payload.value).then(() => paymentResponse())
      }).catch(e => notifyAction({error: 'PaymentValidationAction', e}))
        .finally(() => $router.replace({ query: nullQuery }))
    } // TagPayment: PaymentValidationPostModule

    function paymentResponse(apiLinks: string) {

      crudAction({reload: Date.now(), mutate: 'reloadGetter', refresh: ['reloadApp'] })
      if (apiLinks) preview.value = true; else {
        count.value=amount.value=gallery_page.value=worldwide.value=bump_up.value=0
        authAction()
      } onLoad(Route)

    } // TagPayment: UpdatePaymentPostModule

    const params = <any> reactive({
      pics: images,
      user_id: auth.value?.id,
      category_id, subcategory_id,
      post_title, currency_code, price, description,
      address, city, region, country, postal_code, phone,
      location: loc, // TagUpdateLocation: CategoryModule
      lat: position.value?.lat??ipData?.latitude??ipData?.lat,
      lon: position.value?.lng??ipData?.longitude??ipData?.lon
    }) // Add and Update Payload

    function add_post() { //subcategoryID
      params.addPost = loader.value = true; crudAction({
        url: 'api/categories',
        method: 'post', refresh: ['reloadApp'], ...params
      }).then((data: { post_id: number }) => {
        loader.value = false; catchErr(''); images.value = [];
        $router.push({ path: `/post/${data.post_id}?preview=1` }) // Go To Edit Post
      }).catch((e: unknown) => catchErr(e))
    } // TagAddPost: PostModule

    function update_post(postID: number) {
      loader.value = true
      if (params.post_id = postID) crudAction({
        url: 'api/categories/update_post', ...params,
        method: 'put', refresh: ['reloadApp']
      }).then((res: { post: { location: string } }) => {
        crudAction({ reload: Date.now(), mutate: 'reloadGetter', refresh: ['reloadApp'] })
        location.value = res?.post?.location
        catchErr(''); onLoad(Route); images.value = []
      }).catch((e: unknown) => catchErr(e)); else loader.value = false
    } // TagUpdatePost: PostModule

    function _readFiles(files: Blob[]): QUploaderFactoryFn {

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader()
        // readAsDataURL - readAsText - readAsBinaryString - readAsArrayBuffer
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) images.value.push(e.target.result)
          if ((i+1 === files.length)&&post_id.value) update_post(post_id.value)
        }; reader.readAsDataURL(files[i])
      } return images.value
    } // TagUpload: FileModule

    function catchErr(e: any) { // price_data
      const message = e?.response?.data?.message; loader.value = false
      post_title_data.value = e?.response?.data?.errors?.post_title?.[0] || message
      price_data.value = e?.response?.data?.errors?.price?.[0] //|| message
      currency_code_data.value = e?.response?.data?.errors?.currency_code?.[0]
      description_data.value = e?.response?.data?.errors?.description?.[0] || message
      city_data.value = e?.response?.data?.errors?.city?.[0] //|| message
      location_data.value = e?.response?.data?.errors?.location?.[0] || message
    } // With Optional Chaining

    return {
      Currencies,
      mobileApp,
      logUserAction,
      ipDebug,
      auth,
      myRoom,
      screenHeight: ref(screen.height/($q.platform.is.mobile?1.2:1.35)),
      screenWidth: ref(screen.width),
      desktop: ref($q.platform.is.desktop),
      mobile: ref($q.platform.is.mobile),
      contacts, // TagSharePost
      copyLink,
      shareData,

      fabPos,
      draggingFab,
      hideLabels: ref(true),

      // darkMode: computed(() => $q.localStorage.getItem('darkMode')),
      darkMode: computed(() => store.darkModeGetter?.darkMode),
      pics: computed(() => {
        try { return [...images.value, ...post.value.pics]
        } catch (error) { return images.value }
      }), // FilesModule

      async takePhoto()  {
        images.value?.push(await takePicture()) // mobileApp
        if (post_id.value) update_post(post_id.value)
      }, readFiles, // TagTakePhoto: FilesModule - PostModule

      onClick () {
        // console.log('Clicked on a fab action')
      },

      moveFab (ev: any) {
        draggingFab.value = ev.isFirst !== true && ev.isFinal !== true

        fabPos.value = [
          fabPos.value[ 0 ] - ev.delta.x,
          fabPos.value[ 1 ] - ev.delta.y
        ]
      }, // TagFab

      view,
      flag,
      apiLinks,
      links, // LinkPaymentPostModule
      // === TagPayment ====== \\
      $5, $10, $15, $2, $20, $200,
      xRate, cy,
      cardHeight: ref('height: 200px;'),
      boost,
      count,
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
      // postSubcategoryLocales,
      postLocale,
      autoplay: ref(true),
      newPost,
      loader,
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

      onLoad,
      dateDiffInDays,
      paymentValidation,
      paymentResponse,

      // wish: () => onLoad(Route), // TagFavorite: FavoriteModule
      previewPost: () => preview.value = false, // TagPreviewPost: PostModule
      previewClose: () => preview.value = true, // TagPreviewClose: PostModule

      currencies,
      abortFilterFn: () => notifyAction({message: 'delayed filter aborted'}),
      filterFn (val: string, update: (arg0: () => Promise<void>) => void) { // ===== TagChooseCurrency ================= \\
        update(async () => {

          if (!getCurrencies.value?.length) currenciesAction()

          const needle = val.toLowerCase()
          const array = getCurrencies.value?.filter((c: { to_name: string; to: string }) => (c.to_name||c.to)?.toLowerCase().includes(needle))

          currencies.value = Object.keys(Currencies).filter(v => v.toLowerCase().indexOf(needle) > -1)
          array?.forEach((c: { to: never }) => currencies.value.includes(c.to)||currencies.value.push(c.to))

        }) // https://quasar.dev/vue-components/select#example--selecting-option-after-filtering
      }, // TagSelectCurrency: CurrencyModule

      subcategoriesSorted(subcategories: any[] | null) {
        let NewSubcategories: any[] = []; if (subcategories) subcategories.forEach((subcategory: { id: any; category_id: any; locales: any[] }) => {
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
      }, // TagGoogleMap: PostModule
      chatRoom() {
        api({
          url: 'api/categories',
          method: 'post', data: {
            post_id: post_id.value,
            user_id: auth.value?.id,
            create_room: true }
        }).then(({ data }) => $router.push({ path: `/chat/${data}` }))
          .catch(e => notifyAction({error: 'chatRoom', e})) // ^RoomId
      }, // TagChatRoom: chatModule
      add_post, // TagAddPost: PostModule
      update_post, // TagUpdatePost: PostModule
      UpdateCategory() {
        if (confirm($t('update_category')+': '+postLocale.value))
        $router.push({ path: '/post/'+param_id.value+'/categories' })
      }, // TagUpdateCategory: PostModule
      publishPost(postID: number) {
        api({
          url: 'api/categories/renewPost',
          method: 'put', data: {
            post_id: postID,
            renewPost: 1 }
        }).then(() => {
          crudAction({reload: Date.now(), mutate: 'reloadGetter', refresh: ['reloadApp'] })
          notifyAction({ success: 'Post Published Successfully' })
          catchErr(''); onLoad(Route)
        }).catch(e => notifyAction({error: 'PublishPost', e}))
      }, // TagPublishPost: PostModule
      flagPost(postID: number) {
        if (confirm($t('Flag The Post'))) api({
          url: 'api/categories/flagPost',
          method: 'put', data: {
            flagState: 1,
            ip: ipData?.ip,
            post_id: postID,
            user_id: auth.value?.id,
            admin: auth.value?.role==='Admin'
          }
        }).then(() => {
          const success = (auth.value?.role==='Admin')&&state.value ? 'Post Take Off From Flag' : 'Post Flag Successfully'
          notifyAction({ success }); onLoad(Route)
          crudAction({reload: Date.now(), mutate: 'reloadGetter', refresh: ['reloadApp'] })
        }).catch(e => notifyAction({error: 'flagPostErr', e}))
      }, // TagFlagPostButton: PostModule
      deleteImage(pic: { id: number }) {
        if (pic.id) api({
          url: `api/users/${pic.id}`, // auth: auth||null, // pic: pic
          method: 'delete', data: { deletePic: true }// forever: pic.forever,
        }).then(() => {
          crudAction({reload: Date.now(), mutate: 'reloadGetter', refresh: ['reloadApp'] })
          notifyAction({ success: $t('Picture Deleted Successfully') }); onLoad('file')
        }).catch(e => notifyAction({error: 'DeletePicsAction', e}))
        else [pic].forEach((picToRemove: any) => {
          const index = images.value?.indexOf(picToRemove)
          if (index !== -1) images.value?.splice(index, 1)
        }) // Remove Pic

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
(: any)(: AuthPost)(: any)(: any)(: any)(: any)(: any)(: any)(: any)(: any)(: any)(: AuthPost)(: any)(: any)(: any)(: any)(: any)(: any)
