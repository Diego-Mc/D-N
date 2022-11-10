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
            <note-filter @notes-filtered="onFilter"/>
            <note-add @add-note="addNote" :appClicked = "appClicked" />
        </div>
        <div v-if="unpinnedNotes "> 
            <note-list :notes="filterNotes(pinnedNotes)" type="PINNED" @note-clicked="editNote" @on-delete="deleteNote"/>
            <note-list :notes="filterNotes(unpinnedNotes)"  type="OTHERS" @note-clicked="editNote" @on-delete="deleteNote"/>
        </div>
        <router-view v-if="unpinnedNotes" :notes="{pinnedNotes,unpinnedNotes}"></router-view>
    </main>
    `, data() {
        return {
            pinnedNotes: [],
            unpinnedNotes: null,
            appClicked: false,
            filterBy: {
                txt: '',
            }
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
        addNote(note) {
            noteService.create(note).then(note => note.isPinned ? this.pinnedNotes.push(note) : this.unpinnedNotes.push(note))
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
        onFilter(filters) {
            this.filterBy = filters
        },
        filterNotes(notes) {
            return notes.filter(note => {
                if (note.info.title) {
                    if (note.info.title.toLowerCase().includes(this.filterBy.txt)) return true
                }
                if (note.info.txt) {
                    if (note.info.txt.toLowerCase().includes(this.filterBy.txt)){
                         return true
                        }
                }
                return false
            })
        }

    },
    components: {
        noteAdd,
        noteEdit,
        noteFilter,
        noteList,
    }
}