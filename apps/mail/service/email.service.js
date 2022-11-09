import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const EMAIL_KEY = 'emailDB'
_createEmails()

export const emailService = {
  query,
  get,
  remove,
  save,
  getEmptyEmail,
  getNextEmailId,
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
    from: '',
    to: '',
  }
}

function getNextEmailId(emailId) {
  return storageService.query(EMAIL_KEY).then((emails) => {
    var idx = emails.findIndex((email) => email.id === emailId)
    if (idx === emails.length - 1) idx = -1
    return emails[idx + 1].id
  })
}

function _createEmails() {
  let emails = utilService.loadFromStorage(EMAIL_KEY)
  if (!emails || !emails.length) {
    emails = [
      {
        id: '12345',
        subject: 'A new email',
        body: 'This is a new email that was sent for you to read.',
        isRead: false,
        sentAt: Date.now(),
        from: 'puki@gmail.com',
        to: 'projkd1@gmail.com',
      },
    ]
    utilService.saveToStorage(EMAIL_KEY, emails)
  }
  return emails
}
