
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      // Public Routes
      {
        path: '/',
        name: 'index',
        component: () => import('pages/Index.vue'),
        meta: { auth: false }
      },
      {
        path: '/login',
        name: 'public.login',
        component: () => import('pages/auth/login'),
        meta: { auth: false }
      },
      {
        path: '/register',
        name: 'public.register',
        component: () => import('pages/auth/register'),
        meta: { auth: false }
      },
      {
        path: '/password/reset',
        name: 'public.password.reset',
        component: () => import('pages/auth/password/email'),
        meta: { auth: false }
      },
      {
        path: '/password/reset/:token',
        name: 'public.password.reset.token',
        component: () => import('pages/auth/password/reset'),
        meta: { auth: false }
      },
      // Auth Routes
      {
        path: '/profile',
        name: 'auth.profile',
        component: () => import('pages/Profile'),
        meta: { auth: true }
      },
      {
        path: '/users',
        name: 'auth.users',
        component: () => import('pages/Users'),
        meta: { auth: true }
      },
      {
        path: '/test',
        name: 'auth.test',
        component: () => import('pages/Test'),
        meta: { auth: true }
      },
      // Verify Route
      { path: 'email/verify/:id/:hash',
        name: 'auth.verification.verify',
        component: () => import('pages/auth/verify'),
        meta: { verify: true }
      },
      { path: 'api/email/verify/:id/:hash',
        name: 'auth.api.verification.verify',
        component: () => import('pages/auth/verify'),
        meta: { verify: true }
      },
      { path: '/email/verify',
        name: 'auth.verify',
        component: () => import('pages/auth/verify'),
        meta: { verify: true }
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
