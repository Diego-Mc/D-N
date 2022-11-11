export default {
  template: `
    <section class="filter-section">
      <label>{{info.label}}</label>
      <section class="cards">
        <label v-for="opt in info.opts" :key="opt">
          {{opt}}
          <input :value="opt" :name="info.key" type="checkbox" v-model="val" @change="reportVal(val)" />
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
      if (this.val.length > 1) {
        if (this.val[0] === this.val[1]) this.val = []
        else this.val = [this.val[1]]
      }
      this.$emit('setVal', { key: this.info.key, ans: this.val })
    },
  },
}
