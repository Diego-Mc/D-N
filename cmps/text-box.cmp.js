export default {
  template: `
    <section>
      <label> {{info.label}} </label>
      <input :type="inputType" v-model="val" @input="reportVal" />
    </section>
  `,
  props: ['info', 'initialValue', 'type'],
  data() {
    return {
      val: this.initialValue || '',
      inputType: this.type || 'text',
    }
  },
  methods: {
    reportVal() {
      this.$emit('setVal', { key: this.info.key, ans: this.val })
    },
  },
}
