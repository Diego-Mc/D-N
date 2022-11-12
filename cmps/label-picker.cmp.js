import userLabel from './user-label.cmp.js'

export default {
  props: ['labels', 'emailLabels'],
  template: /* HTML */ `
    <section class="label-picker" v-if="opts">
      <user-label
        @click.stop="addAns(label.txt)"
        v-for="label in opts"
        :class="{selected: emailLabels.includes(label.txt)}"
        :key="label.txt"
        :label="label.txt" />
    </section>
  `,
  data() {
    return {
      opts: this.labels,
      ans: this.emailLabels || [],
    }
  },
  created() {
    console.log(this.emailLabels)
  },
  methods: {
    addAns(labelText) {
      const idx = this.ans.indexOf(labelText)
      if (idx >= 0) this.ans.splice(idx, 1)
      else this.ans.push(labelText)
      this.$emit('updateLabels', this.ans)
    },
  },
  computed: {},
  components: {
    userLabel,
  },
}
