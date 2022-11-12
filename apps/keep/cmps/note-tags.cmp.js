import { eventBus } from "../../../services/event-bus.service.js"

export default{
    props:['noteId'],
    template:`
    <i @click="toggleTags" class="bi bi-tags"></i>
    <div>
        <ul>
            <li @clicked="addTag('wa')">
                wa
            </li>
            <li>
                wa
            </li>
        </ul>
    </div>
    
    `,data() {
        return {
            isShowTags:false,
        }
    },
    methods: {
        toggleTags(){
            this.isShowTags = !this.isShowTags
        },
        addTag(tag){
            eventBus.emit('tag-added',this.noteId)
        }
    },
}