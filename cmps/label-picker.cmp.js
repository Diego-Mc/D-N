import userLabel from './user-label.cmp.js'

export default {
  props: ['labels'],
  template: /* HTML */ `
    <section class="label-picker" v-if="opts">
      <user-label
        @click="addAns(label.txt)"
        v-for="label in opts"
        :key="label.txt"
        :label="label.txt" />
    </section>
  `,
  data() {
    return {
      opts: this.labels,
      ans: [],
    }
  },
  created() {
    this.opts = [
      { txt: 'heelo' },
      { txt: 'relationship' },
      { txt: 'heelo' },
      { txt: 'relationship' },
      { txt: 'heelo' },
      { txt: 'relationship' },
    ]
  },
  methods: {
    addAns(labelText) {
      const idx = ans.indexOf(labelText)
      if (idx >= 0) ans.splice(idx, 1)
      else ans.push(labelText)
    },
    closeModal() {
      this.opts = null
    },
  },
  computed: {},
  components: {
    userLabel,
  },
}
