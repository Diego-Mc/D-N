

export default {
    props: ['note'],
    template: `  
    <router-link :to="'/keepy/'+note.id">
        <div class="note-preview" @mouseover="isShowIcons = true" @mouseleave="isShowIcons = false" >
            <h3>{{note.info.title}}</h3>
            <p>{{note.info.txt}}</p>
            <div v-if="isShowIcons" @click.prevent class="note-icons-container" >
                <i @click="onDelete" class='bi bi-trash'></i>
            </div>
        </div> 
    </router-link>
    `, data() {
        return {
            isShowIcons: false,
        }
    },methods: {
        onDelete(){
            this.$emit('on-delete',this.note.id)
        }
    },
}