import editIcons from './edit-icons.cmp.js'
import { eventBus } from '../../../services/event-bus.service.js'

import noteVideo from '../cmps/note-video.cmp.js'
import noteImg from '../cmps/note-img.cmp.js'
import noteCanvas from '../cmps/note-canvas.cmp.js'
import noteMap from './note-map.cmp.js'
import audioInput from './note-audio.cmp.js'

export default {
  props: ['editedNoteId', 'notes', 'renderedEditors', 'clicked'],
  emits: ['add-note'],
  template: `
            <div class="add-note-container" @click.stop :class="noteBackgroundColor">
                    <div v-if="note.mediaType">
                    <i v-if="!editedNoteId" @click="removeMedia" class='bi bi-trash remove-media-icon'></i>
                      <component :is="note.mediaType" :noteId="editedNoteId" :media="note.mediaUrl" @canvas-changed="saveCanvas" @emit-add="saveCanvasPerm"/>
                    </div>
                <div class="editor-content">
                  <div v-if="isExpandAddNote" >
                      <i  class="note-pin bi" :class="'bi-pin' + pinClass" @click="togglePin"></i>
                      <textarea v-model="note.info.title" type="textarea" :class="noteBackgroundColor" placeholder="Title" @input="noteChanged"></textarea>
                  </div>
                  <textarea v-model="note.info.txt" @click="expandInputs" type="textarea" :class="noteBackgroundColor" placeholder="Take a note or enter Youtube URL..." @input="noteChanged"></textarea>
                  <div v-if="isExpandAddNote" >
                      <ul>
                        <li v-for="(item,index) in note.info.todos" @click.stop :key="note.id + '-' + index">
                            <input v-if="item.txt" v-model="item.isChecked" type="checkbox" @click="onChecked(index)" :id="note.id + '-' + index"/>
                            <span v-else>+ </span>
                            <input v-model="item.txt" @input="onTodoType(item.txt,index)" @keyup.enter="onAddTodo(editedNoteId)" placeholder="List Item...." class="list-input"/>
                            <button v-if="item.txt" @click.stop.prevent="removeTodo(index)">X</button>
                        </li>
                      </ul>
                     <audio-input v-if="isShowAudio" @got-audio="addAudioUrl"/>
                    <audio v-if="note.audioUrl" :src="note.audioUrl" controls></audio>
                  <edit-icons :note-id="editedNoteId || note.id"/>
                  </div>
                </div>

            </div>
    `,
  data() {
    return {
      note: {
        mediaUrl: null,
        mediaType: null,
        audioUrl: null,
        isPinned: false,
        color: 'white',
        info: {
          txt: '',
          title: '',
          todos: [],
        },
        labels: [],
      },
      // weird name.
      isExpandAddNote: false,
      pinClass: null,
      isShowAudio: false,
    }
  },
  created() {
    const query = this.$route.query
    if (query.title) {
      this.note.info.title = query.title
      this.note.info.txt = query.txt
      this.isExpandAddNote = true
    }
    this.initNote()
    if (!this.renderedEditors) {
      eventBus.on(`app-clicked`, this.onAdd)
    }
    if (!this.renderedEditors || !this.renderedEditors.includes(this.note.id)) {
      eventBus.emit('new-editor-rendered', this.note.id)
      eventBus.on(`update-note-${this.editedNoteId || ''}`, (obj) => {
        this.note[obj.prop] = obj.val
        if (obj.prop === 'mediaUrl') {
          this.note.mediaType = 'noteImg'
        }
        eventBus.emit('note-changed', this.note)
        eventBus.emit(`note-changed-${this.note.id}`, this.note)
      })
      eventBus.on(`list-clicked-${this.editedNoteId || ''}`, this.onAddTodo)
      eventBus.on(`audio-clicked-${this.editedNoteId || ''}`, () => {
        this.showRecordInputs()
      })
      eventBus.on(
        `canvas-clicked-${this.editedNoteId || ''}`,
        this.changeMediaType
      )
      eventBus.on(`map-icon-clicked-${this.editedNoteId || ''}`, (obj) => {
        this.note.mediaUrl = {
          lat: obj.pos.coords.latitude,
          lng: obj.pos.coords.longitude,
        }
        this.changeMediaType(obj.mediaType)
        // eventBus.emit('note-changed', this.note)
        // eventBus.emit(`note-changed-${this.note.id}`, this.note)
      })
    }

    this.pinClass = this.note.isPinned ? '-fill' : ''
  },
  methods: {
    noteToMail() {
      const query = this.$route.query
      this.$router.push({ query: { isCompose: true, isNote: true, title: 'Hello', body: 'hey' } })
    },
    noteChanged() {
      if (this.editedNoteId) {
        eventBus.emit('note-changed', this.note)
      }
    },
    saveCanvasPerm() {
      eventBus.emit('note-changed', this.note)

    },
    addAudioUrl(url) {
      this.note.audioUrl = url
    },
    expandInputs() {
      this.isExpandAddNote = true
    },
    onChecked(index) {
      eventBus.emit('todo-clicked', { note: this.note, index })
    },
    onAdd() {
      console.log(this.notes);
      if (this.$route.params.id) {
        this.$router.push('/keepy')
        eventBus.emit('note-changed', this.note)
        eventBus.emit(`note-changed-${this.note.id}`, this.note)
        return
      }
      this.isShowAudio = false
      this.isExpandAddNote = false
      const info = this.note.info
      if (
        info.txt ||
        info.title ||
        info.todos.length ||
        this.note.mediaUrl ||
        this.note.audioUrl
      ) {
        this.$emit('add-note', { ...this.note })
      }
      this.note = {
        mediaUrl: null,
        color: 'white',
        isPinned: false,
        info: {
          txt: '',
          title: '',
          todos: [],
        },
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
      if (!this.editedNoteId) return
      const currentNote = this.notes.find(
        (note) => note.id === this.editedNoteId
      )
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
      if (txt.length === 1 && this.note.info.todos.length - 1 === index)
        this.note.info.todos.push({ txt: '', checked: false })
      if (!txt) this.note.info.todos.splice(index, 1)
    },
    removeTodo(index) {
      this.note.info.todos.splice(index, 1)
    },
    uploadVideo() {
      this.embedLink()
      this.note.info.txt = ''
      this.note.mediaType = 'noteVideo'
    },
    embedLink() {
      const startIdx = this.note.info.txt.indexOf('=') + 1
      const endIdx = this.note.info.txt.indexOf('&')
      this.note.mediaUrl = `https://www.youtube.com/embed/${this.note.info.txt.slice(
        startIdx,
        endIdx
      )}`
    },
    saveCanvas(url) {
      this.note.mediaUrl = url
      console.log(url);
      // eventBus.emit(`note-changed-${this.note.id}`, this.note)
      // eventBus.emit('note-changed', this.note)
    },
    changeMediaType(type) {
      this.note.mediaType = type
    },
    removeMedia() {
      this.note.mediaType = null
      this.note.mediaUrl = null
    },
    showRecordInputs() {
      this.isShowAudio = !this.isShowAudio
    },
  },
  computed: {
    noteBackgroundColor() {
      let noteBackgroundColor = this.note.color
      if (noteBackgroundColor) return `note-${noteBackgroundColor}`
      else return 'note-white'
    },
    getMediaUrl() {
      return this.note.mediaUrl
    },
  },
  watch: {
    'note.info.txt': function () {
      const regex =
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
      if (regex.test(this.note.info.txt)) this.uploadVideo()
    },
  },
  components: {
    editIcons,
    noteVideo,
    noteImg,
    noteCanvas,
    noteMap,
    audioInput,
  },
}
