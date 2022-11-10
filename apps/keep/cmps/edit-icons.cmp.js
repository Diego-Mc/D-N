export default{
    template:`
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
        </div>`,
    methods: {
        
    },
}