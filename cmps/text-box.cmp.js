export default {
  template: `
    <section>
      <label> {{info.label}} </label>
      <input type="text" v-model="val" @input="reportVal" />
    </section>
  `,
  props: ['info', 'initialValue'],
  created() {
    console.log('HEY', this.initialValue)
  },
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
