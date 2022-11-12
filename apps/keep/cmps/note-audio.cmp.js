import noteRecord from '../cmps/note-record.cmp.js'

export default{
    template:`
    <div class="audio-input-container">
        <h4>upload audio file</h4>
        <input type="file" accept="audio/*" @change="audioUploaded" capture id="recorder" />
        <note-record id="player" controls @got-audio="emitAudio"/>
    </div>

    </span>
    
    `,data() {
        return {
            
        }
    },methods: {
        audioUploaded(){
            recorder.addEventListener('change', (e) =>{
                const file = e.target.files[0];
                const url = URL.createObjectURL(file);
                this.emitAudio(url)

            });
        },
        emitAudio(url){
            this.$emit('got-audio',url)
        }
    },
    components:{
        noteRecord,
    }
}