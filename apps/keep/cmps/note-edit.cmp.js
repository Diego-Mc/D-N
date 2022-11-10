import noteAdd from "./note-add.cmp.js"
import { eventBus } from "../../../services/event-bus.service.js"
export default {
    props:['notes'],
    template: `  
        <div class="note-editor" @clicked.stop>
            <note-add :editedNoteId="$route.params.id" :notes="notes"/>
        </div>

        <!-- <router-link to="/keepy">  -->
            <div class="screen"></div>
        <!-- </router-link> -->
       
    `,data() {
        return {
            note:null,
        }
    }
    ,created() {
        // eventBus.on('screen-click',)
        let noteId = this.$route.params.id
    },
    components: {
        noteAdd
    }
}