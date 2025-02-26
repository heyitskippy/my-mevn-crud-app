export default [
  {
    path: '/',
    name: 'home',
    redirect: '/users',
  },
  {
    path: '/users',
    name: 'users',
    components: {
      header: () => import('@/components/layout/TheHeader.vue'),
      default: () => import('@/views/UserView.vue'),
    },
  },
]
