import noteAdd from "./note-add.cmp.js"
export default {
    props: ['notes','renderedEditors'],
    template: `  
        <div class="note-editor" @clicked.stop>
            <note-add :editedNoteId="$route.params.id" :notes="notes" :clicked="clicked" :renderedEditors="renderedEditors"/>
        </div>
        
        <div class="screen" @click="screenClicked"></div>

       
    `, data() {
        return {
            note: null,
            clicked:false
        }
    }
    , created() {
    },
    methods: {
        screenClicked(){
            this.$router.push('/keepy')
        }
    },
    components: {
        noteAdd
    }
}