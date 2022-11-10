export default {
  props: ['email'],
  template: /*HTML*/ `
    <section v-if="email" class="email-details selected round">
      <header>
        <div className="user-data">
          <img class="email-img" :src="email.imgUrl" />
          <span>
            <small class="f-m f-clr-main">{{recipient}}</small>
            <small class="f-s f-clr-light">{{email.from.email}}</small>
          </span>
        </div>
        <div class="email-tools">
          <i class="bi bi-arrow-90deg-left"></i>
          <i class="bi bi-reply"></i>
          <i class="bi bi-reply-all"></i>
          <icon-toggle icon="star"/>
          <icon-toggle icon="trash"/>
        </div>
      </header>
      <main>
        <h2>{{email.subject}}</h2>
        <p>
          {{email.body}}
        </p>
      </main>
      <footer>
        <p class="signature">
          {{email.signature || email.from.name}}
        </p>
        <small className="email-time f-s f-clr-light">{{email.sentAt}}</small>
      </footer>
    </section>
  `,
  data() {
    return {}
  },
  created() {},
  methods: {},
  computed: {
    recipient() {
      if (this.$route.path.includes('sent'))
        return this.email.to.name || this.email.to.email
      return this.email.from.name || this.email.from.email
    },
  },
}

// TODO: use data bool to check if exists email, if not show msg, if exists show email AND render selected class for bg color

//TODO: add util to break up text to multiple paragraphs
