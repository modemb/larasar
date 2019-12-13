
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '/',
        name: 'public.index',
        component: () => import('pages/Index.vue')
      },
      {
        path: '/login',
        name: 'public.login',
        component: () => import('pages/auth/login')
      },
      {
        path: '/register',
        name: 'public.register',
        component: () => import('pages/auth/register')
      },
      {
        path: '/password/reset',
        name: 'public.password.reset',
        component: () => import('pages/auth/password/email')
      },
      {
        path: '/block_chain',
        name: 'public.block_chain',
        component: () => import('pages/BlockChain')
      },
      {
        path: '/password/reset/:token',
        name: 'public.password.reset.token',
        component: () => import('pages/auth/password/reset')
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
