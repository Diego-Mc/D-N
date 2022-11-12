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
    return notes
      .filter((n) => {
        if (search) {
          search = search.toLowerCase()
          return n.info.title.toLowerCase().includes(search) || n.info.txt.toLowerCase().includes(search)
        } else return true
      })
      .filter((n) => {
        if (!noteType.length) return true
        return n.mediaType === noteType
      })
      .filter((n) => {
        if (!color) return true
        return n.color === color
      })
      // .filter((n) => {
      //   if (!n.labels.length) {
      //     if (labels.length) return false
      //     else return true
      //   }
      //   return n.labels.every((l) => labels.includes(l))
      // })
      .filter((n) => {
        if (isPinned === undefined) return true
        console.log(n.isPinned === isPinned);
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
          txt:'',
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
          txt:'',
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
          txt:'',
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
        type: 'radioCheck',
        info: {
          label: 'labels',
          opts: [
            { txt: 'work', val: 'work' },
            { txt: 'school', val: 'school' },
            { txt: 'audio', val: 'audio' },
            { txt: 'canvas', val: 'canvas' },
            { txt: 'video', val: 'video' },
          ],
          key: 'labels',
        },
      },
      {
        type: 'radioCheck',
        info: {
          label: 'note type',
          opts: [
            { txt: 'image', val: 'noteImg' },
            { txt: 'map', val: 'noteMap' },
            { txt: 'audio', val: 'noteAudio' },
            { txt: 'canvas', val: 'noteCanvas' },
            { txt: 'video', val: 'noteVideo' },
          ],
          key: 'noteType',
        },
      },
      {
        type: 'radioCheck',
        info: {
          label: 'color',
          opts: [
            { txt: 'blue', val: 'blue' },
            { txt: 'pink', val: 'pink' },
            { txt: 'red', val: 'red' },
            { txt: 'purple', val: 'purple' },
            { txt: 'yellow', val: 'yellow' },
            // { txt: 'turquoise', val: 'turquoise' },
            // { txt: 'green', val: 'green' },
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
