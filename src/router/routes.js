const routes = [
  {
    path: '/layout',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  // {
  //   path: '/:catchAll(.*)*',
  //   component: () => import('pages/ErrorNotFound.vue')
  // },

  {
    path:'/',
    component: () => import('src/pages/HomePage.vue')
  },
{
    path:'/tamil',
    component: () => import('src/pages/TamilWords.vue')
   },
   {
    path:'/new',
    component: () => import('src/pages/NewPuzzle.vue')
   }

]

export default routes
