import { eventBus } from '../../../services/event-bus.service.js'

export default {
    props: ['noteId'],
    template: `
    <div class="change-color-container" @click.prevent >
    <i class="bi bi-palette" @click="toggleColors"></i> 
    <div class="colors-container" v-if="isShowColors" >
        <button @click="colorClicked('white')" class="note-white"></button>
        <button @click="colorClicked('blue')" class="note-blue"></button>
        <button @click="colorClicked('pink')" class="note-pink"></button>
        <button @click="colorClicked('red')" class="note-red"></button>
        <button @click="colorClicked('purple')" class="note-purple"></button>
        <button @click="colorClicked('yellow')" class="note-yellow"></button>
        <button @click="colorClicked('turquoise')" class="note-turquoise"></button>
        <button @click="colorClicked('green')" class="note-green"></button>
    </div>
</div>`,
    data() {
        return {
            isShowColors: false,
        }
    },
    methods: {
        colorClicked(color) {
            const id = this.noteId || ''
            eventBus.emit(`update-note-${id}`, { prop: 'color', val: color, id: this.noteId })
        },
        toggleColors() {
            this.isShowColors = !this.isShowColors
        }
    },
}