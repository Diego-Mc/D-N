export default {
  template: `
    <section>
      <label> {{info.label}} </label>
      <input type="text" v-model="val" @change="reportVal" />
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
      this.$emit('setVal', this.val)
    },
  },
}
