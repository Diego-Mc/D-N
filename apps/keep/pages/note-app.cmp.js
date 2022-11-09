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
        <note-list :notes="pinnedNotes" @note-clicked="editNote"/>
        <note-list :notes="unpinnedNotes" @note-clicked="editNote"/>
    </div>
    <router-link :to="'/keepy/'+213">ad</router-link>
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
        })
    }, methods: {
        addNote(info) {
            noteService.create({ isPinned: false, info }).then(note => note.isPinned ? this.pinnedNotes.push(note) : this.unpinnedNotes.push(note))
        },
        onClick(){
            this.appClicked = !this.appClicked
        },
        editNote(noteId){

        }
    },
    components: {
        noteAdd,
        noteEdit,
        noteFilter,
        noteList,
    }
}