export default {
    template: `
         <div class="container" @click.stop.prevent>
            <div id="player"></div>
            <div class="display"></div>
            <div class="controllers">

            </div>
                <button v-if="showRecordBtn" @click="record" id="record">start recording</button> 
                <button v-if="showStopBtn" @click="stopRecording" id="stop">stop</button>
                <!-- <button @click="record" id="record">record again</button>   -->
        </div>
    `,
    data() {
        return {
            display: null,
            controllerWrapper: null,
            State: ['Initial', 'Record', 'Download'],
            stateIndex: 0,
            mediaRecorder: null,
            chunks: [],
            audioURL: '',
            showRecordBtn:false,
            showStopBtn:false,
        }
    },
    mounted() {
        this.display = document.querySelector('.display')
        this.controllerWrapper = document.querySelector('.controllers')

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log('mediaDevices supported..')

            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(stream => {
                this.mediaRecorder = new MediaRecorder(stream)

                this.mediaRecorder.ondataavailable = (e) => {
                    this.chunks.push(e.data)
                }

                this.mediaRecorder.onstop = () => {
                    const blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' })
                    this.chunks = []
                    this.audioURL = window.URL.createObjectURL(blob)
                    this.$emit('audio-recorded',this.audioURL)
                    // document.querySelector('audio').src = this.audioURL

                }
            }).catch(error => {
                console.log('Following error has occured : ', error)
            })
        } else {
            this.State = ''
            this.application(this.stateIndex)
        }
        this.application(this.stateIndex)
    },
    methods: {

        clearDisplay() {
            this.display.textContent = ''
        },

        clearControls() {
            this.controllerWrapper.textContent = ''
        },

        record() {
            this.stateIndex = 1

            this.mediaRecorder.start()
            this.application(this.stateIndex)
        },

        stopRecording() {
            this.showRecordBtn = false
            this.stateIndex = 2
            this.mediaRecorder.stop()
            this.application(this.stateIndex)
        },

        downloadAudio() {
            const downloadLink = document.createElement('a')
            downloadLink.href = this.audioURL
            downloadLink.setAttribute('download', 'audio')
            downloadLink.click()
        },

        addButton(id, funString, text) {

            if(id === 'record') return this.showRecordBtn = true
           else if(id === 'stop') this.showStopBtn = true
            // const btn = document.createElement('button')
            // btn.id = id
            // btn.setAttribute('onclick', funString)
            // btn.textContent = text
            // this.controllerWrapper.append(btn)
        },

        addMessage(text) {
            const msg = document.createElement('p')
            msg.textContent = text
            // this.display.append(msg)
        }
        ,
        addAudio() {
            // const audio = document.createElement('audio')
            // audio.controls = true
            // audio.src = this.audioURL
            // this.display.append(audio)
        },

        application(index) {
            console.log(index);

            switch (this.State[index]) {
                case 'Initial':
                    this.clearDisplay()
                    this.clearControls()

                    this.addButton('record', 'record()', 'Start Recording')
                    break;

                case 'Record':
                    this.clearDisplay()
                    this.clearControls()

                    this.addMessage('Recording...')
                    this.addButton('stop', 'stopRecording()', 'Stop Recording')
                    break

                case 'Download':
                    this.clearControls()
                    this.clearDisplay()

                    this.addAudio()
                    this.addButton('record', 'record()', 'Record Again')
                    break

                default:
                    this.clearControls()
                    this.clearDisplay()

                    this.addMessage('Your browser does not support mediaDevices')
                    break;
            }

        }

    },
}