import { eventBus } from '../../../services/event-bus.service.js'
import noteColors from './note-colors.cmp.js'
import noteTags from './note-tags.cmp.js'

export default {
    props:['note-id'],
    template: `
        <div class="preview-icons-container" @click.stop.prevent @mouseleave=""> 
            <router-link :to="'/keepy/' + noteId"><i class="bi bi-pencil-square"></i></router-link>
            <i @click.prevent="onDelete" class='bi bi-trash'></i>
            <note-colors :noteId="noteId"/>
            <!-- <note-tags/> -->
            <i @click="onDuplicate" class="bi bi-file-plus"></i>
            <i class="bi bi-envelope-paper"></i>    
        </div>
    `, 

    methods: {
        onDelete() {
            eventBus.emit('delete-note', this.noteId)
        },onDuplicate(){
            eventBus.emit('on-duplicate', this.noteId)
        }
    },
    components: {
        noteColors,
        noteTags,
    }
}