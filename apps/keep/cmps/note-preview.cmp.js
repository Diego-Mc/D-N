export default{
    props:['note'],
    template:`  
        <div class="note-preview">
            <h1>{{note.id}}</h1>
            <h1>{{note.type}}</h1>
            <h1>{{note.info.title}}</h1>
            <h1>{{note.info.txt}}</h1>
        </div> 
    `,created(){
    }
}