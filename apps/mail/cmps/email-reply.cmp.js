export default {
  props: ['reply'],
  template: /* HTML */ `
    <header>
      <div class="user-data">
        <img class="email-img" :src="reply.imgUrl" />
        <span>
          <small class="f-m f-clr-main">{{recipient}}</small>
          <small class="f-s f-clr-light">{{reply.from.email}}</small>
        </span>
      </div>
      <small class="email-time f-s f-clr-light">{{sentAt}}</small>
    </header>
    <main class="email-content">
      <h2>{{reply.subject}}</h2>
      <p>{{reply.body}}</p>
    </main>
  `,
  data() {
    return {}
  },
  created() {},
  methods: {},
  computed: {},
}
