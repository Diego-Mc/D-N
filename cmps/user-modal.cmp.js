import { eventBus } from '../services/event-bus.service.js'

export const userModal = {
  showModal,
}

export default {
  template: /* HTML */ `
    <div v-if="opts" class="modal-bg">
      <section class="modal round">
        <div className="texts">
          <h3>{{opts.question}}</h3>
          <small>{{opts.warning}}</small>
        </div>
        <div class="buttons">
          <button @click="onOpt1">{{opts.opt1}}</button>
          <button @click="onOpt2">{{opts.opt2}}</button>
        </div>
        <i @click="closeModal" class="close-btn bi bi-x-lg"></i>
      </section>
    </div>
  `,
  data() {
    return {
      opts: null,
    }
  },
  created() {
    eventBus.on('show-modal', (opts) => (this.opts = opts))
  },
  methods: {
    onOpt1() {
      eventBus.emit(this.opts.key || 'modal-res', true)
      this.closeModal()
    },
    onOpt2() {
      eventBus.emit(this.opts.key || 'modal-res', false)
      this.closeModal()
    },
    closeModal() {
      this.opts = null
    },
  },
  computed: {},
}

function showModal(opts) {
  eventBus.emit('show-modal', opts)

  let resolve
  eventBus.on('modal-res', (ans) => resolve(ans))
  return new Promise((res) => (resolve = res))
}
