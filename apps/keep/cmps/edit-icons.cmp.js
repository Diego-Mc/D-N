import { eventBus } from '../../../services/event-bus.service.js'

export default {
    props: ['note-id','bin'],
    template: `
        <div class="note-icons-container" > 
            <i v-if="bin" @click="onDelete" class='bi bi-trash'></i>
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
            <i @click="listClicked" class="bi bi-list-task"></i>
            <i @click="canvasClicked" class="bi bi-pencil"></i>
            <i @click="mapIconClicked" class="bi bi-geo-alt"></i>
            <i class="bi bi-three-dots-vertical"></i>

        </div>
    `, data() {
        return {
            isShowColors: false,
        }
    },
    methods: {
        colorClicked(color) {
            const id = this.noteId || ''
            eventBus.emit(`update-note-${id}`, { prop: 'color', val: color, id: this.noteId })
        },
        listClicked(){
            eventBus.emit(`list-clicked`, this.noteId)
        },
       canvasClicked(){
            const id = this.noteId || ''
            eventBus.emit(`canvas-clicked-${id}`, 'noteCanvas')
        },
        mapIconClicked(){
            this.getPosition()
                .then((pos)=>{
                    const id = this.noteId || ''
                    eventBus.emit(`map-icon-clicked-${id}`, {mediaType:'noteMap',pos:pos})
                })
            
        },
        toggleColors() {
            this.isShowColors = !this.isShowColors
        },
        uploadImage(e) {
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {
                this.previewImage = e.target.result;
                const id = this.noteId || ''
                eventBus.emit(`update-note-${id}`, {
                    prop: 'mediaUrl', val: this.previewImage
                    , id: this.noteId
                })
            };
        },
        onDelete() {
            eventBus.emit('delete-note', this.noteId)
        },
        getPosition() {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject)
            })
        },
    }
}