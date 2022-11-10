export default {
  template: `
    <section>
      <label> {{info.label}} </label>
      <textarea v-model="val" @change="reportVal"></textarea>
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
