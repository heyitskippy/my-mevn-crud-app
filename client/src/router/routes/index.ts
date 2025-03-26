import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/',
    name: 'home',
    redirect: '/users/list',
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/users/list',
    name: 'users-list',
    components: {
      header: () => import('@/components/layout/TheHeader.vue'),
      default: () => import('@/views/UserView.vue'),
    },
    meta: {
      title: 'Users',
    },
  },
  {
    path: '/users/:id?',
    name: 'users-edit',
    components: {
      header: () => import('@/components/layout/TheHeader.vue'),
      default: () => import('@/views/UserEdit.vue'),
    },
    meta: {
      hideInMenu: true,
    },
  },
] satisfies RouteRecordRaw[]
