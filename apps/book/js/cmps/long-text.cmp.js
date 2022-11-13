export default {
  props: ['txt'],
  template: `
        <p class="long-text">{{ showDesc }}
            <p v-if="isLong" class="long-text-btn" @click="changeDesc">{{ btnTxt }}</p>
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
        return this.txt
      }
      return this.txt.slice(0, 100) + '...'
    },
    btnTxt() {
      return this.isMore ? 'Less' : 'More'
    },
    isLong() {
      return this.txt.length > 100
    },
  },
  created() {
    console.log(this.txt)
  },
}
