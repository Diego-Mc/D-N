import noteAdd from "./note-add.cmp.js"
export default {
    props: ['notes','renderedEditors'],
    template: `  
        <div class="note-editor" @clicked.stop>
            <note-add :editedNoteId="$route.params.id" :notes="notes" :renderedEditors="renderedEditors"/>
        </div>

        <!-- <router-link to="/keepy">  -->
            <div class="screen"></div>
        <!-- </router-link> -->
       
    `, data() {
        return {
            note: null,
        }
    }
    , created() {
    },
    methods: {

    },
    components: {
        noteAdd
    }
}