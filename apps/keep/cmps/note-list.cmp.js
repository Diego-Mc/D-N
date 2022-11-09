import notePreview from "../cmps/note-preview.cmp.js"

export default{
    props:['notes'],
    template:`  
        <section class="notes-list">
            <note-preview v-for="note in notes" :note="note" @note-clicked="noteClicked"/>
        </section> 
    `,created() {
    },methods: {
        noteClicked(noteId){
            this.$emit('note-clicked', noteId)
        }
    },
    components:{
        notePreview
    }
}