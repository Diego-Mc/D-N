import { utilService } from '../../../services/util.service.js'

export default {
  props: ['email'],
  template: /* HTML */ `
    <article
      @click="emailSelect"
      :class="{reply: isReply}"
      class="email-preview round">
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
    return {
      isReply: false,
    }
  },
  created() {
    this.setReply()
  },
  methods: {
    emailSelect() {
      if (this.folderName !== 'draft') this.$emit('emailSelected', this.email)
      else {
        this.$router.push({
          query: { isCompose: true, id: this.email.id },
        })
      }
    },
    setReply() {
      if (this.$route.query.replyId === this.email.id) this.isReply = true
      else this.isReply = false
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
  watch: {
    '$route.query': {
      handler() {
        this.setReply()
      },
      deep: true,
    },
  },
}

//TODO: add conditional for email.from/email.to based on folder
