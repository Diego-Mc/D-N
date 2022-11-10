import textBox from '../../../cmps/text-box.cmp.js'
import textArea from '../../../cmps/text-area.cmp.js'
import { emailService } from '../service/email.service.js'

export default {
  template: /* HTML */ `
    <section v-if="composeForm" class="email-compose round">
      <i class="close-btn f-m bi bi-x-lg"></i>
      <h2>{{composeForm.title}}</h2>
      <form @submit.prevent="save">
        <component
          v-for="(cmp, idx) in composeForm.cmps"
          :is="cmp.type"
          :info="cmp.info"
          @setVal="setAns">
        </component>
        <footer>
          <i class="delete-icon bi bi-trash f-m"></i>
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
    console.log('Created!')
    emailService.getComposeSurvey().then((composeForm) => {
      console.log(composeForm)
      this.composeForm = composeForm
    })
    this.draft = emailService.getEmptyEmail()
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
      this.draft[key] = ans
    },
    save() {
      console.log('Saving..')
      clearInterval(this.autoSaveInterval)
      emailService
        .sendEmail(this.draft)
        .then((email) => this.$emit('sentEmail', email))
    },
  },
  computed: {},
  components: {
    textBox,
    textArea,
  },
}
