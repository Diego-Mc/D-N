import editIcons from './edit-icons.cmp.js'
import { eventBus } from '../../../services/event-bus.service.js'

export default {
  props: ['editedNoteId', 'notes'],
  // emits:['saveNote'],
  template: `
    <section class="add-note-section">
            <div class="add-note-container" @click.stop :class="noteBackgroundColor">
              <!-- <input type="text" v-model="note.videoUrl" placeholder="enter video url"/>
              <div v-if="note.videoUrl" class="video">
                  <iframe 
                      :src="embedLink">
                  </iframe>
              </div>
               -->
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
                            <input v-if="item.txt" type="checkbox" :id="note.id + '-' + index"/>
                            <span v-else>+ </span>
                            <input v-model="item.txt" @input="onTodoType(item.txt,index)" @keyup.enter="onAddTodo(editedNoteId)" placeholder="List Item...." class="list-input"/>
                            <button v-if="item.txt" @click.stop.prevent="removeTodo(index)">X</button>
                        </li>
                      </ul>
                  <edit-icons :note-id="editedNoteId || note.id"/>
                  </div>
                </div>
               
            </div>

                  <div class="change-editor">
                      <button>to video edior</button>
                  </div>
  </section>
    `,
  data() {
    return {
      note: {
        imgUrl: null,
        videoUrl: null,
        isPinned: false,
        color: null,
        info: {
          txt: null,
          title: null,
          todos: []
        },
      },
      // weird name.
      isExpandAddNote: false,
      pinClass: null,
      currId: {},
    }
  },
  created() {

    this.initNote()
    eventBus.on(`update-note`, (obj) => {
      if (obj.id === this.editedNoteId || obj.id === this.note.id)
        this.note[obj.prop] = obj.val
      eventBus.emit('note-changed', this.note)
    })
    eventBus.on(`list-clicked`, this.onAddTodo)
    eventBus.on(`app-clicked`, this.onAdd)
    this.pinClass = this.note.isPinned ? '-fill' : ''
  },
  methods: {
    expandInputs() {
      this.isExpandAddNote = true
    },
    onAdd() {

      if (this.$route.params.id) {
        eventBus.emit('note-changed', this.note)
        this.$router.push('/keepy')
        return
      }
      this.isExpandAddNote = false
      const info = this.note.info
      if (info.txt || info.title || info.todos.length || this.note.imgUrl) {
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
      const currentNote = this.notes.find(note => note.id === this.editedNoteId)
      this.note = currentNote
      this.expandInputs()
    },
    setPinClass() {
      this.pinClass = this.note.isPinned ? '-fill' : ''
    },
    onAddTodo(id) {
      if (id === this.editedNoteId || id === this.note.id) {
        let todos = this.note.info.todos
        if (todos.length && !todos[todos.length - 1].txt) {
          return
        }
        this.note.info.todos.push({ txt: '', isChecked: false })
        const idx = this.note.info.todos.length - 1
      }
    },
    onTodoType(txt, index) {
      if (txt.length === 1 && this.note.info.todos.length - 1 === index) this.note.info.todos.push({ txt: '' })
      if (!txt) this.note.info.todos.splice(index, 1)
    },
    removeTodo(index) {
      this.note.info.todos.splice(index, 1)
    }
  }, computed: {
    noteBackgroundColor() {

      let noteBackgroundColor = this.note.color
      if (noteBackgroundColor) return `note-${noteBackgroundColor}`
      else return 'note-white'
    },
    embedLink() {
      const startIdx = this.note.videoUrl.indexOf('=') + 1
      const endIdx = this.note.videoUrl.indexOf('&')
      return `https://www.youtube.com/embed/${this.note.videoUrl.slice(startIdx, endIdx)}`
    },

  },
  components: {
    editIcons,
  }
}
