import { eventBus } from "../services/event-bus.service.js"

export default {
    template: `
    <div v-if="msg.txt" class="user-msg" :class="msg.type" >
        <button @click="msg.txt = ''">X</button>
        <h3>{{msg.txt}}</h3>
    </div>

    `,
    data() {
        return {
            msg: { txt: '', type: 'success' },
        }
    },
    created() {
        eventBus.on('user-msg', this.showMsg)
    },
    methods: {
        showMsg(payload) {
            this.msg = payload
            setTimeout(() => this.msg.txt = '', this.msg.timeout || 2000)
        }
    },
}