export default{
    props:['mediaSrc'],
    template:`
         
            <iframe  width="100%" v-bind:src="mediaSrc">
            </iframe>
    
    `,
    mounted() {
    },
}