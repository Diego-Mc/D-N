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
            <note-add @add-note="addNote" :appClicked = "appClicked" />
        </div>
        <div v-if="unpinnedNotes "> 
            <note-list :notes="pinnedNotes" type="PINNED" @note-clicked="editNote" @on-delete="deleteNote"/>
            <note-list :notes="unpinnedNotes"  type="OTHERS" @note-clicked="editNote" @on-delete="deleteNote"/>
        </div>
        <router-view></router-view>
    </main>
    `, data() {
        return {
            pinnedNotes: [],
            unpinnedNotes: null,
            appClicked: false,
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
            console.log(notes);
        })
    }, methods: {
        addNote(note) {
            noteService.create(note).then(note => {
                // console.log(note);
                note.isPinned ? this.pinnedNotes.push(note) : this.unpinnedNotes.push(note)})
        },
        onClick() {
            this.appClicked = !this.appClicked
        },
        editNote(noteId) {

        },
        deleteNote(noteId) {
            noteService.remove(noteId).then(() => {
                this.pinnedNotes = this.pinnedNotes.filter(note => note.id !== noteId)
                this.unpinnedNotes = this.unpinnedNotes.filter(note => note.id !== noteId)
            })
        },

    },
    components: {
        noteAdd,
        noteEdit,
        noteFilter,
        noteList,
    }
}