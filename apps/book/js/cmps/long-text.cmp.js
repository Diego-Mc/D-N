export default {
  props: ['txt'],
  template: `
        <p class="long-text">{{ showDesc }}

            <p class="long-text-btn" @click="changeDesc">{{ btnTxt }}</p>
        </p>
    `,
  data() {
    return {
      isMore: false,
    }
  },
  methods: {
    changeDesc() {
      this.isMore = !this.isMore
    },
  },
  computed: {
    showDesc() {
      if (this.isMore) {
        return this.txt + '.'
      }
      let dots = this.txt.length < 100 ? '.' : '...'
      return this.txt.slice(0, 100) + dots
    },
    btnTxt() {
      return this.isMore ? 'Less' : 'More'
    },
  },
}
