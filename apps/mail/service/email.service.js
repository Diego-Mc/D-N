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
}

function query() {
  return storageService.query(EMAIL_KEY)
}

function get(emailId) {
  return storageService.get(EMAIL_KEY, emailId)
}

function remove(emailId) {
  return storageService.remove(EMAIL_KEY, emailId)
}

function save(email) {
  email.sentAt = Date.now()
  if (email.id) {
    return storageService.put(EMAIL_KEY, email)
  } else {
    return storageService.post(EMAIL_KEY, email)
  }
}

function getEmptyEmail(subject = '', body = '') {
  return {
    id: '',
    subject,
    body,
    isRead: false,
    sentAt: null,
    from: { email: '', name: '' },
    to: { email: '', name: '' },
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
  var survey = {
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
  return Promise.resolve(survey)
}

function saveDraft(email) {
  email.imgUrl = email.imgUrl || 'assets/img/diego.jpeg'
  email.from = { ...loggedinUser }
  email.state = 'draft'
  return save(email)
}

function sendEmail(email) {
  email.state = 'inbox'
  return save(email)
}

function _createEmails() {
  let emails = utilService.loadFromStorage(EMAIL_KEY)
  if (!emails || !emails.length) {
    emails = [
      {
        id: '12345',
        subject: 'A new email',
        body: 'This is a new email that was sent for you to read.',
        imgUrl: 'assets/img/diego.jpeg',
        isRead: false,
        sentAt: Date.now(),
        from: { email: 'puki@gmail.com', name: 'Puki Ben David' },
        to: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
      },
      {
        id: '12346',
        subject: 'A new thing to read',
        body: 'This is a new thing sent for you to read.',
        imgUrl: 'assets/img/diego.jpeg',
        isRead: false,
        sentAt: Date.now(),
        from: { email: 'puki@gmail.com', name: 'Puki Ben David' },
        to: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
      },
      {
        id: '12385',
        subject: 'A cool email',
        body: 'This for you to read.',
        imgUrl: 'assets/img/diego.jpeg',
        isRead: false,
        sentAt: Date.now(),
        from: { email: 'puki@gmail.com', name: 'Puki Ben David' },
        to: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
      },
      {
        id: '19345',
        subject: 'A old email',
        body: 'This is a new email that was sent for you to read. lorem lorem!!',
        imgUrl: 'assets/img/diego.jpeg',
        isRead: false,
        sentAt: Date.now(),
        from: { email: 'puki@gmail.com', name: 'Puki Ben David' },
        to: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
      },
      {
        id: '12305',
        subject: 'An email',
        body: 'This is a something.',
        imgUrl: 'assets/img/diego.jpeg',
        isRead: false,
        sentAt: Date.now(),
        from: { email: 'puki@gmail.com', name: 'Puki Ben David' },
        to: { email: 'projkd1@gmail.com', name: 'Diego Mc' },
      },
    ]
    utilService.saveToStorage(EMAIL_KEY, emails)
  }
  return emails
}
