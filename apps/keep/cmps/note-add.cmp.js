import editIcons from './edit-icons.cmp.js'
import { eventBus } from '../../../services/event-bus.service.js'

export default {
  props: ['appClicked', 'editedNoteId'],
  template: `
            <div class="add-note-container" @click.stop :class="noteBackgroundColor">
                <img :src="note.imgUrl" alt="" />
                <div class="editor-content">
                  <div v-if="isExpandAddNote" >
                      <i class="note-pin bi" :class="'bi-pin' + pinClass" @click="togglePin"></i>
                      <textarea v-model="note.info.title" type="textarea" :class="noteBackgroundColor" placeholder="Title" ></textarea>
                  </div>
                  <textarea v-model="note.info.txt" @click="expandInputs" type="textarea" :class="noteBackgroundColor" placeholder="Take a note..."></textarea>
                  <div v-if="isExpandAddNote" >
                      <ul>
                        <li v-for="(item,index) in note.info.todos" @click.stop :key="note.id + '-' + index">
                            <input type="checkbox" :id="note.id + '-' + index"/>
                            <input v-model="item.txt" @input="wa"/>
                        </li>
                      </ul>
                  <edit-icons :note-id="editedNoteId || note.id"/>
                  </div>
                </div>
            </div>
    `,
  data() {
    return {
      note: {
        imgUrl: null,
        isPinned: null,
        color: null,
        info: {
          txt: null,
          title: null,
          todos: [{ txt: 'wawawa' }]
        },
      },
      // weird name.
      isExpandAddNote: false,
      pinClass: null,
    }
  },
  created() {
    this.initNote()
    eventBus.on(`update-note`, (obj) => {
      if (obj.id === this.editedNoteId || obj.id === this.note.id)
        this.note[obj.prop] = obj.val
    })
    eventBus.on(`list-clicked`, id => {
      if (id === this.editedNoteId || id === this.note.id) {
        let todos = this.note.info.todos
        if (todos.length && !todos[todos.length - 1].txt) {
          return
        }
        this.note.info.todos.push({ txt: '' ,isChecked:false})
      }
    })
    this.pinClass = this.note.isPinned ? '-fill' : ''
  },
  methods: {
    expandInputs() {
      this.isExpandAddNote = true
    },
    onAdd() {
      const info = this.note.info
      if (info.txt || info.title || info.todos.length || this.note.imgUrl) {
        if(info.todos.length && !info.todos[info.todos.length - 1].txt) info.todos.pop() 
        this.$emit('add-note', { ...this.note })
      }
      this.note = {
        imgUrl: null,
        color: null,
        isPinned: false,
        info: {
          txt: null,
          title: null,
          todos: [],
        }
      }
      this.setPinClass()
    },
    togglePin() {
      if (this.pinClass) {
        this.pinClass = ''
        this.note.isPinned = false
      } else {
        this.pinClass = '-fill'
        this.note.isPinned = true
      }

      if (this.editedNoteId) {
        eventBus.emit('note-changed', this.note)
      }
    },
    initNote() {
      if (!this.editedNoteId) return this.note.id = 1
      let notes = {}
      eventBus.emit('get-notes', notes)
      notes = notes.val
      let currentNote = notes.pinnedNotes.find(note => note.id === this.editedNoteId)
      if (!currentNote) currentNote = notes.unpinnedNotes.find(note => note.id === this.editedNoteId)
      this.note = currentNote
      this.expandInputs()
    },
    setPinClass() {
      this.pinClass = this.note.isPinned ? '-fill' : ''
    },
  }, computed: {
    noteBackgroundColor() {
      let noteBackgroundColor = this.note.color
      if (noteBackgroundColor) return `note-${noteBackgroundColor}`
      else return 'note-white'
    },

  },
  watch: {
    appClicked: function () {
      this.isExpandAddNote = false
      this.onAdd()
    },
  },
  components: {
    editIcons,
  }
}
