import textBox from '../../../cmps/text-box.cmp.js'
import textArea from '../../../cmps/text-area.cmp.js'
import { emailService } from '../service/email.service.js'
import { eventBus } from '../../../services/event-bus.service.js'

export default {
  template: /* HTML */ `
    <section v-if="composeForm" class="email-compose round">
      <i @click="closeCompose" class="close-btn f-m bi bi-x-lg"></i>
      <h2>{{composeForm.title}}</h2>
      <form @submit.prevent="save">
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
      draft: {},
      autoSaveInterval: 0,
    }
  },
  created() {
    console.log('FORCEDDDD!!!!')
    emailService.getComposeSurvey().then((composeForm) => {
      console.log(composeForm)
      this.composeForm = composeForm
    })
    const draft = emailService.getEmptyEmail()

    const params = this.$route.query
    console.log(params, this.draft)
    if (params) {
      draft.to.email = draft.to.email || params.to
      draft.subject = draft.subject || params.subject
      draft.body = draft.body || params.body
      draft.signature = draft.signature || params.signature
    }

    this.draft = draft

    this.autoSaveInterval = setInterval(
      () => emailService.saveDraft(this.draft),
      5000
    )
  },
  unmounted() {
    clearInterval(this.autoSaveInterval)
    const validity = emailService.checkValidity(this.draft)
    if (!validity.isValid) emailService.remove(this.draft.id)
  },
  methods: {
    setAns({ key, ans }) {
      if (key === 'to') this.draft.to.email = ans
      else this.draft[key] = ans
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
      },
      deep: true,
    },
  },
  components: {
    textBox,
    textArea,
  },
}
