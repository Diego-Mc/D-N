import { noteService } from '../services/note.service.js'

import noteAdd from "../cmps/note-add.cmp.js"
// move to router?
import noteEdit from "../cmps/note-edit.cmp.js"
import noteFilter from "../cmps/note-filter.cmp.js"
import noteList from "../cmps/note-list.cmp.js"

export default {
    template: `
    <main @click="onClick" >
    <div>
        <note-filter/>
        <note-add @add-note="addNote"/>
    </div>
    <div v-if="unpinnedNotes "> 
        <note-list :notes="pinnedNotes" :clicked = "outsizeAddClick"/>
        <note-list :notes="unpinnedNotes"/>
    </div>
       
    </main>
    
    `, data() {
        return {
            pinnedNotes: [],
            unpinnedNotes: null,
            outsizeAddClick: false,

        }
    }, created() {
        noteService.query().then(notes => {
            this.unpinnedNotes = notes.filter(note => {
                if (note.isPinned) {
                    this.pinnedNotes.push(note)
                    return false
                }
                else return true

            })
        })
    }, methods: {
        addNote(info) {
            noteService.create({isPinned:false,info})
        }
    },
    components: {
        noteAdd,
        noteEdit,
        noteFilter,
        noteList,
    }
}