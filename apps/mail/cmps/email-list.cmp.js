import emailPreview from '../cmps/email-preview.cmp.js'

export default {
  template: /* HTML */ `
    <section class="email-list round">
      <email-preview />
      <email-preview />
      <email-preview />
      <email-preview />
      <email-preview />
    </section>
  `,
  data() {
    return {}
  },
  created() {},
  methods: {},
  computed: {},
  components: {
    emailPreview,
  },
}
