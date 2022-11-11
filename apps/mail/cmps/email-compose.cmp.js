import textBox from '../../../cmps/text-box.cmp.js'
import textArea from '../../../cmps/text-area.cmp.js'
import { emailService } from '../service/email.service.js'
import { eventBus } from '../../../services/event-bus.service.js'

export default {
  template: /* HTML */ `
    <section v-if="composeForm" class="email-compose round">
      <i @click="closeCompose" class="close-btn f-m bi bi-x-lg"></i>
      <h2>{{composeForm.title}}</h2>
      <form @submit.prevent="save" v-if="draft" :key="JSON.stringify(draft.id)">
        <component
          v-for="(cmp, idx) in composeForm.cmps"
          :is="cmp.type"
          :info="cmp.info"
          :initialValue="formInitialValue(cmp.info.key)"
          :key="cmp.info.key"
          @setVal="setAns">
        </component>
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
    }
  },
  created() {
    emailService.getComposeSurvey().then((composeForm) => {
      console.log(composeForm)
      this.composeForm = composeForm
    })

    this.setDraft()

    this.autoSaveInterval = setInterval(
      () => emailService.saveDraft(this.draft),
      5000
    )
  },
  unmounted() {
    //TODO: distinguish if already sent and not a draft anymore, maybe using state?
    emailService.saveDraft(this.draft)
    clearInterval(this.autoSaveInterval)
    const validity = emailService.checkValidity(this.draft)
    if (!validity.isValid) emailService.remove(this.draft.id)
  },
  methods: {
    setAns({ key, ans }) {
      if (key === 'to') this.draft.to.email = ans
      else this.draft[key] = ans
    },
    setDraft() {
      const emptyDraft = emailService.getEmptyEmail()
      const params = this.$route.query
      if (params.id) {
        emailService
          .get(params.id)
          .then((draft) => (this.draft = draft))
          .catch(() => {
            delete params.id
            this.draft = emptyDraft
          })
      } else this.draft = emptyDraft
    },
    save() {
      const validity = emailService.checkValidity(this.draft)

      if (validity.isValid) {
        emailService.sendEmail(this.draft).then(() => this.closeCompose())
      } else {
        eventBus.emit('show-msg', { txt: 'Please add ' + validity.missing })
      }
    },
    closeCompose() {
      this.$emit('closeCompose')
    },
    formInitialValue(key) {
      if (key === 'to') return this.draft.to.email
      return this.draft[key]
    },
  },
  computed: {},
  watch: {
    '$route.query': {
      handler() {
        console.log('WATCHING!')
        this.draft = null
        this.setDraft()
      },
      deep: true,
    },
  },
  components: {
    textBox,
    textArea,
  },
}
