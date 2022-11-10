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
          @setVal="setAns($event, idx)">
        </component>
        <footer>
          <i class="delete-icon bi bi-trash f-m"></i>
          <button>Send</button>
        </footer>
      </form>
    </section>
  `,
  data() {
    return {
      composeForm: null,
      answers: [],
    }
  },
  created() {
    console.log('Created!')
    emailService.getComposeSurvey().then((composeForm) => {
      console.log(composeForm)
      this.composeForm = composeForm

      this.answers = new Array(this.composeForm.cmps.length)
    })
  },
  methods: {
    setAns(ans, idx) {
      console.log('Setting the answer: ', ans, 'idx:', idx)
      // this.answers[idx] = ans
      this.answers.splice(idx, 1, ans)
    },
    save() {
      console.log('Saving..')
    },
  },
  computed: {},
  components: {
    textBox,
    textArea,
  },
}
