import { eventBus } from '../../../services/event-bus.service.js'
import { showSuccessMsg } from '../../../services/event-bus.service.js'
import noteColors from './note-colors.cmp.js'
import noteTags from './note-tags.cmp.js'

export default {
    props:['note-id'],
    template: `
            <i @click.prevent="onDelete" class="preview-trash-icon bi bi-trash" style="" title="Delete Note"></i>
                <div class="preview-icons-container" @click.stop.prevent @mouseleave=""> 
            <!-- <router-link :to="'/keepy/' + noteId"><i class="bi bi-pencil-square"></i></router-link> -->
            <i @click="onDuplicate" class="bi bi-file-plus" style="
            position:absolute;
            right:16px"
            title="Duplicate Note"
            ></i>
        </div>
    `, 

    methods: {
        onDelete() {
          showSuccessMsg('Note Deleted')
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