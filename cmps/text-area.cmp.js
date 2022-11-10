export default {
  template: `
    <section>
      <label> {{info.label}} </label>
      <textarea v-model="val" @input="reportVal"></textarea>
    </section>
  `,
  props: ['info', 'initialValue'],
  data() {
    return {
      val: this.initialValue || '',
    }
  },
  methods: {
    reportVal() {
      this.$emit('setVal', { key: this.info.key, ans: this.val })
    },
  },
}
