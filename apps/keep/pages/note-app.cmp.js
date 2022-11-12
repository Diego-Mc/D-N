import { noteService } from '../services/note.service.js'
import { eventBus } from '../../../services/event-bus.service.js'

import noteAdd from '../cmps/note-add.cmp.js'
// move to router?
import noteEdit from '../cmps/note-edit.cmp.js'
import noteFilter from '../cmps/note-filter.cmp.js'
import noteList from '../cmps/note-list.cmp.js'
import addSection from '../cmps/add-section.cmp.js'

export default {
  template: `
    <main @click="onClick" v-if="notes" class="note-app">
        <div>
            <!-- <note-filter @notes-filtered="onFilter"/> -->
            <note-add @add-note="addNote" :notes="notes"/>
        </div>
        <div class="note-types-container" v-if="notes">
            <note-list  :notes="getNotesByPinned(true)" type="PINNED"  @on-delete="deleteNote"/>
            <note-list :notes="getNotesByPinned(false)"  type="OTHERS"  @on-delete="deleteNote"/>
        </div>
        <router-view :notes="notes" :renderedEditors="renderedEditors"></router-view>
    </main>
    `,
  data() {
    return {
      notes: null,
      pinnedNotes: [],
      unpinnedNotes: null,
      filterBy: {
        txt: '',
      },
      renderedEditors: [],
    }
  },
  created() {
    this.queryNotes()
    // eventBus.on('pin-changed', (noteId) => {
    //   const idx = this.notes.findIndex((note) => note.id === noteId)
    //   console.log(idx);
    //   this.notes[idx].isPinned = !this.notes[idx].isPinned
    //   noteService.save(noteId)
    // })
    eventBus.on('onNoteMailed', (id) => {
      let sendedNote = this.notes.find(note => note.id === id)
      this.$router.push({
        path: '/maily/inbox',
        query: {
          isCompose: true,
          isNote: true,
          subject: sendedNote.info.title,
          body: sendedNote.info.txt,
        },
      })
    })
    eventBus.on('note-dropped', (swappedNotes) => {
      const idx1 = this.notes.findIndex(
        (note) => note.id === swappedNotes.dragged
      )
      const idx2 = this.notes.findIndex(
        (note) => note.id === swappedNotes.dropped
      )
      if (idx1 < 0 || idx2 < 0) return
      var temp = this.notes[idx1]
      this.notes[idx1] = this.notes[idx2]
      this.notes[idx2] = temp
      noteService.saveNotes(this.notes)
    })
    eventBus.on('new-editor-rendered', (id) => this.renderedEditors.push(id))
    eventBus.on('delete-note', (noteId) => this.deleteNote(noteId))
    eventBus.on('note-changed', (changedNote) => {
      const idx = this.notes.findIndex((note) => note.id === changedNote.id)
      if (idx < 0) return
      this.notes.splice(idx, 1, changedNote)
      noteService.save(changedNote)
    })
    eventBus.on('todo-clicked', (obj) => {
      const changedNote = obj.note
      const index = obj.index

      changedNote.info.todos[index].isChecked =
        !changedNote.info.todos[index].isChecked
      noteService.save(changedNote).then(() => {
        const idx = this.notes.findIndex((note) => note.id === changedNote.id)
        this.notes.splice(idx, 1, changedNote)
      })
    })
    eventBus.on('todo-removed', (obj) => {
      const changedNote = obj.note
      const index = obj.index
      changedNote.info.todos.splice(index, 1)
      noteService.save(changedNote).then(() => {
        const idx = this.notes.findIndex((note) => note.id === changedNote.id)
        this.notes.splice(idx, 1, changedNote)
      })
    })
    eventBus.on('on-duplicate', (noteId) => {
      const idx = this.notes.findIndex((note) => note.id === noteId)
      const clone = JSON.parse(JSON.stringify(this.notes[idx]))
      noteService.create(clone).then((note) => this.notes.push(note))
    })
    eventBus.on('keepy-advancedSearch', (criteria) => {
      this.queryNotes(criteria)
    })
  },
  methods: {
    queryNotes(criteria) {
      noteService.query(criteria).then((notes) => (this.notes =notes))
    },
    addNote(note) {
      this.notes.push(note)
      noteService.create(note)
    },
    onClick() {
      eventBus.emit('app-clicked')
    },
    deleteNote(noteId) {
      noteService.remove(noteId)
      const idx = this.notes.findIndex((note) => note.id === noteId)
      this.notes.splice(idx, 1)
    },
    onFilter(filters) {
      this.filterBy = filters
    },
    filterNotes(notes) {
      if (!notes) return
      return notes.filter((note) => {
        if (note.info.title) {
          if (note.info.title.toLowerCase().includes(this.filterBy.txt))
            return true
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
      let ha = this.notes.filter((note) => {
        return note.isPinned === isPinned
      })
      return ha
    },
    sortNotes() {
      this.unpinnedNotes = this.notes.filter((note) => {
        if (note.isPinned) {
          this.pinnedNotes.push(note)
          return false
        } else return true
      })
    },
    saveNote(note) {
      noteService.put(note)
    },
    connectGoogleApi() {
      if (window.google) return Promise.resolve()
      const API_KEY = 'AIzaSyCTfr4C-a7XNuHjCajMSI4f_QkH5GNDSj4'
      var elGoogleApi = document.createElement('script')
      elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
      elGoogleApi.async = true
      document.body.append(elGoogleApi)

      return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve

        elGoogleApi.onerror = () => reject('Google script failed to load')
      })
    },
  },
  computed: {
    getNotes() {
      return this.notes
    },
  },
  watch: {},
  components: {
    noteAdd,
    noteEdit,
    noteFilter,
    noteList,
    addSection,
  },
}
