export default {
    props: ['clicked'],
    template: `   
            <div class="add-note-container" @clicked.stop tabindex="1" @blur="wa">
                <input v-if="isExpandAddNote" v-model="info.title" type="text" placeholder="Title"/>
                <input v-model="info.txt" @click.stop="toggleExandAddNote" type="text" placeholder="Take a note..."/>
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
    },
    methods: {
        toggleExandAddNote() {
            this.isExpandAddNote = true
        },
        onAdd() {
            if (!this.info.txt && !this.info.title) return
            this.$emit('add-note', this.info)
            this.info = { txt: null, title: null }
            this.isExpandAddNote = false
        },wa(){
            console.log('wa')
        }
    }, watch: {
    }
}