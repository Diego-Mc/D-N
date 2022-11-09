import { utilService } from '../../../services/util.service.js'

export default {
  props: ['email'],
  template: /* HTML */ `
    <article @click="emailSelect" class="email-preview round">
      <img class="email-img" :src="email.imgUrl" />
      <section class="email-data">
        <small class="f-s f-clr-light">{{email.from.name}}</small>
        <h3 class="f-d f-clr-light">{{email.subject}}</h3>
      </section>
      <p class="f-s f-clr-light email-body">{{email.body}}</p>
      <small class="email-time f-s f-clr-light">{{timeStr}}</small>
    </article>
  `,
  data() {
    return {}
  },
  created() {},
  methods: {
    emailSelect() {
      this.$emit('emailSelected', this.email)
    },
  },
  computed: {
    timeStr() {
      return utilService.toTimeStr(this.email.sentAt)
    },
  },
}

//TODO: add conditional for email.from/email.to based on folder
