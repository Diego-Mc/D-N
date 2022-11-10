import noteAdd from "./note-add.cmp.js"
export default {
    props:['notes'],
    template: `  
        <div class="note-editor" @clicked.stop>
            {{this.$route.params.id}}
            <note-add :editedNote="note"/>
        </div>

        <router-link to="/keepy"> 
            <div class="screen"></div>
        </router-link>
       
    `,data() {
        return {
            note:null,
        }
    }
    ,created() {
        let noteId = this.$route.params.id
        let currentNote = this.notes.pinnedNotes.find(note => note.id === noteId)
        if(!currentNote) currentNote = this.notes.unpinnedNotes.find(note => note.id === noteId)
        this.note = currentNote
    },
    components: {
        noteAdd
    }
}