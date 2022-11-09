import homePage from './views/app-home.cmp.js'
import aboutPage from './views/app-about.cmp.js'

const { createRouter, createWebHashHistory } = VueRouter

const routerOptions = {
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: homePage,
    },
    {
      path: '/about',
      component: aboutPage,
    },
    {
      path: '/maily',
      component: mailyApp,
      children: [
        {
          path: 'compose/:id?',
          component: emailCompose,
        },
        {
          path: ':id',
          component: emailPreview,
        },
      ],
    },
    {
      path: '/keepy',
      component: keepyApp,
      children: [
        {
          path: ':id',
          component: noteEdit,
        },
      ],
    },
    {
      path: '/booky',
      component: bookyApp,
      children: [
        {
          path: ':id',
          component: bookDetails,
          children: [
            {
              path: 'review/:id',
              component: reviewPreview,
            },
          ],
        },
      ],
    },
  ],
}

export const router = createRouter(routerOptions)
