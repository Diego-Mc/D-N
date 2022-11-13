export default {
  template: /* HTML */ `
    <i
      class="bi bi-grid-fill nav-icon"
      @click="isOpen=!isOpen"
      @mouseleave="isOpen=false">
      <section v-if="isOpen" class="nav-menu">
        <button @click="$router.push('/maily/inbox')">maily</button>
        <button @click="$router.push('/keepy')">keepy</button>
        <button @click="$router.push('/booky')">booky</button>
      </section></i
    >
  `,
  data() {
    return {
      isOpen: false,
    }
  },
  created() {},
  methods: {},
  computed: {},
}
