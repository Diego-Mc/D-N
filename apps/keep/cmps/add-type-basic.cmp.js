export default{
    template:`
                <div class="editor-content">
                  <div v-if="isExpandAddNote" >
                      <i class="note-pin bi" :class="'bi-pin' + pinClass" @click="togglePin"></i>
                      <textarea v-model="note.info.title" type="textarea" :class="noteBackgroundColor" placeholder="Title" ></textarea>
                  </div>
                  <textarea v-model="note.info.txt" @click="expandInputs" type="textarea" :class="noteBackgroundColor" placeholder="Take a note..."></textarea>
                  <div v-if="isExpandAddNote" >
                      <ul>
                        <li v-for="(item,index) in note.info.todos" @click.stop :key="note.id + '-' + index">
                            <input v-if="item.txt" type="checkbox" :id="note.id + '-' + index"/>
                            <span v-else>+ </span>
                            <input v-model="item.txt" @input="onTodoType(item.txt,index)" @keyup.enter="onAddTodo(editedNoteId)" placeholder="List Item...." class="list-input"/>
                            <button v-if="item.txt" @click.stop.prevent="removeTodo(index)">X</button>
                        </li>
                      </ul>
                  <edit-icons :note-id="editedNoteId || note.id"/>
                  </div>
                </div>
                  `,
        
}