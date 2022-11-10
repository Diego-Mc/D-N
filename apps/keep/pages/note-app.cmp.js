import { noteService } from '../services/note.service.js'
import { eventBus } from '../../../services/event-bus.service.js'

import noteAdd from "../cmps/note-add.cmp.js"
// move to router?
import noteEdit from "../cmps/note-edit.cmp.js"
import noteFilter from "../cmps/note-filter.cmp.js"
import noteList from "../cmps/note-list.cmp.js"

export default {
    template: `
    <main @click="onClick" v-if="notes">
        <div>
            <note-filter @notes-filtered="onFilter"/>
            <note-add @add-note="addNote" :notes="notes"/>
        </div>
        <div v-if="notes"> 
            <note-list  :notes="getNotesByPinned(true)" type="PINNED"  @on-delete="deleteNote"/>
            <note-list :notes="getNotesByPinned(false)"  type="OTHERS"  @on-delete="deleteNote"/>
        </div>
        <router-view :notes="notes"></router-view>
    </main>
    `, data() {
        return {
            notes: null,
            pinnedNotes: [],
            unpinnedNotes: null,
           
            filterBy: {
                txt: '',
            }
        }
    }, created() {
        noteService.query().then(notes => this.notes = notes)
        eventBus.on('get-notes', obj => ({ notes: this.notes }))
        eventBus.on('delete-note', noteId => this.deleteNote(noteId))
        eventBus.on('note-changed', (changedNote) => noteService.save(changedNote))
        eventBus.on('todo-clicked', obj => {
            const note = obj.note
            const index = obj.index
            note.info.todos[index].checked = !note.info.todos[index].checked
            noteService.save(note).then(() => {
                const idx = this.notes.findIndex(note => note.id === note.id)
                this.notes.splice(idx, note)
            })
        })
        eventBus.on('todo-removed', obj => {
            const note = obj.note
            const index = obj.index
            note.info.todos.splice(index, 1)
            noteService.save(note).then(() => {
                const idx = this.notes.findIndex(note => note.id === note.id)
                this.notes.splice(idx, note)
            })
        })

    }, methods: {
        addNote(note) {
            this.notes.push(note)
            noteService.create(note)
        },
        onClick() {
           eventBus.emit('app-clicked')
        },
        deleteNote(noteId) {
            noteService.remove(noteId).then(noteService.query).then(notes => this.notes = notes)
        },
        onFilter(filters) {
            this.filterBy = filters
        },
        filterNotes(notes) {
            if (!notes) return
            return notes.filter(note => {
                if (note.info.title) {
                    if (note.info.title.toLowerCase().includes(this.filterBy.txt)) return true
                }
                if (note.info.txt) {
                    if (note.info.txt.toLowerCase().includes(this.filterBy.txt)) {
                        return true
                    }
                }
                return false
            })
        },
        getNotesByPinned(isPinned) {
            if (!this.notes) return
            let ha = this.notes.filter(note => {
                return note.isPinned === isPinned
            })
            return ha
        },
        sortNotes() {
            this.unpinnedNotes = this.notes.filter(note => {
                if (note.isPinned) {
                    this.pinnedNotes.push(note)
                    return false
                }
                else return true
            })
        },
        saveNote(note){
            noteService.put(note)
        },
    },
    computed: {
        getNotes() {
            return this.notes
        },
    },
    watch: {

    },
    components: {
        noteAdd,
        noteEdit,
        noteFilter,
        noteList,
    }
}