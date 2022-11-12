import emailPreview from '../cmps/email-preview.cmp.js'

export default {
  props: ['emails', 'selectedEmail'],
  template: /* HTML */ `
    <section v-if="emails" class="email-list round">
      <email-preview
        @emailSelected="emailSelected"
        :class="selectedClass(email)"
        v-for="email in emails"
        :key="email.id"
        :email="email" />
    </section>
  `,
  created() {},
  methods: {
    emailSelected(email) {
      this.$emit('emailSelected', email)
    },
    selectedClass(email) {
      if (this.selectedEmail && email.id === this.selectedEmail.id)
        return 'selected'
    },
  },
  computed: {},
  components: {
    emailPreview,
  },
}
