import { eventBus } from '../../../services/event-bus.service.js'
import noteVideo from './note-video.cmp.js'
import noteImg from './note-img.cmp.js'
import noteMap from './note-map.cmp.js'
import previewIcons from './preview-icons.cmp.js'

export default {
  props: ['note'],
  template: `
  <router-link :to="'/keepy/'+ note.id" @click.prevent.stop>
    <div
      class="note-preview"
      draggable
      @dragstart="startDrag($event,note)"
      @mouseleave="isShowIcons = false"
      :class="noteBackgroundColor"
      @drop="onDrop($event)"
      >
      
      <component :is="mediaComp" :media="note.mediaUrl"></component>
      <div @mouseover="isShowIcons = true" style="border-radius:20px;">
      <i  class="note-pin bi note-pin-preview" :class="'bi-pin' + pinClass"  @click.stop.prevent="togglePin"></i>
        <div class="preview-text">
          <h3 class="note-title">{{note.info.title}}</h3>
          <p class="f-m-text note-text">{{note.info.txt}}</p>
          <ul class="note-todos">
            <li
              v-for="(item,index) in note.info.todos"
              :key="note.id + '-' + index">
              <div v-if="item.txt"  >
                <input
                  type="checkbox"
                  v-model="item.isChecked"
                  :id="note.id + '-' + index"
                  @click.stop="onCheck(index)"
                  />
                <label :for="note.id + '-' + index">{{item.txt}}</label>
                <button v-if="item.txt" @click="onRemoveTodo(index)">X</button>
                <br />
              </div>
            </li>
          </ul>
          <audio
            v-if="this.note.audioUrl"
            :src="this.note.audioUrl"
            controls></audio>
          <preview-icons :note-id="note.id" :bin="true" />
        </div>
      </div>
    </div>
    </router-link>
  `,
  data() {
    return {
      isShowIcons: false,
      mediaType: null,
      mediaUrl: null,
      pinClass: null,

    }
  },
  created() {
    this.initPin()
    this.mediaType = this.note.mediaType === 'noteCanvas' ? 'noteImg' : this.note.mediaType
  },
  emits: {
    onDelete: null,
  },
  methods: {
    initPin() {
      this.pinClass = this.note.isPinned ? '-fill' : ''
    },
    togglePin() {
      eventBus.emit(`pin-changed`, this.note.id)
    },
    startDrag(evt, item) {
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('itemID', item.id)
    },

    onCheck(index) {
      eventBus.emit(`todo-clicked`, { note: this.note, index })
    },
    onRemoveTodo(index) {
      eventBus.emit(`todo-removed`, { note: this.note, index })
    },
    onDrop(evt) {
      const itemID = evt.dataTransfer.getData('itemID')
      eventBus.emit('note-dropped', { dragged: this.note.id, dropped: itemID })
    },
  },
  computed: {
    noteBackgroundColor() {
      let noteBackgroundColor = this.note.color
      if (noteBackgroundColor) return `note-${noteBackgroundColor}`
      else return 'note-white'
    },
    mediaComp() {
      return this.note.mediaType === 'noteCanvas' ? 'noteImg' : this.note.mediaType
    },

  },
  watch: {
    mediaUrl: function () { },
  },
  components: {
    previewIcons,
    noteVideo,
    noteImg,
    noteMap,
  },
}
