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

export default {
  template: /* HTML */ `
    <main class="email-main">
      <email-folder-list :unreadLabels="unreadLabels" />
      <email-list
        @star="starEmail"
        @trash="removeEmail"
        v-if="emails"
        @emailSelected="doEmailSelect"
        :selectedEmail="selectedEmail"
        :emails="emails" />
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
        state: '',
        search: '', // no need to support complex text search
        isRead: undefined, // (optional property, if missing: show all)
        isStarred: undefined, // (optional property, if missing: show all)
        isRemoved: false,
        lables: [], // has any of the labels
        searchAreas: [],
      },
      unreadLabels: null,
    }
  },
  created() {
    if (!this.folderName) this.$router.push('/maily/inbox')

    this.setCriteriaState()
    this.getEmailsToShow().then(() => this.setIsCompose())

    eventBus.on('starEmail', this.starEmail)
    eventBus.on('removeEmail', this.removeEmail)
    eventBus.on('restoreEmail', this.restoreEmail)
    eventBus.on('markAsRead', this.markAsRead)
    eventBus.on('unselectEmail', this.unselectEmail)
    eventBus.on('updateLabels', this.updateLabels)
    eventBus.on('maily-advancedSearch', (criteria) => {
      this.updateCriteria(criteria)
      this.getEmailsToShow()
    })
  },
  methods: {
    setCriteriaState() {
      if (this.folderName === 'trash') this.criteria.isRemoved = true
      else {
        this.criteria.isRemoved = false
        this.criteria.state = this.folderName
      }
    },
    getUnreadLabels() {
      return emailService
        .getUnreadCounts()
        .then((counts) => (this.unreadLabels = counts))
    },
    updateCriteria(criteria) {
      criteria.state = this.criteria.state
      this.criteria = criteria
    },
    updateLabels(email, labels) {
      email.labels = labels
      emailService.save(email).then(() => {
        console.log('saved!', email.labels)
      })
    },
    doEmailSelect(email) {
      this.composeClose()
      this.selectedEmail = email
    },
    composeClose() {
      this.$router.push({ query: {} })
      this.isCompose = false
    },
    getEmailsToShow(criteria = this.criteria) {
      console.log(criteria, this.folderName)
      this.getUnreadLabels()
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
      emailService.save(email)
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
            this.getEmailsToShow().then(() => {
              updateSelectedRemovedUser()
              showSuccessMsg('Your email was successfully removed.')
            })
          })
        })
      } else {
        const e = { ...email, removedAt: Date.now() }
        emailService.save(e).then(() => {
          this.getEmailsToShow().then(() => {
            updateSelectedRemovedUser()
            showSuccessMsg('Your email was moved to the trash folder.')
          })
        })
      }
    },
    restoreEmail(email) {
      const e = { ...email, removedAt: undefined }
      emailService.save(e).then(() => {
        this.getEmailsToShow()
      })
    },
    markAsRead(email, force) {
      email.isRead = force ?? !email.isRead
      emailService.save(email)
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
  },
  watch: {
    folderName() {
      this.setCriteriaState()
      this.getEmailsToShow()
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
