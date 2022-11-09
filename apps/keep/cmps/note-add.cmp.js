export default {
    props: ['appClicked'],
    template: `   
            <div class="add-note-container" @click.stop tabindex="1">
                <div v-if="isExpandAddNote" >
                    <i class="bi" :class="pinClass" @click="togglePin"></i>
                    <input v-model="note.info.title" type="text" placeholder="Title"/>
                </div>
                <input v-model="note.info.txt" @click="expandInputs" type="text" placeholder="Take a note..."/>
            </div>
    `,
    data() {
        return {
            note:{
                info: {
                    txt: null,
                    title: null
                },
            },
            
            // weird name.
            isExpandAddNote: false,
            pinClass: { 'bi-pin': true ,'bi-pin-fill':false},
        }
    },
    methods: {
        expandInputs() {
            this.isExpandAddNote = true
        },
        onAdd() {
            this.unPin()
            if (!this.note.info.txt && !this.note.info.title) return
            this.$emit('add-note',{ ...this.note})
            this.note.info = { txt: null, title: null }
        },
        togglePin(){
            if(this.pinClass['bi-pin']){
                this.note.isPinned = true
                this.pinClass['bi-pin'] = false
                this.pinClass['bi-pin-fill'] = true

            }else{
                this.note.isPinned = false
                unPin()
            }
            // console.log(this.note);
        },
        unPin(){
                this.pinClass['bi-pin'] = true
                this.pinClass['bi-pin-fill'] = false
        }
    },
    computed: {

    },
    watch: {
        appClicked: function () {
            this.isExpandAddNote = false
            this.onAdd()
        }

    }
}