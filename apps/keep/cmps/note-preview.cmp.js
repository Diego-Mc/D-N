import editIcons from "./edit-icons.cmp.js"

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
            </div>
          
        </div> 
    </router-link>
    `, data() {
        return {
            isShowIcons: false,
        }
    }, emits: {
        onDelete: null,
    },
    methods: {
       
    }, computed: {
        noteBackgroundColor() {
            let noteBackgroundColor = this.note.color
            if (noteBackgroundColor) return `note-${noteBackgroundColor}`
            else return 'note-white'
        }
    },
    components:{
        editIcons,
    }

}