import {eventBus} from '../../../services/event-bus.service.js'

export default {
    template: `
        <div class="note-icons-container" style="position:relative;">  
            <div class="upload-img-container">
                <input type="file" accept="image/jpeg/png" @change='uploadImage' class="upload-img-input"/>
                <i class="bi bi-image"></i>
            </div> 
            <div class="change-color-container">
                <i class="bi bi-palette" @click="toggleColors"></i> 
                <div class="colors-container" v-if="isShowColors">
                    <button @click="colorClicked('white')" class="note-white"></button>
                    <button @click="colorClicked('blue')" class="note-blue"></button>
                    <button @click="colorClicked('pink')" class="note-pink"></button>
                    <button @click="colorClicked('red')" class="note-red"></button>
                    <button @click="colorClicked('purple')" class="note-purple"></button>
                    <button @click="colorClicked('yellow')" class="note-yellow"></button>
                    <button @click="colorClicked('turquoise')" class="note-turquoise"></button>
                    <button @click="colorClicked('green')" class="note-green"></button>
                </div>
            </div>
            <i class="bi bi-envelope"></i>
            <i class="bi bi-three-dots-vertical"></i>
        </div>
    `,data() {
        return {
            isShowColors:false,
        }
    },
    methods: {
        colorClicked(color){
            eventBus.emit('update-note',{prop:'color',val: color})
        },
        toggleColors(){
            this.isShowColors = !this.isShowColors
        }
    }
}