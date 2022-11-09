export default {
    props: ['appClicked'],
    template: `   
            <div class="add-note-container" @click.stop tabindex="1">
                <input v-if="isExpandAddNote" v-model="info.title" type="text" placeholder="Title"/>
                <input v-model="info.txt" @click="expandInputs" type="text" placeholder="Take a note..."/>
                <button @click="onAdd">addNote</button>
            </div>
    `, data() {
        return {
            info: {
                txt: null,
                title: null
            },
            // weird name.
            isExpandAddNote: false,
        }
    },created() {
        console.log(this.appClicked)
    },
    methods: {
        expandInputs() {
            this.isExpandAddNote = true
        },
        onAdd() {
            if (!this.info.txt && !this.info.title) return
            this.$emit('add-note', this.info)
            this.info = { txt: null, title: null }
        }
    }, watch: {
        appClicked :function(){
            this.isExpandAddNote = false
            this.onAdd() 
        }

    }
}