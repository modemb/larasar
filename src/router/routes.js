
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
<<<<<<< HEAD
      { path: '', component: () => import('pages/Index.vue') }
=======
      {
        path: '/',
        name: 'public.index',
        component: () => import('pages/Index.vue')
      },
      {
        path: '/login',
        name: 'public.login',
        component: () => import('pages/auth/login.vue')
      },
      {
        path: '/register',
        name: 'public.register',
        component: () => import('pages/auth/register.vue')
      }
>>>>>>> modemb/dev
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
