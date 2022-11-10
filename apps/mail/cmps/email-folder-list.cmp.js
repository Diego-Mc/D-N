export default {
  template: /* HTML */ `
    <section class="email-folder-list f-l">
      <i
        @click="$router.push({query:{isCompose: true}})"
        class="compose-btn bi bi-plus-square-fill"></i>
      <hr />
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
      const route = this.$route.matched[1]
      console.log(route)
      if (!route) return ''
      return route.name
    },
  },
}
