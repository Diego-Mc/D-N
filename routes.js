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
      name: 'D&N',
    },
    {
      path: '/about',
      component: aboutPage,
      name: 'about',
    },
    {
      path: '/maily',
      component: mailyApp,
      name: 'maily',
      children: [
        {
          path: 'inbox',
          component: emailDetails,
          name: 'inbox',
        },
        {
          path: 'sent',
          component: emailDetails,
          name: 'sent',
        },
        {
          path: 'draft',
          component: emailDetails,
          name: 'draft',
        },
        {
          path: 'trash',
          component: emailDetails,
          name: 'trash',
        },
      ],
    },
    {
      path: '/keepy',
      component: keepyApp,
      name: 'keepy',
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
    //   name: 'booky',
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
