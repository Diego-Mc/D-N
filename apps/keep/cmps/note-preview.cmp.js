export default{
    props:['note'],
    template:`  
        <div class="note-preview">
            <h3>{{note.info.title}}</h3>
           
            <p>{{note.info.txt}}</p>
        </div> 
    `,created(){
    }
}