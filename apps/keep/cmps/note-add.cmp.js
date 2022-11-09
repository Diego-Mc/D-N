export default {
    props: ['clicked'],
    template: `   
        <section>
            <div class="add-note-container" @clicked.stop>
                <input v-if="isExpandAddNote" v-model="info.title" type="text" />
                <input v-model="info.txt" @click.stop="toggleExandAddNote" type="text" />
                <button @click="onAdd">addNote</button>
            </div>
        </section>   
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
        },
    }, watch: {
    }
}