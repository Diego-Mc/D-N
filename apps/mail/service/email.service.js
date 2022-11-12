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
  getUnreadCounts,
}

function query({
  state = '',
  search = '',
  isRead = undefined,
  isStarred = undefined,
  isRemoved = undefined,
  labels = [],
  searchAreas = [],
} = {}) {
  return storageService.query(EMAIL_KEY).then((emails) => {
    return emails
      .filter((e) => {
        if (isRemoved) return utilService.isValidTimestamp(e.removedAt)
        return !utilService.isValidTimestamp(e.removedAt) && e.state === state
      })
      .filter((e) => {
        if (searchAreas.length === 0) {
          return (
            e.subject.includes(search) &&
            e.body.includes(search) &&
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
        return e.labels.every((label) => labels.includes(label))
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

function getUnreadCounts() {
  return storageService.query(EMAIL_KEY).then((emails) => {
    return emails
      .filter((e) => !e.isRead)
      .reduce(
        (acc, e) => {
          if (utilService.isValidTimestamp(e.removedAt)) acc.trash += 1
          else acc[e.state] += 1
          return acc
        },
        { inbox: 0, sent: 0, draft: 0, trash: 0 }
      )
  })
}

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
        body: '"Thanks for considering Netflix. \n\nStart watching, pause, then pick up right where you left off on the same device or another device that connects to Netflix. \n\nNetflix is commercial-free — always."',
        imgUrl: 'assets/img/netflix-logo.jpeg',
        isRead: false,
        isStarred: true,
        sentAt: 1667328712,
        from: { email: 'netflix@gmail.com', name: 'Netflix' },
        to: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
        labels: [],
        signature: 'Netflix',
      },
      {
        id: '456',
        state: 'inbox',
        subject: 'How are you?',
        body: 'Please reply. \n\nI got an email from Netflix, can we watch together?',
        imgUrl: 'assets/img/random.jpeg',
        isRead: false,
        isStarred: false,
        sentAt: 1668192712,
        from: { email: 'shlomit@gmail.com', name: 'Shlomit' },
        to: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
        labels: [],
        signature: 'Puki',
      },
      {
        id: '789',
        state: 'sent',
        subject: 'URGENT! reply ASAP',
        body: 'Puki I need your help!!',
        imgUrl: 'assets/img/morgan.jpeg',
        isRead: false,
        isStarred: false,
        sentAt: 1667933512,
        from: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
        to: { email: 'puki@gmail.com', name: 'Puki Ben David' },
        labels: [],
        signature: 'Diego',
      },
      {
        id: '258',
        state: 'sent',
        subject: 'A old email',
        body: 'This is a new email that was sent for you to read. lorem lorem!!',
        imgUrl: 'assets/img/diego.jpeg',
        isRead: false,
        isStarred: false,
        sentAt: Date.now(),
        from: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
        to: { email: 'puki@gmail.com', name: 'Puki Ben David' },
        labels: [],
        signature: 'Diego',
      },
      {
        id: '147',
        state: 'sent',
        subject: 'An email',
        body: 'This is a something.',
        imgUrl: 'assets/img/diego.jpeg',
        isRead: false,
        isStarred: false,
        sentAt: Date.now(),
        from: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
        to: { email: 'puki@gmail.com', name: 'Puki Ben David' },
        labels: [],
        signature: 'Diego',
      },
    ]
    utilService.saveToStorage(EMAIL_KEY, emails)
  }
  return emails
}
