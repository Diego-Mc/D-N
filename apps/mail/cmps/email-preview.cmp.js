import { utilService } from '../../../services/util.service.js'

export default {
  props: ['email'],
  template: /* HTML */ `
    <article @click="emailSelect" class="email-preview round">
      <img class="email-img" :src="email.imgUrl" />
      <section class="email-data">
        <small class="f-s f-clr-light">{{recipient}}</small>
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
      if (this.folderName !== 'draft') this.$emit('emailSelected', this.email)
      else {
        const { to, subject, body, signature } = this.email
        this.$router.push({
          query: { isCompose: true, to: to.email, subject, body, signature },
        })
      }
    },
  },
  computed: {
    folderName() {
      const route = this.$route.matched[1]
      // if (!route) return ''
      return route.name
    },
    timeStr() {
      return utilService.toTimeStr(this.email.sentAt)
    },
    recipient() {
      if (this.$route.path.includes('sent'))
        return this.email.to.name || this.email.to.email
      return this.email.from.name || this.email.from.email
    },
  },
}

//TODO: add conditional for email.from/email.to based on folder
