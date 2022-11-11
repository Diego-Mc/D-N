import noteAdd from "./note-add.cmp.js"
import videoAdd from "./video-add.cmp.js"

export default{
    props:['"addNote","notes"'],
    template:`
    <section class="add-note-section">

                <div>
                    <component :is="currEditor"  @add-note="addNote" :notes="notes"/>
                </div>
    
                <div class="change-editor">
                      <button @click="changeEditor('noteAdd')">Base editor</button>
                      <button @click="changeEditor('videoAdd')">Video note</button>
                </div>
  </section>

    `,
    data() {
        return {
            currEditor:'noteAdd',
            addNote:'noteAdd',

        }
    },methods: {
        changeEditor(editor){
            console.log(editor);
            this.currEditor = editor

        }
    },
    components:{
        noteAdd,
        videoAdd
    }
}