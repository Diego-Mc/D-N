export default {
    props: ['appClicked', 'editedNote'],
    template: `  
             <!-- <img :src="previewImage" class="uploading-image" /> -->
            <div class="add-note-container" @click.stop>
                <div v-if="isExpandAddNote" >
                    <i class="bi" :class="pinClass" @click="togglePin"></i>
                    <textarea v-model="note.info.title" type="textarea" placeholder="Title"></textarea>
                </div>
                <textarea v-model="note.info.txt" @click="expandInputs" type="textarea" placeholder="Take a note..."></textarea>
                <!-- use as a compenent tommorow. -->
                <div v-if="isExpandAddNote" class="note-icons-container" style="position:relative;"> 
                    <div class="upload-img-container">
                        <input type="file" accept="image/jpeg" @change='uploadImage' class="upload-img-input"/>
                        <i class="bi bi-image"></i>
                    </div> 
                    <div class="change-color-container">
                        <i class="bi bi-palette" @click=""></i> 
                        <div class="colors-container">
                            <button @click="note.color = 'red'" style="background-color:red;"></button>
                            <button @click="note.color = 'blue'" style="background-color:blue;"></button>
                            <button @click="note.color = 'green'" style="background-color:green;"></button>
                        </div>
                    </div>
                    <i class="bi bi-envelope"></i>
                    <i class="bi bi-three-dots-vertical"></i>
                </div>
            </div>
    `,
    data() {
        return {
            note: {
                info: {
                    txt: null,
                    title: null
                },
            },
            // weird name.
            isExpandAddNote: false,
            pinClass: { 'bi-pin': true, 'bi-pin-fill': false },
            previewImage: null,

        }
    },
    created() {
        this.initNote()
    },
    methods: {
        expandInputs() {
            this.isExpandAddNote = true
        },
        onAdd() {
            this.unPin()
            if (!this.note.info.txt && !this.note.info.title) return
            this.$emit('add-note', { ...this.note })
            this.note.info = { txt: null, title: null }
        },
        togglePin() {
            if (this.pinClass['bi-pin']) {
                this.note.isPinned = true
                this.pinClass['bi-pin'] = false
                this.pinClass['bi-pin-fill'] = true
            } else {
                this.note.isPinned = false
                this.unPin()
            }
        },
        unPin() {
            this.pinClass['bi-pin'] = true
            this.pinClass['bi-pin-fill'] = false
        },
        initNote() {
            if (this.editedNote) {
                this.expandInputs()
                this.note = this.editedNote
            }
        },
        uploadImage(e) {
            const image = e.target.files[0];
            console.log(image);
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {
                this.previewImage = e.target.result;
                this.note.imgUrl = this.previewImage
            };
        }
    },
    watch: {
        appClicked: function () {
            this.isExpandAddNote = false
            this.onAdd()
        }

    }
}