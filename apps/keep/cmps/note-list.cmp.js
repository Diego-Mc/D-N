import notePreview from '../cmps/note-preview.cmp.js'

export default {
  props: ['notes', 'type'],
  template: `
        <label>{{type}}</label>
        <section
            class="notes-list"
            @drop="onDrop($event)"
            @dragover.prevent
            @dragenter.prevent
            >
            <note-preview v-for="note in notes" :note="note" :notes="notes" @note-clicked="noteClicked" @on-delete="onDelete"/>
        </section>
    `, created() {
    },
    emits: {
        onDelete: null,
        noteClicked: null,

    },
    methods: {
        onDrop(event){

        },
        noteClicked(noteId) {
            this.$emit('note-clicked', noteId)
        },
        onDelete(noteId) {
            this.$emit('on-delete', noteId)
        }
    },watch:{

    },
  },
  watch: {},

  components: {
    notePreview,
  },
}
