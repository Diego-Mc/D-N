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
  saveNotes,
  getNextNoteId,
  getAdvancedSearchOptions,
}

function query({
  search = '',
  color = '',
  labels = [],
  noteType = [],
  isPinned = undefined,
} = {}) {
  return storageService.query(NOTE_KEY).then((notes) => {
    // noteType.map(type =>{
    //   if(type === 'image') return 'noteImg'
    //   if(type === 'map') return 'noteMap'
    //   if(type === 'audio') return 'noteAudio'
    //   if(type === 'canvas') return 'noteCanvas'
    //   if(type === 'video') return 'noteVideo'
    // })
    return notes
      .filter((n) => {
        if (search) {
          return n.info.title.includes(search) || n.info.txt.includes(search)
        } else return true
      })
      .filter((n) => {
        if (!noteType.length) return true
        return n.noteType.every((type) => noteType.includes(type))
      })
      .filter((n) => {
        if (!color) return true
        return n.color === color
      })
      .filter((n) => {
        if (!n.labels.length) {
          if (labels.length) return false
          else return true
        }
        return n.labels.every((l) => labels.includes(l))
      })
      .filter((n) => {
        if (isPinned === undefined) return true
        return n.isPinned === isPinned
      })
  })
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
  return storageService.query(NOTE_KEY).then((notes) => {
    var idx = notes.findIndex((note) => note.id === noteId)
    if (idx === notes.length - 1) idx = -1
    return notes[idx + 1].id
  })
}

function saveNotes(notes) {
  utilService.saveToStorage(NOTE_KEY, notes)
}

function _createNotes() {
  let notes = utilService.loadFromStorage(NOTE_KEY)
  if (!notes || !notes.length) {
    notes = [
      {
        id: 'n102',
        type: 'note-img',
        isPinned: true,
        info: {
          url: 'http://some-img/me',
          title: 'Bobi and Me',
        },
        style: {
          backgroundColor: '#00d',
        },
        labels: [],
      },
      {
        id: 'n103',
        type: 'note-todos',
        isPinned: true,
        info: {
          label: 'Get my stuff together',
          title: 'hi!',
          todos: [
            { txt: 'wawa', doneAt: null },
            { txt: 'Coding power', doneAt: 187111111 },
          ],
        },
        labels: [],
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
        labels: [],
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
        labels: [],
      },
    ]
    utilService.saveToStorage(NOTE_KEY, notes)
  }
  return notes
}

function getAdvancedSearchOptions() {
  return {
    // search = '',
    // color = '',
    // labels = [],
    // mediaType = [],
    // isPinned = undefined,
    cmps: [
      {
        type: 'radioCheck',
        info: {
          label: 'Is Pinned',
          opts: [
            { txt: 'pinned', val: true },
            { txt: 'unPinned', val: false },
          ],
          key: 'isPinned',
        },
      },

      {
        type: 'checkBox',
        info: {
          label: 'labels',
          opts: ['love', 'work', 'school', 'project'],
          key: 'labels',
        },
      },
      {
        type: 'checkBox',
        info: {
          label: 'note type',
          opts: ['image', 'map', 'audio', 'canvas', 'video'],
          key: 'noteType',
        },
      },
      {
        type: 'radioCheck',
        info: {
          label: 'color',
          opts: [
            { txt: 'blue', val: '#4a6788' },
            { txt: 'pink', val: '#834a88' },
            { txt: 'red', val: '#ffced7' },
            { txt: 'purple', val: '#c9c5ff' },
            { txt: 'yellow', val: '#effec3' },
            { txt: 'turquoise', val: '#9ef8e7' },
            { txt: 'green', val: '#b4ffbf' },
          ],
          key: 'color',
        },
      },
    ],
  }
}

function _createNote(vendor, maxSpeed = 250) {
  const note = getEmptyNote(vendor, maxSpeed)
  note.id = utilService.makeId()
  return note
}
