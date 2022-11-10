import editIcons from './edit-icons.cmp.js'
import { eventBus } from '../../../services/event-bus.service.js'

export default {
  props: ['appClicked', 'editedNoteId'],
  template: `
            <div class="add-note-container" @click.stop :class="noteBackgroundColor">
                <img :src="note.imgUrl" alt="" />
                <div v-if="isExpandAddNote" >
                    <i class="note-pin bi" :class="pinClass" @click="togglePin"></i>
                    <textarea v-model="note.info.title" type="textarea" :class="noteBackgroundColor" placeholder="Title" ></textarea>
                </div>
                <textarea v-model="note.info.txt" @click="expandInputs" type="textarea" :class="noteBackgroundColor" placeholder="Take a note..."></textarea>
                <edit-icons v-if="isExpandAddNote" :note-id="editedNoteId || note.id"/>
            </div>
    `,
  data() {
    return {
      note: {
        imgUrl:null,
        isPinned:null,
        color:null,
        info: {
          txt: null,
          title: null,
        },
      },
      // weird name.
      isExpandAddNote: false,
      pinClass: { 'bi-pin': true, 'bi-pin-fill': false },
    }
  },
  created() {
    this.initNote()
    eventBus.on(`update-note`, (obj) => {
      if (obj.id === this.editedNoteId || obj.id === this.note.id)
        this.note[obj.prop] = obj.val
    })
  },
  methods: {
    expandInputs() {
      this.isExpandAddNote = true
    },
    onAdd() {
      this.unPin()
      if (this.note.info.txt || this.note.info.title) this.$emit('add-note', { ...this.note })
      this.note = {
        imgUrl:null,
        color:null,
        info:{ txt: null, title: null }
      }
     
    },
    togglePin() {
      if (this.pinClass['bi-pin']) {
        this.note.isPinned = true
        this.pinClass['bi-pin'] = false
        this.pinClass['bi-pin-fill'] = true
      } else {
        this.note.isPinned = false
        this.unPin()
      }
    },
    unPin() {
      this.pinClass['bi-pin'] = true
      this.pinClass['bi-pin-fill'] = false
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
  },computed:{
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
