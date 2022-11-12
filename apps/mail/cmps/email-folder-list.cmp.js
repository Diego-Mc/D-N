import userLabel from '../../../cmps/user-label.cmp.js'

export default {
  props: ['unreadLabels'],
  template: /* HTML */ `
    <section class="email-folder-list f-l">
      <i
        @click="$router.push({query:{isCompose: true}})"
        class="compose-btn bi bi-plus-square-fill prevent"
        title="Compose"></i>
      <hr />
      <article @click="$router.push('/maily/inbox')">
        <i :class="className('inbox','bi bi-inbox')" title="Inbox"></i>
        <user-label
          v-if="unreadLabels?.inbox > 0"
          :label="unreadLabels.inbox" />
      </article>
      <article @click="$router.push('/maily/sent')">
        <i :class="className('sent','bi bi-send')" title="Sent"></i>
        <user-label v-if="unreadLabels?.sent > 0" :label="unreadLabels.sent" />
      </article>
      <article @click="$router.push('/maily/draft')">
        <i :class="className('draft','bi bi-folder')" title="Draft"></i>
        <user-label
          v-if="unreadLabels?.draft > 0"
          :label="unreadLabels.draft" />
      </article>
      <article @click="$router.push('/maily/trash')">
        <i :class="className('trash','bi bi-trash')" title="Trash"></i>
        <user-label
          v-if="unreadLabels?.trash > 0"
          :label="unreadLabels.trash" />
      </article>
    </section>
  `,
  data() {
    return {}
  },
  created() {},
  methods: {
    className(name, classStr) {
      const start = `bi bi-${classStr}`
      return start + (name === this.folderName ? '-fill selected' : '')
    },
  },
  computed: {
    folderName() {
      const route = this.$route.matched[1]
      console.log(route)
      if (!route) return ''
      return route.name
    },
  },
  components: {
    userLabel,
  },
}
