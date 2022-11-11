import editIcons from "./edit-icons.cmp.js"
import { eventBus } from "../../../services/event-bus.service.js"
import noteVideo from "./note-video.cmp.js"
import noteImg from "./note-img.cmp.js"
import noteMap from "./note-map.cmp.js"

export default {
    props: ['note'],
    template: `  
    <router-link :to="'/keepy/'+note.id" @click.stop>
        <div class="note-preview" :class="noteBackgroundColor" @mouseover="isShowIcons = true" @mouseleave="isShowIcons = false" >
             
                <component :is="mediaComp" :media="note.mediaUrl"></component>            

            <div class="preview-text">
                <h3 class="note-title">{{note.info.title}}</h3>
                <p>{{note.info.txt}}</p>
                <div v-if="isShowIcons" @click.prevent class="note-icons-container" >
                    <edit-icons :note-id="note.id" :bin="true"/>
                </div>
                <ul>
                    <li v-for="(item,index) in note.info.todos"  @click.stop :key="note.id + '-' + index" >
                        <div v-if="item.txt">
                        <input type="checkbox" v-model="item.isChecked" :id="note.id + '-' + index" @click.stop="onCheck(index)">
                        <label :for="note.id + '-' + index">{{item.txt}}</label>
                        <button v-if="item.txt" @click="onRemoveTodo(index)">X</button>
                        <br>
                        </div>
                    </li>
                </ul>
                <audio v-if="this.note.audioUrl" :src="this.note.audioUrl" controls></audio>
            </div>
          
        </div> 
    </router-link>
    `, data() {
        return {
            isShowIcons: false,
            mediaType:null,
        }
    }, created() {
        this.mediaType = this.note.mediaType === 'noteCanvas' ? 'noteImg' : this.note.mediaType
    },
    emits: {
        onDelete: null,
    },
    methods: {
        onCheck(index) {
            eventBus.emit('todo-clicked', { note: this.note, index })
        },
        onRemoveTodo(index){
            eventBus.emit('todo-removed', { note: this.note, index })
        }
    }, computed: {
        noteBackgroundColor() {
            let noteBackgroundColor = this.note.color
            if (noteBackgroundColor) return `note-${noteBackgroundColor}`
            else return 'note-white'
        },
        mediaComp(){
            return this.mediaType
        }
    },
    components: {
        editIcons,
        noteVideo,
        noteImg,
        noteMap
    }

}