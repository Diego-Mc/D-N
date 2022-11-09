export default {
  props: ['email'],
  template: /*HTML*/ `
    <section v-if="email" class="email-details selected round">
      <header>
        <div className="user-data">
          <img class="email-img" :src="email.imgUrl" />
          <span>
            <small class="f-m f-clr-main">{{email.from.name}}</small>
            <small class="f-s f-clr-light">{{email.from.email}}</small>
          </span>
        </div>
        <div class="email-tools">
          <i class="bi bi-arrow-90deg-left"></i>
          <i class="bi bi-reply"></i>
          <i class="bi bi-reply-all"></i>
          <i class="bi bi-star"></i>
          <i class="bi bi-trash"></i>
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
  computed: {},
}

// TODO: use data bool to check if exists email, if not show msg, if exists show email AND render selected class for bg color

//TODO: add util to break up text to multiple paragraphs
