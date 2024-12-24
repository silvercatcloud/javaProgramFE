//router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      component:()=>import('../views/Layout.vue'),//布局架子
      redirect:'/students',//重定向
      children:[
        {path:'/students',component:()=>import('@/views/StudentList.vue')},
        {path:'/score',component:()=>import('@/views/ScoreList.vue')},
        // {path:'/user/profile',component:()=>import('@/views/user/UserProfile.vue')},//个人详情
        // {path:'/user/avatar',component:()=>import('@/views/user/UserAvatar.vue')},//更换头像
        // {path:'/user/password',component:()=>import('@/views/user/UserPassword.vue')},//重置密码      
      ]
    },
  ]
})

export default router