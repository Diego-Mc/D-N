export default {
    props: ['note'],
    template: `  
    <router-link :to="'/keepy/'+note.id">
        <div class="note-preview" >
            <h3>{{note.info.title}}</h3>
            <p>{{note.info.txt}}</p>
        </div> 
    </router-link>
       
    `
}