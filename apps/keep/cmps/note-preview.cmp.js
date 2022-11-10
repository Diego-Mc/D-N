import editIcons from "./edit-icons.cmp.js"
import { eventBus } from "../../../services/event-bus.service.js"

export default {
    props: ['note'],
    template: `  
    <router-link :to="'/keepy/'+note.id">
        <div class="note-preview" :class="noteBackgroundColor" @mouseover="isShowIcons = true" @mouseleave="isShowIcons = false" >
            <img :src="note.imgUrl" alt=""/>
            <div class="preview-text">
                <h3 class="note-title">{{note.info.title}}</h3>
                <p>{{note.info.txt}}</p>
                <div v-if="isShowIcons" @click.prevent class="note-icons-container" >
                    <edit-icons :note-id="note.id" :bin="true"/>
                </div>
                <ul>
                    <li v-for="(item,index) in note.info.todos" @click.stop :key="note.id + '-' + index" >
                        <div v-if="item.txt">
                        <input type="checkbox" v-model="item.isChecked" :id="note.id + '-' + index" @change="onCheck(index)">
                        <label :for="note.id + '-' + index">{{item.txt}}</label><br>
                        </div>
                    </li>
                </ul>
            </div>
          
        </div> 
    </router-link>
    `, data() {
        return {
            isShowIcons: false,
        }
    }, created() {

    },
    emits: {
        onDelete: null,
    },
    methods: {
        onCheck(index) {
            eventBus.emit('todo-clicked', { note: this.note, index })
        }
    }, computed: {
        noteBackgroundColor() {
            let noteBackgroundColor = this.note.color
            if (noteBackgroundColor) return `note-${noteBackgroundColor}`
            else return 'note-white'
        }
    },
    components: {
        editIcons,
    }

}