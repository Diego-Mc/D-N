import editIcons from "./edit-icons.cmp.js"

export default {
    template: `
            <!-- <div class="add-note-container" @click.stop.prevent :class="noteBackgroundColor">
                <div v-if="note.videoUrl" class="video">
                    <iframe 
                        :src="embedLink">
                    </iframe>
                </div>
                <div class="editor-content">
                  <div v-if="isExpandAddNote" >
                      <i class="note-pin bi" :class="'bi-pin' + pinClass" @click="togglePin"></i>
                      <textarea v-model="note.info.title" type="textarea" :class="noteBackgroundColor" placeholder="Title" ></textarea>
                  </div>
                    <textarea type="text" v-model="note.videoUrl" :class="noteBackgroundColor" placeholder="enter video url" @click="isExpandAddNote = true"></textarea>
                  <div v-if="isExpandAddNote" >
                     
                  <edit-icons :note-id="editedNoteId || note.id"/>
                  </div>
                </div>
               
            </div>
              -->
              
               `,
    data() {
        return {
            note: {
                videoUrl: null,
                isPinned: false,
                color: null,
                info: {
                    txt: null,
                    title: null,
                    todos: []
                },
            },
            isExpandAddNote: false
        }
    },
    computed: {
        embedLink() {
            const startIdx = this.note.videoUrl.indexOf('=') + 1
            const endIdx = this.note.videoUrl.indexOf('&')
            return `https://www.youtube.com/embed/${this.note.videoUrl.slice(startIdx, endIdx)}`
        },

    },
    components:{
        editIcons,
    }
}