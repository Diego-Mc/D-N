import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const NOTE_KEY = 'noteDB'
_createNotes()

export const noteService = {
  query,
  get,
  remove,
  save,
  create,
  getNextNoteId
}

function query() {
  return storageService.query(NOTE_KEY)
}

function get(noteId) {
  return storageService.get(NOTE_KEY, noteId)
}

function remove(noteId) {
  return storageService.remove(NOTE_KEY, noteId)
}

function create(note) {
  return storageService.post(NOTE_KEY, note)
}

function save(note) {
  return storageService.put(NOTE_KEY, note)
  // else {
  //   return storageService.post(NOTE_KEY, note)
  // }
}

function getEmptyNote(vendor = '', maxSpeed = 0) {
  return { id: '', vendor, maxSpeed }
}


function getNextNoteId(noteId) {
  return storageService.query(NOTE_KEY)
    .then(notes => {
      var idx = notes.findIndex(note => note.id === noteId)
      if (idx === notes.length - 1) idx = -1
      return notes[idx + 1].id
    })
}

function _createNotes() {
  let notes = utilService.loadFromStorage(NOTE_KEY)
  if (!notes || !notes.length) {
    notes =
      [
      
        {
          id: 'n102',
          type: 'note-img',
          isPinned:true,
          info: {
            url: 'http://some-img/me',
            title: 'Bobi and Me',
          },
          style: {
            backgroundColor: '#00d',
          },
        },
        {
          id: 'n103',
          type: 'note-todos',
          isPinned:true,
          info: {
            label: 'Get my stuff together',
            title:'hi!',
            todos: [
              { txt: 'wawa', doneAt: null },
              { txt: 'Coding power', doneAt: 187111111 },
            ],
          },
        },
        {
          id: 'n104',
          type: 'note-todos unpinned',
          isPinned: false,
          info: {
            title: 'Bobi and Me 2',
            label: 'Get my stuff together',
            todos: [
              { txt: 'Driving liscence', doneAt: null },
              { txt: 'Coding power', doneAt: 187111111 },
            ],
          },
        },
        {
          id: 'n105',
          type: 'note-todos unpinned',
          isPinned: true,
          info: {
            title: 'Bobi and Me 2',
            label: 'Get my stuff together',
            txt: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam perspiciatis autem repellendus id libero, pariatur modi nobis eveniet voluptate mollit',
            todos: [
              { txt: 'Driving liscence', doneAt: null },
              { txt: 'Coding power', doneAt: 187111111 },
            ],
          },
        },
     
       
        
      ]
    utilService.saveToStorage(NOTE_KEY, notes)
  }
  return notes
}

function _createNote(vendor, maxSpeed = 250) {
  const note = getEmptyNote(vendor, maxSpeed)
  note.id = utilService.makeId()
  return note
}

