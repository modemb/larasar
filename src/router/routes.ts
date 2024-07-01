import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // Public Routes
      {
        path: '',
        name: 'index',
        component: () => import('pages/IndexPage.vue'),
        meta: { public: true }
      },
      {
        path: '/page/:slug',
        name: 'public.pages',
        component: () => import('pages/PageContent.vue'),
        meta: { public: true }
      },
      // Guest Routes
      {
        path: 'login',
        name: 'guest.login',
        component: () => import('components/Auth.vue'),
        meta: { guest: true }
      },
      {
        path: 'register',
        name: 'guest.register',
        component: () => import('components/Auth.vue'),
        meta: { guest: true }
      },
      {
        path: 'api/login/:driver/callback',
        name: 'social.login',
        component: () => import('components/Auth.vue'),
        meta: { guest: true }
      },
      {
        path: '/password/email',
        name: 'guest.password.email',
        component: () => import('components/Auth.vue'),
        meta: { guest: true }
      },
      {
        path: 'api/password/reset',
        name: 'guest.password.reset',
        component: () => import('components/Auth.vue'),
        meta: { guest: true }
      },
      {
        path: '/password/reset/:token',
        name: 'guest.password.reset.token',
        component: () => import('components/Auth.vue'),
        meta: { guest: true }
      },
      {
        path: '/reset-password/:token',
        name: 'guest.reset-password.token',
        component: () => import('components/Auth.vue'),
        meta: { guest: true }
      },
      {
        path: ':name',
        name: 'invited.user',
        component: () => import('pages/IndexPage.vue'),
        meta: { guest: true }
      },
      // {
      //   path: '/user',
      //   name: 'invited.user',
      //   component: () => import('pages/IndexPage.vue'),
      //   meta: { auth: true }
      // },
      // Auth Routes
      {
        path: '/chat/:id',
        name: 'auth.chat.id',
        component: () => import('components/Chat.vue'),
        meta: { auth: true }
      },
      {
        path: '/library',
        name: 'auth.files',
        component: () => import('components/UserFiles.vue'),
        meta: { auth: true }
      },
      {
        path: '/views',
        name: 'auth.views',
        component: () => import('pages/UsersViews.vue'),
        meta: { auth: true }
      },
      {
        path: '/profile',
        name: 'auth.profile',
        component: () => import('components/Profile.vue'),
        meta: { auth: true }
      },
      {
        path: '/users',
        name: 'auth.users',
        component: () => import('pages/UsersList.vue'),
        meta: { auth: true }
      },
      {
        path: '/analytics',
        name: 'auth.analytics',
        component: () => import('pages/UsersAnalytics.vue'),
        meta: { auth: true }
      },
      {
        path: '/locations',
        name: 'auth.locations',
        component: () => import('pages/UsersLocations.vue'),
        meta: { auth: true }
      },
      {
        path: '/currencies',
        name: 'auth.currencies',
        component: () => import('pages/UserCurrencies.vue'),
        meta: { auth: true }
      },
      // {
      //   path: '/payment/:id',
      //   name: 'auth.payment.id',
      //   component: () => import('pages/Payment.vue'),
      //   meta: { auth: true } // PaymentPostModule
      // },
      {
        path: '/pages',
        name: 'auth.pages',
        component: () => import('pages/PagesList.vue'),
        meta: { auth: true }
      },
      {
        path: '/reports',
        name: 'auth?.reports',
        component: () => import('components/UserReports.vue'),
        meta: { auth: true }
      },
      {
        path: '/test',
        name: 'auth.test',
        component: () => import('pages/TestPage.vue'),
        meta: { auth: true }
      },
      // Verify Route
      { path: 'verify/:email',
        // name: 'auth.verification.verify',
        component: () => import('pages/IndexPage.vue'),
        // component: () => import('components/Auth.vue'),
        meta: { public: true }
      },
      // { path: 'email/verify/:id/:hash',
      //   name: 'auth.verification.verify',
      //   component: () => import('components/Auth.vue'),
      //   meta: { verify: true }
      // },
      { path: 'api/email/verify/:id/:hash',
        name: 'auth.api.verification.verify',
        component: () => import('components/Auth.vue'),
        meta: { verify: true }
      },
      { path: '/email/verify',
        name: 'auth.verify',
        component: () => import('components/Auth.vue'),
        meta: { verify: true }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { error: true }
  }
];

export default routes;
