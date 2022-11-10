export default {
  props: ['icon', 'state'],
  template: /* HTML */ `
    <i @click="toggle" class="icon-cmp" :class="'bi bi-' + iconToShow"></i>
  `,
  data() {
    return {
      icons: {
        trash: 'trash',
        star: 'star',
        reply: 'reply',
        replyAll: 'reply-all',
        forward: 'arrow-90deg-left',
        grid: 'grid',
        send: 'send',
        inbox: 'inbox',
        pin: 'pin',
      },
      isOn: this.state || false,
      exceptions: {
        forward: 'arrow-90deg-left',
      },
    }
  },
  created() {},
  methods: {
    toggle() {
      this.isOn = !this.isOn
    },
  },
  computed: {
    iconToShow() {
      const exceptionVal = this.exceptions[this.icon]
      if (exceptionVal) return exceptionVal
      return this.icons[this.icon] + (this.isOn ? '-fill' : '')
    },
  },
}
