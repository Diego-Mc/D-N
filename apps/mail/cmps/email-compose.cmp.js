import textBox from '../../../cmps/text-box.cmp.js'
import textArea from '../../../cmps/text-area.cmp.js'
import { emailService } from '../service/email.service.js'
import { eventBus } from '../../../services/event-bus.service.js'

export default {
  template: /* HTML */ `
    <section class="email-compose round">
      <i @click="closeCompose" class="close-btn f-m bi bi-x-lg"></i>
      <h2 v-if="composeForm">{{formTitle}}</h2>
      <form
        @submit.prevent="save"
        v-if="composeForm"
        :key="JSON.stringify(draft.id)">
        <component
          v-for="(cmp, idx) in composeForm.cmps"
          :is="cmp.type"
          :info="cmp.info"
          :initialValue="formInitialValue(cmp.info.key)"
          :key="cmp.info.key"
          @setVal="setAns">
        </component>
        <section v-if="replyId"></section>
        <footer>
          <i class="trash-btn bi bi-trash f-m"></i>
          <small class="f-clr-light">auto save is on</small>
          <button>Send</button>
        </footer>
      </form>
    </section>
  `,
  data() {
    return {
      composeForm: null,
      draft: null,
      autoSaveInterval: 0,
      replyId: null,
      forwardId: null,
    }
  },
  created() {
    this.composeForm = null
    this.draft = null
    this.autoSaveInterval = 0
    this.replyId = null
    this.forwardId = null
    this.initializeDraft()
  },
  unmounted() {
    //TODO: distinguish if already sent and not a draft anymore, maybe using state?
    clearInterval(this.autoSaveInterval)
  },
  methods: {
    initializeDraft() {
      const query = this.$route.query
      console.log('DSFDSGD', query)
      if (query.replyId) this.replyId = query.replyId
      if (query.forwardId) this.forwardId = query.forwardId

      this.setDraft()
        .then(() => {
          if (!this.forwardId) return Promise.resolve()
          return emailService.get(this.forwardId).then(({ subject, body }) => {
            this.draft.subject = 'FW: ' + subject
            this.draft.body = body
          })
        })
        .then(() => {
          if (!this.replyId) return Promise.resolve()
          return emailService
            .get(this.replyId)
            .then(({ from: { email }, subject }) => {
              this.draft.to.email = email
              this.draft.subject = 'RE: ' + subject

              const replies = this.draft.replies
              if (replies) {
                if (!replies.includes(this.replyId)) replies.push(this.replyId)
              } else this.draft.replies = [this.replyId]
            })
        })
        .then(() => {
          console.log('COMPOSEEEEEE')
          return Promise.resolve(
            (this.composeForm = emailService.getComposeSurvey())
          )
        })
        .then(() => {
          emailService.saveDraft(this.draft)
          this.autoSaveInterval = setInterval(
            () => emailService.saveDraft(this.draft),
            5000
          )
        })
    },
    setAns({ key, ans }) {
      if (key === 'to') this.draft.to.email = ans
      else this.draft[key] = ans
    },
    setDraft() {
      const emptyDraft = emailService.getEmptyEmail()
      const params = this.$route.query

      if (!params.id) {
        this.draft = emptyDraft
        return Promise.resolve()
      }

      return emailService
        .get(params.id)
        .then((draft) => (this.draft = draft))
        .catch(() => {
          delete params.id
          this.draft = emptyDraft
        })
    },
    save() {
      const validity = emailService.checkValidity(this.draft)

      if (validity.isValid) {
        emailService.sendEmail(this.draft).then(() => this.closeCompose())
      } else {
        eventBus.emit('show-msg', { txt: 'Please add ' + validity.missing })
      }
    },
    close() {
      emailService.saveDraft(this.draft)
      this.closeCompose()
    },
    closeCompose() {
      this.$emit('closeCompose')
    },
    formInitialValue(key) {
      console.log('HEYYYY', key, this.draft[key])
      if (key === 'to') return this.draft.to.email
      return this.draft[key]
    },
  },
  computed: {
    formTitle() {
      if (this.replyId) return 'New Reply'
      else if (this.forwardId) return 'Forward'
      else return 'New Message'
    },
  },
  watch: {
    '$route.query': {
      handler() {
        this.initializeDraft()
      },
    },
  },
  components: {
    textBox,
    textArea,
  },
}
