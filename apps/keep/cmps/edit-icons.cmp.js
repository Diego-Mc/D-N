import { eventBus } from '../../../services/event-bus.service.js'
import userMsg from '../../../cmps/user-msg.cmp.js'
import noteColors from './note-colors.cmp.js'
export default {
    props: ['note-id'],
    template: `
        <div class="note-icons-container" > 
            <i @click="onDelete" class='bi bi-trash' title="Delete Media"></i>
            <div v-if="!noteId" class="upload-img-container">
                <input type="file" accept="image/jpeg/png" @change='uploadImage' class="upload-img-input"/>
                <i class="bi bi-image" title="Upload Img"></i>
            </div> 
            <note-colors :note-id="noteId"/>
            <i v-if="noteId" @click="noteToMail" class="bi bi-envelope" title="Mail Note"></i>
            <i @click="listClicked" class="bi bi-list-task" title="Add List"></i>
            <i v-if="!noteId" @click="canvasClicked" class="bi bi-pencil" title="Draw"></i>
            <i v-if="!noteId" @click="mapIconClicked" class="bi bi-geo-alt" title="Add Map"></i>
            <i @click="audioClicked" class="bi bi-volume-up" title="Add Volume"></i>
            <!-- <i @click="labelsIconClicked" class="bi bi-bookmarks"></i> -->

        </div>
    `,
    created() {
    },
    methods: {
        labelsIconClicked(){
            eventBus.emit(`labelsIconClicked`, this.noteId)
        },
        listClicked() {
            const id = this.noteId || ''
            eventBus.emit(`list-clicked-${id}`, this.noteId)
        },
        canvasClicked() {
            const id = this.noteId || ''
            eventBus.emit(`canvas-clicked-${id}`, 'noteCanvas')
        },
        mapIconClicked() {
            this.getPosition()
                .then((pos) => {
                    const id = this.noteId || ''
                    eventBus.emit(`map-icon-clicked-${id}`, { mediaType: 'noteMap', pos: pos })
                })

        },
        audioClicked() {
            const id = this.noteId || ''
            eventBus.emit(`audio-clicked-${id}`, this.noteId)
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
        noteToMail() {
            eventBus.emit('onNoteMailed',this.noteId)
        },
        onDelete() {
            eventBus.emit('delete-note', this.noteId)
            eventBus.emit('show-msg', { txt: 'Note Delete' })

        },
        getPosition() {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject)
            })
        },
    }, components: {
        noteColors,
        userMsg
    }
}