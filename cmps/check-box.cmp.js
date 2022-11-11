export default {
  template: `
    <section class="filter-section">
      <label>{{info.label}}</label>
      <section class="cards">
        <label v-for="opt in info.opts" :key="opt">
          {{opt}}
          <input :name="info.key" :value="opt" type="checkbox" v-model="val" @change="reportVal" />
        </label>
      </section>
    </section>
  `,
  props: ['info', 'initialValue'],
  data() {
    return {
      val: this.initialValue || [],
    }
  },
  methods: {
    reportVal() {
      this.$emit('setVal', { key: this.info.key, ans: this.val })
    },
  },
}
