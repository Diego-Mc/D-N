import notePreview from "../cmps/note-preview.cmp.js"

export default{
    props:['notes'],
    template:`  
        <section class="notes-list">
            <note-preview v-for="note in notes" :note="note"/>
        </section> 
    `,created() {
    },
    components:{
        notePreview
    }
}