import type { RouteRecordRaw } from 'vue-router'
import { Role } from '_/types/users'

import { checkRights } from '@/router/auth'

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
      roles: [Role.Admin, Role.User],
    },
    beforeEnter: [checkRights],
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
      roles: [Role.Admin],
    },
    beforeEnter: [checkRights],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginPage.vue'),
    meta: {
      title: 'Login',
      hideInMenu: true,
    },
    beforeEnter: [checkRights],
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
    beforeEnter: [checkRights],
  },
] satisfies RouteRecordRaw[]
