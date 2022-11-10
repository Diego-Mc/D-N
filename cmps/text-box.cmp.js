export default {
  template: `
    <section>
      <label> {{info.label}} </label>
      <input type="text" v-model="val" @input="reportVal" />
    </section>
  `,
  props: ['info'],
  data() {
    return {
      val: '',
    }
  },
  methods: {
    reportVal() {
      this.$emit('setVal', { key: this.info.key, ans: this.val })
    },
  },
}
