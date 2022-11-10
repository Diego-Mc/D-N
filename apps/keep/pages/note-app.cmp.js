import { noteService } from '../services/note.service.js'
import { eventBus } from '../../../services/event-bus.service.js'

import noteAdd from "../cmps/note-add.cmp.js"
// move to router?
import noteEdit from "../cmps/note-edit.cmp.js"
import noteFilter from "../cmps/note-filter.cmp.js"
import noteList from "../cmps/note-list.cmp.js"

export default {
    template: `
    <main @click="onClick">
        <div >
            <note-filter @notes-filtered="onFilter"/>
            <note-add @add-note="addNote" :appClicked = "appClicked" :notes="{pinnedNotes:pinnedNotes,unpinnedNotes:unpinnedNotes}"/>
        </div>
        <div> 
            <!-- @note-clicked="editNote" -->
            <note-list v-if="pinnedNotes.length":notes="filterNotes(pinnedNotes)" type="PINNED"  @on-delete="deleteNote"/>
            <note-list v-if="unpinnedNotes" :notes="filterNotes(unpinnedNotes)"  type="OTHERS"  @on-delete="deleteNote"/>
        </div>
        <router-view :notes="{pinnedNotes,unpinnedNotes}"></router-view>
    </main>
    `, data() {
        return {
            notes: null,
            pinnedNotes: [],
            unpinnedNotes: null,
            appClicked: false,
            filterBy: {
                txt: '',
            }
        }
    }, created() {
        noteService.query().then(notes => this.notes = notes)

        eventBus.on('get-notes', obj => obj.val = { pinnedNotes: this.pinnedNotes, unpinnedNotes: this.unpinnedNotes })
        eventBus.on('delete-note', noteId => this.deleteNote(noteId))
        eventBus.on('note-changed', (changedNote) => {
            noteService.save(changedNote).then(() => {
                let idx = this.pinnedNotes.findIndex(note => note.id === changedNote.id)
                if (idx < 0) {
                    idx = this.unpinnedNotes.findIndex(note => note.id === changedNote.id)
                    this.unpinnedNotes.splice(idx, 1)
                    this.pinnedNotes.push(changedNote)
                } else {
                    this.pinnedNotes.splice(idx, 1)
                    this.unpinnedNotes.push(changedNote)
                }
            })

        })
        eventBus.on('todo-clicked', obj => {
            const note = obj.note
            const index = obj.index
            note.info.todos[index].checked = !note.info.todos[index].checked
            noteService.save(note).then(() => {
                const idx = this.notes.findIndex(note => note.id === note.id)
                this.notes.splice(idx, note)
            })
        })

    }, methods: {
        addNote(note) {
            note.isPinned ? this.pinnedNotes.unshift(note) : this.unpinnedNotes.unshift(note)
            noteService.create(note)
        },
        onClick() {
            this.appClicked = !this.appClicked
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
        sortNotes() {
            this.unpinnedNotes = this.notes.filter(note => {
                if (note.isPinned) {
                    this.pinnedNotes.push(note)
                    return false
                }
                else return true
            })
        }

    },
    computed: {
        getNotes() {
            return this.notes
        }
    },
    watch: {
        getNotes() {
            this.sortNotes()
        }
    },
    components: {
        noteAdd,
        noteEdit,
        noteFilter,
        noteList,
    }
}