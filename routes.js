import homePage from './views/app-home.cmp.js'
import aboutPage from './views/app-about.cmp.js'

import keepyApp from './apps/keep/pages/note-app.cmp.js'
import noteEdit from './apps/keep/cmps/note-edit.cmp.js'

import mailyApp from './apps/mail/pages/email-app.cmp.js'
import emailCompose from './apps/mail/cmps/email-compose.cmp.js'
import emailDetails from './apps/mail/cmps/email-details.cmp.js'

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
          component: emailDetails,
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
    // {
    //   path: '/booky',
    //   component: bookyApp,
    //   children: [
    //     {
    //       path: ':id',
    //       component: bookDetails,
    //       children: [
    //         {
    //           path: 'review/:id',
    //           component: reviewPreview,
    //         },
    //       ],
    //     },
    //   ],
    // },
  ],
}

export const router = createRouter(routerOptions)
