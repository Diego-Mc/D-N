import emailReply from '../cmps/email-reply.cmp.js'

export default {
  props: ['email'],
  template: /*HTML*/ `
    <section v-if="email" class="email-details selected round">
      <header>
        <div class="user-data">
          <img class="email-img" :src="email.imgUrl" />
          <span>
            <small class="f-m f-clr-main">{{recipient}}</small>
            <small class="f-s f-clr-light">{{email.from.email}}</small>
          </span>
        </div>
        <div class="email-tools">
          <i @click="doForward" class="bi bi-arrow-90deg-left"></i>
          <i @click="doReply" class="bi bi-reply"></i>
          <icon-toggle icon="star"/>
          <icon-toggle icon="trash"/>
        </div>
      </header>
      <main class="email-content">
        <h2>{{email.subject}}</h2>
        <p>
          {{email.body}}
        </p>
      </main>

      <!--<section v-if="email.replies" class="reply-threads">
        <email-reply v-for="reply in replies" :key="reply.id" :reply="reply">
      </section>-->

      <footer>
        <p class="signature f-s f-clr-light">
          {{email.signature || email.from.name}}
        </p>
        <small class="email-time f-s f-clr-light">{{sentAt}}</small>
      </footer>
    </section>
  `,
  data() {
    return {}
  },
  created() {},
  methods: {
    doReply() {
      this.$router.push({ query: { replyId: this.email.id, isCompose: true } })
    },
    doForward() {
      this.$router.push({
        query: { forwardId: this.email.id, isCompose: true },
      })
    },
  },
  computed: {
    recipient() {
      if (this.$route.path.includes('sent'))
        return this.email.to.name || this.email.to.email
      return this.email.from.name || this.email.from.email
    },
    sentAt() {
      return new Date(this.email.sentAt).toDateString()
    },
  },
  components: {
    emailReply,
  },
}

// TODO: use data bool to check if exists email, if not show msg, if exists show email AND render selected class for bg color

//TODO: add util to break up text to multiple paragraphs
