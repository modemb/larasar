const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // Public Routes
      {
        path: '',
        name: 'index',
        component: () => import('pages/Index.vue'),
        meta: { public: true }
      },
      {
        path: '/category/:id',
        name: 'public.category.id',
        component: () => import('components/Categories.vue'),
        // component: () => import('pages/Index.vue'),
        // meta: { public: true }
        meta: { auth: true }
      },
      {
        path: '/subcategory/:id',
        name: 'public.subcategory.id',
        component: () => import('components/Categories.vue'),
        // component: () => import('pages/Index.vue'),
        // meta: { public: true }
        meta: { auth: true }
      },
      {
        path: '/search/:posts',
        name: 'public.search.posts',
        component: () => import('components/Categories.vue'),
        meta: { public: true }
      },
      {
        path: '/post/:id',
        name: 'public.post.id',
        component: () => import('components/Post'),
        // component: () => import('pages/PostOld'),
        meta: { public: true }
      },
      {
        path: '/page/:slug',
        name: 'public.pages',
        component: () => import('pages/Page.vue'),
        meta: { public: true }
      },
      // Guest Routes
      {
        path: 'login',
        name: 'guest.login',
        component: () => import('components/Auth'),
        // component: () => import('pages/auth/login.vue'),
        meta: { guest: true }
      },
      {
        path: 'register',
        name: 'guest.register',
        component: () => import('components/Auth'),
        // component: () => import('pages/auth/register.vue'),
        meta: { guest: true }
      },
      {
        path: 'api/login/:driver/callback',
        name: 'social.login',
        component: () => import('components/Auth'),
        // component: () => import('pages/auth/login.vue'),
        meta: { guest: true }
      },
      {
        path: '/password/email',
        name: 'guest.password.email',
        // component: () => import('pages/auth/password/email.vue'),
        component: () => import('components/Auth'),
        meta: { guest: true }
      },
      {
        path: 'api/password/reset',
        name: 'guest.password.reset',
        // component: () => import('pages/auth/password/reset.vue'),
        component: () => import('components/Auth'),
        meta: { guest: true }
      },
      {
        path: '/password/reset/:token',
        name: 'guest.password.reset.token',
        // component: () => import('pages/auth/password/reset.vue'),
        component: () => import('components/Auth'),
        meta: { guest: true }
      },
      {
        path: '/reset-password/:token',
        name: 'guest.reset-password.token',
        // component: () => import('pages/auth/password/reset.vue'),
        component: () => import('components/Auth'),
        meta: { guest: true }
      },
      {
        path: '/user',
        name: 'invited.user',
        component: () => import('pages/Index.vue'),
        meta: { auth: true }
      },
      // Auth Routes
      {
        path: '/chat/:id',
        name: 'auth.chat.id',
        // component: () => import('components/ChatOld'),
        component: () => import('components/Chat'),
        meta: { auth: true }
      },
      {
        path: '/library',
        name: 'auth.files',
        component: () => import('components/Files.vue'),
        meta: { auth: true }
      },
      {
        path: '/views',
        name: 'auth.views',
        component: () => import('pages/Views.vue'),
        meta: { auth: true }
      },
      {
        path: '/profile',
        name: 'auth.profile',
        component: () => import('components/Profile.vue'),
        // component: () => import('pages/Profile.vue'),
        meta: { auth: true }
      },
      {
        path: '/users',
        name: 'auth.users',
        component: () => import('pages/Users.vue'),
        meta: { auth: true }
      },
      {
        path: '/analytics',
        name: 'auth.analytics',
        component: () => import('pages/Analytics.vue'),
        meta: { auth: true }
      },
      {
        path: '/locations',
        name: 'auth.locations',
        component: () => import('pages/Locations.vue'),
        meta: { auth: true }
      },
      {
        path: '/post',
        // path: '/post/categories',
        name: 'public.post.categories',
        component: () => import('components/Post'),
        // component: () => import('pages/PostOld'),
        // meta: { auth: true }
        meta: { public: true, radioCategory: true }
      }, // TagAddPost
      {
        path: '/post/:id/categories',
        name: 'post.id.categories',
        component: () => import('components/Post'),
        // meta: { auth: true }
        meta: { public: true, radioCategory: true }
      }, // TagUpdatePostCategory
      // {
      //   path: '/post/:subcategory',
      //   name: 'auth.post.subcategory',
      //   component: () => import('components/Post'),
      //   // component: () => import('pages/Post.vue'),
      //   meta: { auth: true }
      // },
      {
        path: '/favorites',
        name: 'auth.favorites',
        component: () => import('pages/Favorites.vue'),
        meta: { auth: true }
      },
      {
        path: '/posts',
        name: 'auth.posts',
        component: () => import('pages/Posts.vue'),
        meta: { auth: true }
      },
      {
        path: '/messages',
        name: 'auth.messages',
        component: () => import('pages/Messages.vue'),
        meta: { auth: true }
      },
      {
        path: '/payment/:id',
        name: 'auth.payment.id',
        component: () => import('pages/Payment.vue'),
        meta: { auth: true } // PaymentPostModule
      },
      {
        path: '/pages',
        name: 'auth.pages',
        component: () => import('pages/Pages'),
        meta: { auth: true }
      },
      {
        path: '/reports',
        name: 'auth.reports',
        component: () => import('components/Reports.vue'),
        // component: () => import('pages/Reports.vue'),
        meta: { auth: true }
      },
      {
        path: '/test',
        name: 'auth.test',
        component: () => import('pages/Test.vue'),
        meta: { auth: true }
      },
      // Verify Route
      { path: 'email/verify/:id/:hash',
        name: 'auth.verification.verify',
        component: () => import('components/Auth'),
        // component: () => import('pages/auth/verify.vue'),
        meta: { verify: true }
      },
      { path: 'api/email/verify/:id/:hash',
        name: 'auth.api.verification.verify',
        component: () => import('components/Auth'),
        // component: () => import('pages/auth/verify'),
        meta: { verify: true }
      },
      { path: '/email/verify',
        name: 'auth.verify',
        component: () => import('components/Auth'),
        // component: () => import('pages/auth/verify.vue'),
        meta: { verify: true }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
    meta: { error: true }
  }
]

export default routes
