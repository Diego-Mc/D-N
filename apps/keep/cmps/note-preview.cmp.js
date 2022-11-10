

export default {
    props: ['note'],
    template: `  
    <router-link :to="'/keepy/'+note.id">
        <div class="note-preview" :class="noteBackgroundColor" @mouseover="isShowIcons = true" @mouseleave="isShowIcons = false" >
            <img :src="note.imgUrl" alt="" style="width:200px"/>
            <h3 class="note-title">{{note.info.title}}</h3>
            <p>{{note.info.txt}}</p>
            <div v-if="isShowIcons" @click.prevent class="note-icons-container" >
                <i @click="onDelete" class='bi bi-trash'></i>
                <i class="bi bi-image"></i>
                <i class="bi bi-envelope"></i>
                <i class="bi bi-three-dots-vertical"></i>
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
        onDelete() {
            this.$emit('on-delete', this.note.id)
        }
    }, computed: {
        noteBackgroundColor() {
            let noteBackgroundColor = this.note.color
            if (noteBackgroundColor) return `note-${noteBackgroundColor}`
            else return 'note-white'
        }
    }

}