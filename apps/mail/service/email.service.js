import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const EMAIL_KEY = 'emailDB'

const loggedinUser = {
  email: 'diego@appsus.com',
  fullname: 'Diego Mc',
}

_createEmails()

export const emailService = {
  query,
  get,
  remove,
  save,
  getEmptyEmail,
  getNextEmailId,
  getComposeSurvey,
  saveDraft,
  sendEmail,
  checkValidity,
  getAdvancedSearchOptions,
}

function query({
  search = '',
  isRead = undefined,
  isStarred = undefined,
  labels = [],
  searchAreas = [],
} = {}) {
  return storageService.query(EMAIL_KEY).then((emails) => {
    return emails
      .filter((e) => {
        if (searchAreas.length === 0) {
          return (
            e.subject.includes(search) ||
            e.body.includes(search) ||
            e.signature.includes(search)
          )
        }
        return searchAreas.some((area) => e[area].includes(search))
      })
      .filter((e) => {
        return isStarred === undefined ? 'true' : e.isStarred === isStarred
      })
      .filter((e) => {
        return isRead === undefined ? 'true' : e.isRead === isRead
      })
      .filter((e) => {
        if (labels.length === 0) return true
        return e.labels.some((label) => labels.includes(label))
      })
  })
}

function get(emailId) {
  return storageService.get(EMAIL_KEY, emailId)
}

function remove(emailId) {
  return storageService.remove(EMAIL_KEY, emailId)
}

function save(email) {
  if (email.id) {
    return storageService.put(EMAIL_KEY, email)
  } else {
    return storageService.post(EMAIL_KEY, email)
  }
}

// function getUnreadCounts() {
//   return storageService.query(EMAIL_KEY).then((emails) => {
//     return emails
//       .filter((e) => !e.isRead)
//       .reduce(
//         (acc, e) => {
//           if (utilService.isValidTimestamp(e.removedAt)) acc.trash += 1
//           else acc[e.state] += 1
//           return acc
//         },
//         { inbox: 0, sent: 0, draft: 0, trash: 0 }
//       )
//   })
// }

function getEmptyEmail(subject = '', body = '') {
  return {
    id: '',
    subject,
    body,
    isRead: false,
    isStarred: false,
    sentAt: null,
    from: { email: '', name: '' },
    to: { email: '', name: '' },
    labels: [],
    signature: '',
  }
}

function getNextEmailId(emailId) {
  return storageService.query(EMAIL_KEY).then((emails) => {
    var idx = emails.findIndex((email) => email.id === emailId)
    if (idx === emails.length - 1) idx = -1
    return emails[idx + 1].id
  })
}

function checkValidity(email) {
  console.log(
    'checking',
    !email.to,
    !email.to.email,
    !email.to || !email.to.email
  )
  if (!email.to || !email.to.email)
    return { isValid: false, missing: 'recipient email' }
  if (!email.subject) return { isValid: false, missing: 'subject' }
  if (!email.body) return { isValid: false, missing: 'body' }
  else return { isValid: true }
}

function getComposeSurvey(
  { to = '', subject = '', body = '', sign = '' } = ''
) {
  return {
    title: 'New Message',
    cmps: [
      {
        type: 'textBox',
        info: {
          label: 'to',
          val: to,
          key: 'to',
        },
      },
      {
        type: 'textBox',
        info: {
          label: 'subj',
          val: subject,
          key: 'subject',
        },
      },
      {
        type: 'textArea',
        info: {
          label: 'body',
          val: body,
          key: 'body',
        },
      },
      {
        type: 'textBox',
        info: {
          label: 'sign',
          val: sign,
          key: 'signature',
        },
      },
    ],
  }
}

function getAdvancedSearchOptions() {
  return {
    cmps: [
      {
        type: 'checkBox',
        info: {
          label: 'only search in',
          opts: ['subject', 'body', 'signature'],
          key: 'searchAreas',
        },
      },
      {
        type: 'radioCheck',
        info: {
          label: 'starred status',
          opts: [
            { txt: 'starred', val: true },
            { txt: 'unstarred', val: false },
          ],
          key: 'isStarred',
        },
      },
      {
        type: 'radioCheck',
        info: {
          label: 'read status',
          opts: [
            { txt: 'read', val: true },
            { txt: 'unread', val: false },
          ],
          key: 'isRead',
        },
      },
      {
        type: 'checkBox',
        info: {
          label: 'labels',
          opts: ['love', 'work', 'school', 'project'],
          key: 'labels',
        },
      },
    ],
  }
}

function saveDraft(draft) {
  if (!draft.id && isEmailEmpty(draft))
    return Promise.reject("Draft is empty. Didn't save.")
  draft.imgUrl = draft.imgUrl || 'assets/img/diego.jpeg'
  draft.from = { ...loggedinUser }
  draft.state = 'draft'
  draft.sentAt = Date.now()
  return save(draft)
}

function isEmailEmpty(email) {
  return !email.subject && !email.to.email && !email.body && !email.signature
}

function sendEmail(email) {
  email.state = 'sent'
  return save(email)
}

function _createEmails() {
  let emails = utilService.loadFromStorage(EMAIL_KEY)
  if (!emails || !emails.length) {
    emails = [
      {
        id: '123',
        state: 'inbox',
        subject: 'Watch hundreds of movies, shows and documentaries today.',
        body: 'Thanks for considering Netflix. \n\nStart watching, pause, then pick up right where you left off on the same device or another device that connects to Netflix. \n\nNetflix is commercial-free — always.',
        imgUrl: 'assets/img/netflix-logo.jpeg',
        isRead: false,
        isStarred: true,
        sentAt: 1667792843000,
        from: { email: 'netflix@gmail.com', name: 'Netflix' },
        to: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
        labels: ['subscriptions', 'fun'],
        signature: 'Netflix',
      },
      {
        id: '456',
        state: 'sent',
        subject: 'How are you?',
        body: 'Please reply. \n\nI got an email from Netflix, can we watch together?',
        imgUrl: 'assets/img/random.jpeg',
        isRead: false,
        isStarred: false,
        sentAt: 1668224843000,
        from: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
        to: { email: 'shlomit@gmail.com', name: 'Shlomit' },
        labels: ['fun'],
        signature: 'Diego Mc',
      },
      {
        id: '789',
        state: 'sent',
        subject: 'URGENT! reply ASAP',
        body: 'Are you the real morgan freeman?',
        imgUrl: 'assets/img/morgan.jpeg',
        isRead: false,
        isStarred: false,
        sentAt: 1667533643000,
        from: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
        to: { email: 'morgan@gmail.com', name: 'Morgan Freeman' },
        labels: ['important'],
        signature: 'Diego Mc',
      },
      {
        id: '258',
        state: 'draft',
        subject: 'I got to make some demo data!',
        body: "I hope I'll have enough time to sen...",
        imgUrl: 'assets/img/diego.jpg',
        isRead: false,
        isStarred: false,
        sentAt: 1666579643000,
        from: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
        to: { email: 'puki@gmail.com', name: 'Puki Ben David' },
        labels: ['work'],
        signature: 'Diego Mc',
      },
      {
        id: '147',
        state: 'inbox',
        subject: 'Important email',
        body: 'This email is very important! please restore it!',
        imgUrl: 'assets/img/user2.jpg',
        isRead: false,
        isStarred: true,
        sentAt: 1666493243000,
        removedAt: 1666514843000,
        from: { email: 'tim@gmail.com', name: 'Tim Apple' },
        to: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
        labels: ['important'],
        signature: 'Tim Apple',
      },
      {
        id: '147',
        state: 'inbox',
        subject: 'Important email',
        body: 'This email is not important at all! Remove it completely!\n\n\n\n\n\nIf you dare...',
        imgUrl: 'assets/img/user3.jpeg',
        isRead: false,
        isStarred: false,
        sentAt: 1666082843000,
        removedAt: 1660812443000,
        from: { email: 'julia@gmail.com', name: 'Julia Wan' },
        to: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
        labels: [],
        signature: 'Julia Wan',
      },
      {
        id: '123877',
        state: 'inbox',
        subject: 'Listen to all of the songs. ever.',
        body: 'Spotify is the best as you know. \nContinue listening to millions of songs for free. \n\nWe are happy to be of service',
        imgUrl: 'assets/img/spotify.png',
        isRead: false,
        isStarred: true,
        sentAt: 1660207643000,
        from: { email: 'spotify@gmail.com', name: 'Spotify' },
        to: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
        labels: ['subscriptions', 'fun'],
        signature: 'Spotify',
      },
    ]
    utilService.saveToStorage(EMAIL_KEY, emails)
  }
  return emails
}
