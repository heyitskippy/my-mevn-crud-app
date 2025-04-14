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
      sidebar: () => import('@/components/layout/TheSidebar.vue'),
      default: () => import('@/views/UserList.vue'),
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
      sidebar: () => import('@/components/layout/TheSidebar.vue'),
      default: () => import('@/views/UserEdit.vue'),
    },
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/:catchAll(.*)*',
    name: '404',
    components: {
      header: () => import('@/components/layout/TheHeader.vue'),
      sidebar: () => import('@/components/layout/TheSidebar.vue'),
      default: () => import('@/views/ErrorPage.vue'),
    },
    meta: {
      title: 'Error 404',
      hideInMenu: true,
    },
  },
] satisfies RouteRecordRaw[]
