import { emailService } from '../service/email.service.js'

import emailCompose from '../cmps/email-compose.cmp.js'
import emailFilter from '../cmps/email-filter.cmp.js'
import emailFolderList from '../cmps/email-folder-list.cmp.js'
import emailList from '../cmps/email-list.cmp.js'
import emailDetails from '../cmps/email-details.cmp.js'
import {
  eventBus,
  showSuccessMsg,
} from '../../../services/event-bus.service.js'
import { userModal } from '../../../cmps/user-modal.cmp.js'
import { utilService } from '../../../services/util.service.js'

export default {
  template: /* HTML */ `
    <main class="email-main">
      <email-folder-list :unreadLabels="getFolderCounts" />
      <email-list
        @star="starEmail"
        @trash="removeEmail"
        v-if="emails && getEmailsToShow.length"
        @emailSelected="doEmailSelect"
        :selectedEmail="selectedEmail"
        :emails="getEmailsToShow" />
      <section v-else class="email-list preview selected round">
        <h1>{{headerPreview}}</h1>
        <p>{{paragraphPreview}}</p>
      </section>
      <email-compose @closeCompose="composeClose" v-if="isCompose" />
      <email-details
        @star="starEmail"
        @trash="removeEmail"
        v-else-if="selectedEmail"
        :email="selectedEmail" />
      <section v-else class="email-details preview selected round">
        <h1>No email selected</h1>
        <p>select a message to view</p>
      </section>
    </main>
  `,
  data() {
    return {
      emails: null,
      selectedEmail: null,
      isCompose: false,
      criteria: {
        search: '', // no need to support complex text search
        isRead: undefined, // (optional property, if missing: show all)
        isStarred: undefined, // (optional property, if missing: show all)
        lables: [], // has any of the labels
        searchAreas: [],
      },
      unreadLabels: null,
      currentFolder: '',
    }
  },
  created() {
    if (!this.folderName) this.$router.push('/maily/inbox')

    this.setFolder()
    this.updateEmails().then(() => this.setIsCompose())

    eventBus.on('starEmail', this.starEmail)
    eventBus.on('removeEmail', this.removeEmail)
    eventBus.on('restoreEmail', this.restoreEmail)
    eventBus.on('markAsRead', this.markAsRead)
    eventBus.on('unselectEmail', this.unselectEmail)
    eventBus.on('updateLabels', this.updateLabels)
    eventBus.on('maily-advancedSearch', (criteria) => {
      this.selectedEmail = null
      this.isCompose = false
      this.criteria = criteria
      this.updateEmails()
    })
  },
  methods: {
    setFolder() {
      this.currentFolder = this.folderName
    },
    // getUnreadLabels() {
    //   return emailService
    //     .getUnreadCounts()
    //     .then((counts) => (this.unreadLabels = counts))
    // },
    // updateCriteria(criteria) {
    //   criteria.state = this.criteria.state
    //   this.criteria = criteria
    // },
    updateLabels(email, labels) {
      email.labels = labels
      emailService.save(email).then(() => this.updateEmails())
    },
    doEmailSelect(email) {
      this.composeClose()
      this.selectedEmail = email
    },
    composeClose() {
      this.$router.push({ query: {} })
      this.isCompose = false
      this.selectedEmail = null
      this.updateEmails()
    },
    updateEmails(criteria = this.criteria) {
      console.log(criteria, this.folderName)

      return emailService
        .query(criteria)
        .then((emails) => (this.emails = emails))
    },
    setIsCompose() {
      const isComposing = this.$route.query.isCompose
      if (isComposing === 'true') this.isCompose = true
    },
    starEmail(email) {
      email.isStarred = !email.isStarred
      emailService.save(email).then(() => this.updateEmails())
    },
    removeEmail(email) {
      const updateSelectedRemovedUser = () => {
        if (this.selectedEmail && this.selectedEmail.id === email.id) {
          this.unselectEmail()
        }
      }

      const modalOpts = {
        question: 'Are you sure?',
        warning: 'If you proceed your email will be removed completely.',
        opt1: 'I am sure',
        opt2: 'Cancel',
      }

      if (email.removedAt) {
        userModal.showModal(modalOpts).then((ans) => {
          if (!ans) return
          emailService.remove(email.id).then(() => {
            this.updateEmails().then(() => {
              updateSelectedRemovedUser()
              showSuccessMsg('Your email was successfully removed.')
            })
          })
        })
      } else {
        const e = { ...email, removedAt: Date.now() }
        emailService.save(e).then(() => {
          this.updateEmails().then(() => {
            updateSelectedRemovedUser()
            showSuccessMsg('Your email was moved to the trash folder.')
          })
        })
      }
    },
    restoreEmail(email) {
      const e = { ...email, removedAt: undefined }
      emailService.save(e).then(() => {
        this.updateEmails()
      })
    },
    markAsRead(email, force) {
      email.isRead = force ?? !email.isRead
      emailService.save(email).then(() => this.updateEmails())
    },
    unselectEmail() {
      this.selectedEmail = null
    },
  },
  computed: {
    folderName() {
      const route = this.$route.matched[1]
      return route?.name
    },
    getEmailsToShow() {
      return this.emails?.filter((e) => {
        if (this.currentFolder === 'trash')
          return utilService.isValidTimestamp(e.removedAt)
        return (
          !utilService.isValidTimestamp(e.removedAt) &&
          e.state === this.currentFolder
        )
      })
    },
    getFolderCounts() {
      return this.emails
        ?.filter((e) => !e.isRead)
        .reduce(
          (acc, e) => {
            if (utilService.isValidTimestamp(e.removedAt)) acc.trash += 1
            else acc[e.state] += 1
            return acc
          },
          { inbox: 0, sent: 0, draft: 0, trash: 0 }
        )
    },
    headerPreview() {
      switch (this.folderName) {
        case 'inbox':
          return 'Inbox is empty'
        case 'sent':
          return 'Send emails for free'
        case 'draft':
          return 'No drafts'
        case 'trash':
          return 'Your trash is empty'
      }
    },
    paragraphPreview() {
      switch (this.folderName) {
        case 'inbox':
          return 'Send emails to get connected'
        case 'sent':
          return 'Click the compose button and start typing'
        case 'draft':
          return 'Drafts are auto-saved while composing'
        case 'trash':
          return 'Good job! very clean'
      }
    },
  },
  watch: {
    folderName() {
      this.setFolder()
      this.updateEmails()
    },
    '$route.query': {
      handler() {
        this.setIsCompose()
      },
      deep: true,
    },
  },
  components: {
    emailFolderList,
    emailList,
    emailDetails,
    emailCompose,
  },
}
