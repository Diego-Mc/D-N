import noteAdd from "./note-add.cmp.js"

export default {
    template: `  
        <div class="note-editor" @clicked.stop>
            {{this.$route.params.id}}
            <note-add/>
        </div>

        <router-link to="/keepy"> 
            <div class="screen"></div>
        </router-link>
       
    `,
    components: {
        noteAdd
    }
}