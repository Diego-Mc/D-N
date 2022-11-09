import notePreview from "../cmps/note-preview.cmp.js"

export default {
    props: ['notes', 'type'],
    template: `  
        <h6 style="margin-bottom:10px;">{{type}}</h6>
        <section class="notes-list">
            <note-preview v-for="note in notes" :note="note" @note-clicked="noteClicked" @on-delete="onDelete"/>
        </section> 
    `, created() {
    },
    emits: {
        onDelete: null,
        noteClicked: null,

    },
    methods: {
        noteClicked(noteId) {
            this.$emit('note-clicked', noteId)
        },
        onDelete(noteId) {
            this.$emit('on-delete', noteId)
        }
    },
    components: {
        notePreview,
    }
}