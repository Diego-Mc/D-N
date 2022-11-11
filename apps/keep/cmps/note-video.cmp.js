export default{
    props:['mediaSrc'],
    template:`
        <div class="video" >
            <iframe  width="100%"
                :src="mediaSrc">
            </iframe>
        </div>
    `,
    mounted() {
    },
}