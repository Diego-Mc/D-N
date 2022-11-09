import { noteService } from '../services/note.service.js'

import noteAdd from "../cmps/note-add.cmp.js"
// move to router?
import noteEdit from "../cmps/note-edit.cmp.js"
import noteFilter from "../cmps/note-filter.cmp.js"
import noteList from "../cmps/note-list.cmp.js"
import notePreview from "../cmps/note-preview.cmp.js"

export default {
    template: ` 
    <note-add/>
    <note-filter/>
    <note-list v-if="notes" :notes="notes.pinned"/>
    <note-list :notes="notes.unpinned"/>
    `, data() {
        return {
            notes : null,
  
        }
    }, created() {
        noteService.query().then(notes => this.notes = notes)
    },
    components: {
        noteAdd,
        noteEdit,
        noteFilter,
        noteList,
        notePreview,
    }
}