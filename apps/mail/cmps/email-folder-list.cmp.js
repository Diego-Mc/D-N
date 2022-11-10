export default {
  template: /* HTML */ `
    <section class="email-folder-list f-l">
      <article class="selected">
        <i
          @click="$router.push('/maily/inbox')"
          :class="className('inbox','bi bi-inbox')"></i>
      </article>
      <article>
        <i
          @click="$router.push('/maily/sent')"
          :class="className('sent','bi bi-send')"></i>
      </article>
      <article>
        <i
          @click="$router.push('/maily/draft')"
          :class="className('draft','bi bi-folder')"></i>
      </article>
      <article>
        <i
          @click="$router.push('/maily/trash')"
          :class="className('trash','bi bi-trash')"></i>
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
      const path = this.$route.path
      if (path === '/maily') return ''
      return path.replace('/maily/', '')
    },
  },
}
