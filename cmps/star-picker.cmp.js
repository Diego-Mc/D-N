export default {
  template: /* HTML */ `
    <section class="star-picker">
      <label>{{info.label}}</label>
      <section class="stars">
        <i
          :class="className(i)"
          class="prevent"
          v-for="i in info.limit"
          :key="i"
          @click="reportVal(i)"></i>
      </section>
    </section>
  `,
  props: ['info', 'initialValue'],
  data() {
    return {
      val: this.initialValue || 0,
    }
  },
  created() {},
  methods: {
    reportVal(i) {
      this.val = i
      this.$emit('setVal', { key: this.info.key, ans: this.val })
    },
    className(i) {
      return {
        'bi bi-star': i > this.val,
        'bi bi-star-fill': i <= this.val,
      }
    },
  },
}
