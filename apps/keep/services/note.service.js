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
        "id": "n104",
        "type": "note-todos unpinned",
        "isPinned": false,
        "info": {
          "title": "Im not pinned!",
          "txt": "",
          "label": "Get my stuff together",
          "todos": [
            {
              "txt": "pin me!",
              "doneAt": null,
              "isChecked": true
            },
            {
              "txt": "please!",
              "doneAt": 187111111
            }
          ]
        },
        "labels": [],
        "color": "red"
      },
      {
        "mediaUrl": "data:image/octet-stream;base64,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",
        "color": "turquoise",
        "isPinned": false,
        "info": {
          "txt": "Edit Me!",
          "title": "",
          "todos": []
        },
        "labels":[],
        'id': '123dswae',
        "mediaType": "noteCanvas"
      },
      {
        "mediaUrl": {
          "lat": 32.7825084,
          "lng": 35.2446336
        },
        "labels":[],

        "color": "green",
        "isPinned": true,
        "info": {
          "txt": "",
          "title": "i was here!",
          "todos": [
            {
              "txt": "code",
              "isChecked": true
            },
            {
              "txt": "code",
              "checked": false
            },
            {
              "txt": "code",
              "checked": false
            },
            {
              "txt": "code",
              "checked": false
            },
            {
              "txt": "",
              "checked": false
            }
          ]
        },
        "mediaType": "noteMap",
        "id": "xGMSm"
      },
      {
        'mediaUrl': 'assets/cat-img',
        "id": "n105",
        "type": "note-todos unpinned",
        "isPinned": true,
        "labels":[],

        "info": {
          "title": "You have alot of flexability!",
          "txt": "Make map notes and write about the place you visited, have a todo list with an img, and more.",
          "todos": [
            {
              "txt": "Create a beautiful note",
              "doneAt": null
            },
            {
              "txt": "Repeat",
              "doneAt": 187111111
            }
          ]
        },
        "color": "purple",
      },
      {
        "mediaUrl": "https://www.youtube.com/embed/j635NjTo0X0",
        "mediaType": "noteVideo",
        "audioUrl": 'assets/audio/audio1.mp3',
        "isPinned": true,
        "color": "blue",
        "info": {
          "txt": "",
          "title": "",
          "todos": []
        },
        "labels": [],
        "id": "dVUm0"
      },

      {
        "mediaUrl": "https://media.giphy.com/media/scZPhLqaVOM1qG4lT9/giphy.gif",
        "mediaType": "noteImg",
        "audioUrl": null,
        "isPinned": false,
        "color": "yellow",
        "info": {
          "txt": "",
          "title": "",
          "todos": []
        },
        "labels": [],
        "id": "as2dVUm0"
      },
      {
        "mediaUrl": "https://www.youtube.com/embed/c-I5S_zTwAc",
        "mediaType": "noteVideo",
        "audioUrl": null,
        "isPinned": false,
        "color": "red",
        "info": {
          "txt": "",
          "title": "",
          "todos": []
        },
        "labels": [],
        "id": "dVUm0"
      },

      {
        "mediaUrl": null,
        "color": "white",
        "isPinned": false,
        "info": {
          "txt": "delete me",
          "title": "You can delete boring notes!",
          "todos": []
        },
        "labels": [],
        "id": "4qyoz"
      }
      // {
      //     "mediaUrl": "data:image/octet-stream;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAEsCAYAAAA1u0HIAAAAAXNSR0IArs4c6QAAIABJREFUeF7tvQm0JFWV7v/tzIxbpUxSGclgo69QBhvBAVtQniJqN7QN2qg0Uigg3SBSwBMLBJECBIoCRApbBkXwMSmgLWAz+BeW0IJPHHAWUQGltFWQjFuMNlU3MnP/17430koueSuniMgTEV+sxUK8Z9j7t6Pqu+fEOXsL+JAACZAACZAACWSegGTeAzpAAiRAAiQwFIFQ/WM8Cc4dqjM7OUeAgu5cSGgQCZAACSRPINTackBPEGCvigS3JD8jZ0iaAAU9acIcnwRIgAQcJRCq/0sBthXg8LIEFztqJs3qkwAFvU9QbEYCDhDYAMA7AbykT1s+3mc7NisogYbW9lHopwH5rif1dxUUQ27cpqDnJpR0JKcETMQXA9g5EvMbAPwJQNDD392in38TAIU9py9HHG6F6n8PwE6PAxvWJHgqjjE5xngIUNDHw52zkkAngW4rbx/ACztE3P7SvQjAIH/hmpCbsP8RwHuJnAS6EYhW6Rcr9MMTMnklKWWXAAU9u7Gj5dkncBiAPdax8v4tAFuRDyLis6nsCeBmAHsB4MGn7L8ziXjQ0NoDCm15EmybyAQcNBUCFPRUMHMSEngOgbbQroi2xEcR7V54vwjgAW6998JU3J83tfaxFvQMoPQGTx79dnFJZNtzCnq240frs0Pg7QBeE5m7NYD9U1w1t7+h81t6dt6X1C2dUv/HJaBWxsSrRP7U64xG6vZxwt4EKOi9GbEFCYxKwIT0AwDsgNr90WD3pLgFTkEfNYIF6N/Q6gEtyIkC+b0n9d0L4HLuXKSg5y6kdMghAnaoze72KoAPRqfTx2EeBX0c1DM2Z139DV4APCnQLwAIKzL5rxlzofDmUtAL/woQQEIETgfwb5Ggn5rQHP0OS0Hvl1TB24Vaux5o/RIovRZofc+TyZMKjiRT7lPQMxUuGpsBAvMBWG5sO71+FYBxi7kho6Bn4MVxwcQprR4lkPdXMLFHA1N3KvDpCWaQcyE0fdlAQe8LExuRQE8Cdpf8ZAB7A7gNwDEAVvfslU4DCno6nHMxS6j+LQr9GlD6tkBN1I+ZkODSXDiXcyco6DkPMN1LlICJuAm4pWO1f+zO+DeiBDCJTjzg4BT0AYEVuXmoC14vKF1Xxgu2bOGJsxS6WUWCRUVmkhXfKehZiRTtdInA4QD+oUPEvxpDApgk/aOgJ0k3h2NPqX+pQB+uAJ9tQn5WkaCaQzdz5xIFPXchpUMJE2hfQftStMWeZEKYuFyhoMdFsiDjqG62sIHGQxVUtmyg8WVAjvWkfldB3M+smxT0zIaOhqdMwJUraMO4TUEfhlrB+4RaPV0gmyv0EUPhyeTSgiNx3n0KuvMhooEOEHDpCtowOCjow1AreB/VreY18PhDCj0dkH+dkOC1BUfivPsUdOdDRAPHSKB9Bc2yZlmyDReuoA2Dg4I+DLUU+qxR/+Nl4J6KBE4WzmlqdXELsqcArytDXyEyaZX7+DhKgILuaGBo1tgJnALgfQ5eQRsGDAV9GGop9JlS/4synddfzvSk/rEUphx4ilD9H1qnEuSustQ/PHuAhvp7uvoLycDOZrwDBT3jAaT5sRNwMTHMqE5agpvfsNraqBiT6d9U/5gW5N0zo+t1ngSWmMiZJ9TqGYrS2wT6UoW8aULqP2kbZ2LeAm4uAXtR1McfMgr6+GNAC9whYFvqVgXNtcQwoxCaB+DeKNHNjaMMxL7JEmhqbXkLeoI4Jo6q/gYN4EmFHC3QD1Qw8aZ2NTbbYQB0hwmZfEWydDh6PwQo6P1QYpu8E9gKgB182x6AXUdbliOHL4x8OSJHPuXWFVvxKnATgNM8CZwpd9vQ2vUttL6qwNYllHa2amyh+mbfKa79ApLbl6MPxyjofUBik1wTsKs4JuZWhCJPQm5BOy3acbBfVFxJQ5vrlykO51wUSiutCpTeWZH6uxpa/b8KeTWAV9lBUZd+8YiDf5bHoKBnOXq0fRQCJwLYL9qONjF/cJTBHOy7J4Cbo+Q39gsLnwwR6FipL/MksBoBY33a2+4VYMPGTJ0COzR6lyfBm8ZqGCd/FgEKOl+IIhJoZ3u7DIAJe96etpjvBcDJ61B5A56EP6H6JwlwICC3lbHREpEH1yQxT79jRqVVNwVkFwDnALDPA6zG1i/AFNpR0FOAzCmcIZDlbG/9Qpz+rgmAYt4vMYfbWXKXEE+sAHQPAa7wJBjbbktDqxcp5HBAzvCkvnRKa6+yamwAzuO2uxsvEQXdjTjQiuQJ2An2QwFcnOEEMb0otVfm5qszB6p6Gc2f9yYQqm/nIWzFnvr1sOhq2v52X16md3zkdxWpTx+ydPF7f2+a+W1BQc9vbOnZWgJtobO/FG31mseHK/M8RrXDp+i7up2LSO0gWntOBa4uAVeXsf7tIZ6+twQsqUgwfQ2y3WYcv2zkPOQDu0dBHxgZO2SMQBGEjivzjL2Uw5qb5oo41NpydLkXP6X+VQr8Zl7HtTqK+rARjbcfBT1enhzNLQJFEDo7oW87D/xm7ta7l5g1HSv1k5P4pj6lCw4VlA+eceC5mess/7z9pFPQuVJPLNwDDUxBHwgXG2eIgF2t+WTOha6dBe6a6HpahsJDU9sE2gJZBv5QBu4SCe7vRce+qQuwqIz1dxBZGWuOgVBrdwNytyePHtvNjrkEnaLeK2rJ/5yCnjxjzjAeAncD+CYAJwtexISEWeBiAjnOYUwgBdioBFQB7BrZclcLmFTgCftvgf7Wg9wgEjzVtrWhten4tw+oxeFDqDVLrvQWT+p2Na3rsy5B7xT1NL/1x+F7HsagoOchivRhNoF9ACwBMOdfSjlAdhyAD0TpamNdoeWATaZdUPW3aQK7NoEtIjH3BaUXAvpOQG4A9OcK/ZoHuS8EfizA1XEkn1FdOL+Jp23sSzyZ/MSwgm790vzWn+lgx2w8BT1moBzOCQL2jc/+MjzECWuSMcJ2IO4AYKlr+RSAgGVrC6EHlyA7KLAjZv55WIHNAbloIrpKNiyKflf8vVboa3cQpvPS38zT78NGZPB+FPTBmbGH+wTyXv+7CDsQ7r9lY7ZQFV6I6o4CsfMi/6LQxwX4xGp4l24gj9QHMS/U6nEK+YCH9bfv9U2+X0G3+Xn6fZAojN6Wgj46Q47gHoG8C7qtzlcA+Ip76GnROAi0t7gBvRUQyyp3SQt66YRMfr8fe+wgXAu4Y57Ue+74DCLoFPV+6MfXhoIeH0uO5A4BE/StAbzXHZNis+RMAFYQI8/nA2KDVaSBOq6znQPIYwo9VIDftoC7JoDzOg/UdXIJtfoxoLTXug7CdbYfVNAp6um9hRT09FhzpvQI5LU4ieWi/4Hlzo6KY6RHlDNlgsDsw2ih+ksAeYMdqJPpA3WtG8qQr3aK+8w1NdzsSX15P04OI+gU9X7Ijt6Ggj46Q47gJgET9ZsAfATAuW6aOLBVlmrzR8zTPjC3QnVYW3pVzvKkPn1tMzpQ984SSntrdFq+hNb3gLK2oHv3uzq3sYYV9E5RbwGnzk5MU6ggJeQsBT0hsBzWCQK24tgtJ9vTloP+7wC83QmyNMJpAk31j2lB3m1GCrCiIvW/nreYqW2ui4HSzjNX4fArgS6fvXKfy8Ep9b+owAPDCnK0i3CsQo6ckPrlToPMmHEU9IwFjOYOTMC2E+2frlmvBh5tPB0OBHBWJOh/Go8JnDWLBBpa20dncjI8J43rjLDjSQUOK0H+0Vbuv/td6ztb/i/5QlkmL+rmb1R5zQrEXD0hwdBnVKa0ulMJ+JJCLvIksNrqfGIgQEGPASKHcJqAlUyN8lLjywA+5bS13Y27xHJ1AFicQdtpsgMEmlpb3ppVaGWNLjithPL2ntTfZSZuu215n4MPmf8fhx0+/+EN1ivdUMZGS0QeXDPbfBP1igS3jOrWM7rplhU0v2QZHT0JLFESnxEJUNBHBMjumSFgK1zbgtwBQNYyq/0wEvPvZYY2DXWOwOw74XYYToEvTUj93wG8PjprsvGLXlQ57De/3/g9gO4hKB3hyaO3JuWM6qbrNdD8skAerUi9/Yt3UtPlflwKeu5DTAc7CGQx97kHYArARLRKZ0BJYGgC7QNzAvmKAlt0HIazq57bAdi3PfiU+ncq8F/DfisfxMgprV0u0FoF5X1F/vyXQfqy7VoCFHS+DUUiMB/Avfb9L0PVyXYGYN8zX1OkQNHX5Ah0JKG5zZPJPaKZnpWMKa5v5YN4sUb9c0rAmyqo7CvyyMpB+rLtDAEKOt+EohHIWv3w8wHYLyJ2FoAPCcRCwE6qA9hfgFM9CUzMn5NdMa5v5YMYHKr/EZ0+gY/39JvlbpDx896Wgp73CNO/bgTaiWcs65rL5VVNyH8OwEpaXsFQkkBcBOwuua2G7VpnVDzltbNW6nFNNfA4U1p7v0AvKEHPK8uk/QLOp08CFPQ+QbFZ7ghYQYvpe7oA7gRwGYD7HfMyi9/8HUNIc7oRaCeHKQP3KHDTjV+d+va73/nk7a4kLYrS0S4S6L1lyEki9QcZyd4EKOi9GbFFvgkcHp3w3TVy8y4AvwBww5gF/h1RAZbtM3gqP99vTA6868z2ZklofvtQ62hza8styx/uTEIzbldDrS0F9HRATvKkbjtVfNZBgILO14ME1hLYBoBlzno5gE6B/zWAb0RpV+0+eBqPfdN8KYAD0piMcxSLQJf0rR8/6eT1tjv51OdvMUNCr/Mk6JoyOe1v66q1rULoMoG8XNA6qSKTXy1WtPr3loLePyu2LB4BE3hLtfoyADtG/1gudfvnV1Gu+KS26S8F8IdZW6B5LwtbvDdsTB53E/TIlI93S0LTNnOc9c0bWt1bUTqd2/BzvzQU9DH9geK0mSRgd8JN2P/eEmvNWsX/DMA1AP4Yk2fdap5T0GOCW/Rh1iXoxqajFGv7FPw0srX32PH2OLLFDRMHbsNT0Id5b9iHBPohYKt4O1z3CgC7A/gNgNuif+x7/DDPPpjJv92ueW6n8i3VJgV9GJrs8xwCcwi6D+DIduPOUqxl4K7GzPu3JDoVP3Lq11HCwm347vS4Qh/lrWJfEnguAfv2bsJuCTteEgn7owAe6xOWVYdbCGAVACuXurXdFwawFwBnrhb16QubOUqgi6BbAaC9AUzndW8/Da1doNAjZv5bbihBby1LcLErbnEb/tmRoKC78mbSjjwS+JtI3P/XAM6ZoNvzzY4+JupW2Yor9AFAsuncBLoI+gYAngSwIYCnrGd7212h3xXIzoLxbbP3iiW34aNfuXqB4s9JgAScIUBBdyYU2TbEBF2AjSYk+HCHJ9cDsBPkV4ZaW46O6mzjPAzXL2nbhm9CT1eIXfW8xpP68n775qUdV+h5iST9KAIByxb3kCvJP4oAPK8+NtQ/xA51ViSwrfb2c8DhRzzvyE9fsH5z5v949tW1joNyp3sSnOwqm6ZWT29BPmR14CcksNsihXko6IUJNR3NAQFLA2upMHkPNwfBHKcLqv42TeC2igR2XgOh1j7WaOg//+Cexk5bLiwfuMULJ6/qZl+o/kkKHFSC3DpXvfRx+tWee0r9HWXm1skXPAlOd8GmNGygoKdBmXOQwOgElkYJbxaNPhRHIIHpb+QrFbgekNfN8Gjd7Mnk30V5FubMyqa61bwQT6yYqZeOK1wVTFV/8wZwjQD3VSSwgi+5fyjouQ8xHcwBga0APBCdeGdO6xwEdNwu2IpcgKMVaAKt8z2ZbH9vthoH/wDgH3vZGKp/mu0YDXKNLe0sc+bDlPrXlID5Zay/SGTl6l5+ZfnnFPQsR4+2F4WAbR1afnnmsi5KxBPy04Q8ugJpK/KHAXlXF0F+GMBbAdzXy4z2d/UScGx5jlSx7TGsLYCbbf60k9KE6q9Q4H83Ud7vefJnO4eSy4eCnsuw0qkcEfgQADvAtEOOfKIrKROwAiwtSFRdcHprfXpF3s78BuC0qC66/d9n24k4AB/tx8zoRPw7PQn+tlf7UP0fCvDJigT2S2qqz0ytdRwlKO3nyaOWiTF3DwU9dyGlQzkjYCuanwI4MWd+0Z2UCLRFuwQ5qyx1W6E/64kywp3ccc98OwBWSnXzfkxcu0qXM7uN3x5jjS7YrozS7RUJ+hq3n7kHbdPQ6vsUcpmJekUevW7Q/q63p6C7HiHaV2QClpDGxHyB7Y8WGQR9H45AZ/rWdW1zd7ln/nUAtoq17+Q9n1D9Y+aqztbuHGrtLEDFk+D4ngMm2CDU6lsBuaYEPa0skxckOFXqQ1PQU0fOCUmgbwInAHgxAKvZzocEBiIwx3b6nGN03DM/2ZPgmSgNbLuewEBzd2scqv9wC623zpNVPb/NjzxZjwFst6CE0jWA2ueH3Ox+UdCTfnM4PgkMT8AquFke7W8NPwR7FpHA7Exv/TKwk+sCLCpj/R1EVt4BYAWAr/Tbf652Ta19tIXWbp5M9jw9P+pc/fZ/XDfaeD1UrlHg4QmZPLjffi63o6C7HB3aVmQCbwRwYVTFrcgc6PsABKZ0waGCciROz8701u8wDa3Ze4eK1P9rVtW/fod4TrtQq18vofTNstTPGnqQhDpOafUyATavoLmfyOOPJzRNKsNS0FPBzElIYGACnwHwewBnDtyTHQpLINTa3YDc7cmjxw4LQXXh/BBP3yvQz3kyaRXYrBxwu47AwMO6cBiul9GhVpcDsmcLrUUufBLoZe9cP6egD0uO/UggOQKlqHzqKwH8LrlpOHKeCIS6yScB3cWT+sjfvddobVkJeIsn9f8E8L5Rrk26chiuV6yntHaUQE8CdJEnk3bKP3MPBT1zIaPBBSCwBMBb1iYAKYDHdHFoAg2t7WOFSGwARfOyCVl1ydCDdXS01b4AKypSt/vrQyc2cukwXC8uDd3k3YrWtS3owfNk8gu92rv2cwq6axGhPSQwU1TCTgIXpqgEgz44gc5kMZHwjnx4rdOK9i8KntStIttQqYdD9T8B6CtcOgzXi3Som+xioi7A+Z4E5/Rq79LPKeguRYO2kMAMgcnoMNwfCYQEuhHoN5nLqPRmvslPZ5azz0AvB9B3caAOG48qSz1T971VN92ygea1AL7tSTC9+5GFh4KehSjRxiIR2BXAJwHsVCSn6Wv/BLokgem/84At27nfo+/yVr73egCn9BomTRuTKvhihwMbePpaBZ6ZkKDvX2R6sUny5xT0JOlybBIYnEC7AIuVS+VDAs8i0G/mtzixdXxLfxmAg6IDcnNWLWtq7cgW9PxBqrANa28aBV8a6l+kwHYVYJFIYIVrnH0o6M6GhoYVlMA9AKyE5V0F9Z9uz0Fg0MxvcYHs+JZup+en76hHCY+6TmF3zgH5mSfBcXHZsK5x7BcOReuzEzJ5ZVLzheqfZKf9FVg0IcGPkppn1HEp6KMSZH8SiI/A3wCw7HDV+IbkSHkgMI6VeSe3jlW6FQu6F8DVAE6ezTbtO+eq/gYN4MkKsKFI8FSSsW6of4jOZM47tVfe+iTtWNfYFPRxkee8JPBcAlYJy8qkZuJ7HQOYDoFxrcw7vZu1SrfVqhVt2QvALbOEP9UCLFNaPVBQ2tuT+rvSiMZMSl3sFsdd/yTspaAnQZVjksBwBOzAkVW4skNxfEgA416Zz16lA7jTk7oVDdoTgK3WnyXqad85X6P+xwXqT8jkkWm9Lh27FbFeE4zDfgp6HBQ5BgmMTmADAE8C2BBAoluHo5vKEdIg0FH9zLZ4h069GpetofqWTvb4CuT1IvUHO0TdVuunhFq1A51/l+adcxN0829einzWaG2fErDExVU6BT2ut53jkMBoBCx5h+XNTmXrcDRT2TtpAlb1DMBJaZwUH8SXSNT/2ZPAigfZcyqAQ03IQ63dWoJ+vizBpwYZc5S2swU9qStss210dZVOQR/lbWJfEoiPgG233wDgqviG5EhZI6C61bwmnljRgu4hwBWeBM5lC2yoP51atiKBCbk9H//389d/zxFHzv9JJeX72lPqn6fAE7ZCT/Puu6urdAp61v7E0948EsjDdrt9U33WAak8BipJn+xqlAAHAnJbGRstEXlwTZLzjTJ2qP63APynJ8EnVWtbNaAP/P1uT3z6zjvDD40y7qB9G+rbVbW7KhJcan2n1P+iAg+ksQXv4iqdgj7oG8T2JBA/gaxvt9vJXzso9ZxTz/GjyueIHd/LT/ckeM51MNe8jkT8OwDOFuA1Dz+iv3/R5pMHAPi8fSpIy96G+ivLwO4iwf02Z5rf1F1cpVPQ03rzOE/cBPK0IszqdrslwLFKXPZcB+DcuINchPFcOsk+CO81WjuzAuzXAp72pG7XLS0lrJVatfrplv880R0GVX+bJnBbRYKFbbvTFHSb07VVOgV9kDeYbV0h0PXKjCvGDWhHVrfbLQY3ATgLgN2f5zMEAddOsg/qQqjVx8oo3V6S+j5R33mYSb6yB4ArkqwYaIleAOxakcB2uKaftAXdtVU6BX3QN5jtXSBgV1W2BvBeF4wZ0YaPAHh9xk63G39bjXGLfcTgW/e0TmbHYOqzhoiywn1bIb/scoVr+pR+ku/IzB10bDQhwYfHJeiurdIp6HG/5RwvDQLtO7ljv5sbg7NfAvATAGfGMFYaQ7RX5vYXdh74p8Esl3OEWpvOCgfIG1vAnfNmEs50Pu2dNLvaFvu70m01nvYKfWZXwJ176RT0XP5Ry71TeRJ0SyKzFYA/ZyBqPPyWgSClZWI7K1wJpX8CcGILrTfMk1W/mDV/Yrs53QW9uhyQqTROuXf66cq3dAp6Wm8/54mTQF4E3b4znmjfAeOEk8BY9n3UDjnZw8NvCQDO2pCh1s4EWq9uZ4WLSqb+awUTbxD50/+0/Yk+J9h/WprYWFfq3QQ9VN8OZv4p7eIprqzSKehZ+5NEe42ACfp2APbNOI5/B/CIw9vtdtjNvpPbYwednMtdnfH4Z9J81YXzm3j65wK5oCx1e4enHxNTgSysSH365sOsRC+vjfvcRTdBb6h/dRO4eZ4EVg0u1ceFVToFPdWQc7KYCNghsvYVqSyvGO3u7L8A+GlMXOIapnNFbisr22rnQwLTBBpam66JXpH6EbORhFq7XqEPTUhwTJfMbbGev5hjhf5N+4Xfk8D+nerjwiqdgp5qyDlZzATa33TtQFnWrk69EsB/ANgmZiajDNcp5FyRj0Iy5r5T6u84IcGPYh524OFCrS5VyPs9rL+9yMrVswdQfeHzG5j6fwI8osDbuuSij+2b+hyC/usm8I75Evx6YOdi6DDuVToFPYYgcoixEuhMbpIlEfoogM0BpJoqc45I2fWit0U/yxLDsb54aU2+Rv39SsAhngR/n9acc80Tau3ngF7vSWDXFrs+Ta0e3oJcJMCdFQl269IoljwSc2y5P1lGawuRVVa5MPVn3Kt0CnrqIeeECRHoXF1a5jXXa4rfFW1lfz0hHr2GfR6ADwI4zA4RAbjV0nj26sSfj4fAlPq/BXS/CZn8/ngsmM6KtlSgL19XAZb2NrsC1wiwaB3V4ka+0jZb0Cd1wYYbofSHigRWgnhszzhX6RT0sYWdEydEwLbfLYOUiZOror4pAKsnbVni0n5e2iHkNwK4GIAV2uDjMIFQqyco5CUTayucpWptuwBLBbJ1VAv9OfOHWlsO6AltEe+j+tlI2++zBX21+tuWgRs9CbZNFc6syca5SqegjzPynDspAnav+zIAv4pqNSc1z7DjWna4vwPwnmEHGKKf1a+21fg7IhH/LIDfDDEOu4yBwFO6WW0+Go+uRmWTDeSRetomNNS/RiG/8KS+bPbcDa3to3+91qjXdV4Z60PU2yv1YwetBTBb0EP1bXvfDsR12+ZPFdm4VukU9FTDzMlSJmB1m18G4OBoRZzy9HNOZ1dq7k3h9LjtANj98TcBeGGHkD/jCgja0T+BhvqfU8hDntRTzSoYqn8qIO+KCrD81eBQq8cBpb3t/xBgRUXqXa819iHqdrjVRHiX/mk8N2/7GvX3LwN7VSTYf5Bxkmg7rlU6BT2JaHJMlwjYb/7HA7B6ybNTU47LTssKtzOAlQkYYCJuf8m+M/rnhmhL/bwE5uKQKRKY0upOgFw7IcFL0prW7pyHePpegV7uyeT06lx1q3lNPLGiBd1DINd6Ul/ay54+RP1uAHbVrO/bKrNX6Gu0trwEnedJYAdlx/6MY5VOQR972GlACgRM1N8VzTPuU9yWYMNqRr8iRr+7ifhXAZiYW2pZPjkhEKr/DQW+MiGBfTJJ/Jl95zxU/2QBDgDktjI2WiLyYN8lUntUljMRtjMvtnv1QD+OXf3lDaa31vff96npO+ff/t4L3v2anbzPzpf69D35cT/jWKVT0Mcddc6fJgEX7lnbLsEmAP5aIWoEAEcBeHPHSpwiPgLMLHQNtbpcILVKCofjbEtdIIeWsf4Oduc8VD/a7dLPejJpVx0HfqLa7/ZLwdsrEtwyawD7nm6/8Pb1zBb0x56uHjt/veb2z5PHk9j56sum2Y3SXqVT0IcKEztlnMA4hf0bAD4V5bYeFqNlyrNtzs0A2LU3q0nOlfiwNDPUb0qrOwvkIk+C1yRttolRC7hjntSXNtS/RIGXVSAHz3XKvV97+th+72uozi131eprG8DnPZmMc+erLzvW1ah9YLBLedmRx+42AAU9EawcNCMEOoXdVrefSNhuu/tthSueD2CYg2kLIyG36lZnAHBiazFhZhy+g4AqvAb8qQqCCRGEScFpC1EFOLABvUyAX8W5K9Cx/X66J8HJw/jRKeh2rQ+QTbyO2ujDjJlEnzRX6RT0JCLIMbNGwA772BWy2wDYt7znpLSMySErdHI0gEEzfs2LhNxW5War/dP3t8uYbOcwjhAI1f+hQhdPyOT3kjLJRAjAHwG179RnexLEntMhVP8kAQ4c5nu8+f1sQfe/IcCnKhJY7QGnnjRX6RR0p0JPY8ZIYH50D9ZKml4VlXqM2xw7af7ogNXVFkdi/rVIyJ35Phg3HI7XH4Ep9S8BZPWE1O3bdNbmAAAgAElEQVQMRexPU/2PN4H3C7BeCbiovI40r6NObifmQzyxAtMn5nGFJ8Hp/Y7ZFvQJzD+7gdX/U8H854v8YZidr36nHLpdWqt0CvrQIWLHnBKwHNXvS2i1/rMoi10/6TttG/Kfo/KqtiL/Tk55060BCTS0ehAgS9uH1Qbs3rN5Q/1VgD5RRukfRv1e3nOyqEGo/mn2i+sch+W6DtMW9DLwAwWOdiHX/Vz+prVKp6D3+8axXZEIdK7Wr41WyKP6b9+/bYvU0r6u6+n8rn/TgKv5UW1k/4wQWFcJ02FdsPSuTbS+IZBGWQLLtpjqM+hhubagl4CNAH3Uk8lUE+4MCieNVToFfdCosH2RCBwXJWkxn0e9v27X1OxKzlxZrMZ58r5IMc2Fr+2EL2XgqrIEp47q1Ew2OD0KkI3Xla991Hl69R/ksNxaQdd3KXDIOAvX9PLLfp7GKp2C3k8k2KboBDrF9rpBc05H8CwNra38D5gFk0Je9LdrSP+b6p+iwPtG3Xpvi2gJcm8L+FK3fO1DmjhUt34Py5mgK/QFZcgiT4JeO19D2RJ3p6RX6RT0uCPG8fJMwHJOW2IYO60+OylGL7+tuppVOmtnwtoCwHZRp1FX/73m5s9zSmDUrfd2hbQSSpbKdffZ+drHha2fw3Im6GXgjS3gzxMO5G/vh1XSq3QKej9RYBsSWEugXR1qEFH3AExF2/ev7oBpBVq6FrQgcBLoh8DaXOu4epD73LMrpAnw0hakmdTJ+X586dYmOixn19us6Mqzfok2QRfgPQJc2lnhbdi50uqX5Cqdgp5WFDlPngi0Rd0O4fRTTMIKsVwEIPHsXnmCTF/6I2Bb1ABO6yZ6s0doqn9MC/Ju+/87K6SF6n8T0NM9mby9v1nTa7X2u7qc6Un9r3/e1mh1eQlyQgXYUCTITKbEJFfpFPT03kvOlC8CloBm+i/GPg7MHQ5gR0drs+crKgX1pp8T4lGbm0qQs8odwmjIQvUfnQJeuZ4ED7uIMFT/GES/iJSg15UlOHeNVm8oQV7mSfC3Ltq8LpuSWqVT0LP2JtBe1wh0Hmq7E8BlAO7vMNJW81bO9EcAPuOa8bQnPwTaoq7A1TqrYpkAWwuwf7dVvGptswb0Z54EVjTI6aepteUt6Anmh05XZ9NfejLZrqTotO2dxiW1SqegZ+YVoKGOE7BVuBVN2TWy8y4AG0bJYX4D4L3RPXTH3aB5WSZgot6co2JZGbinS4UzhFp9CyAnexJMlyN1/WnvNMx8NdAzPZns57OXc24lsUqnoDsXZhqUAwLbRMJuJ9m3BbAfgAnb2cyBb3QhZwSaWj1OIQsrElia4Uw8a9S/pgTZuwUNBLhVgT8Acu88qWfmkGkSq3QKeiZeXxqZYQI8EJfh4BXB9Cmtni8oPeJJ3Sr4ZeJpaO16hb5Yod9RyKQAWwhk+hqoQu/LisDHvUqnoGfi9aWRGSZgGeLsL5pDM+wDTc8xgVD9/0+AC7ptx7votqq/QQN4UgF4s06426q3Cd2+U+AB3OxJ3XJIOPfEvUqnoDsXYhqUMwKWNOZJAB/PmV90JycEptR/oAXsNV+CX2fBpaZWj29C/kUgv/ekvs4DcaFWPwaULGcE2qfjXfMxzlU6Bd216NKevBH4cpQ8xv7NhwScIqCKcgN+o4KgIoKmU8bNYUyoteuB1gYK/HpCJo/sx+b26Xgri+xJ4NQv13Gu0ino/bwNbEMCwxOwsqd2Z/3u4YdgTxJIhsBq9bctATdPSLB1MjPEO2p7u91Ot7cgU/MGEOdQfRPyU4BnJ6iJ18LhRotrlU5BH44/e5FAvwT+G8D/BvD7fjuwHQmkRSC6AnakJ8Hb0ppzlHmmtHpgCaW9m9Cf2TiDCLq170xQs/bw3ODjjOJDt75xrdIp6HFHhuORwFoCJWB6G7MMoEUwJOAagVBrJyqwmWs53OfiZKfbgdYNTYgVOhpY0Nvjtg/P2X8rMH3/XoBv2v+2fw/6i0IccY1jlU5BjyMSHIMEuhN4MYBvA3gRAZGAiwQa6l+kkN95Uj/bRfs6bWpvt1vu9hA4z66mxSW87drqo/ySMCq/OFbpFPRRo8D+JDA3gV2i2umWQY4PCThHwOWiLLNh2en2Fko728l2W822gBVZSiTTT/BHXaVT0PuhzDYkMByBfQFYrnf7Nx8ScI6A60VZOoFFp9u/N/MJq7SXJ3X7hTlXz6irdAp6rl4HOuMYgSUALP2r/ZsPCThFIEtFWerqb/AC4Enbbm9AbnU5WcyoQR5llU5BH5U++5PA3ATsmsw8ACcQEgm4RiBLRVnap9sVrR/kdXXefj9GWaVT0F37U0Z78kSgncDCqUQWeQJMX4Yn0NDapwGtZKEoS/t0u6JkVQ2dTeU6fDSe3XPYVToFPa4IcBwSeC4BCjrfCmcJhFr7uaB1TkUmr3TWSLtWFuVuF5QOVOjhefx2Ppv/sKt0CrrLbzJtyzoBCnrWI5hT+0OtLRXoyysSLHLdRdtuF5SsVOrPrOjKhASHuG5zHPYNs0qnoMdBnmOQQHcCFHS+Gc4RUK1t1YA+UIFsLVJ/0DkDZxnU3m5vQd4U593zDPi9jwJLBtmRoKC7HlXal2UCFPQsRy+ntjfUv0Yhv/Ckvsx1F9vb7Y8DG74Acmse756vKwaDrtIp6K6/0bQvywQo6FmOXg5tb+iCgxVlW/XtkAX3Vqt/bBmyiwBXD7pazYJ/vWwc9Fs6Bb0XUf6cBIYncB6AJ1gLfXiA7BkvgYb6l7Sgf5mQyaPjHTmZ0Ww3QSA/b0AnivT9vJPmIKt0Cnoy7yFHJQEjYKeH7wJwKXGQgAsEQvV/qNDFEzJpGdecfxrqT5ahrwghpxbp+3lnYAZZpVPQnX+laWCGCawEsDuA+zPsA03PCQFVeA34UxUEEyIIXXcr1NqugH7Sk2CnvOZu7zcG/a7SKej9EmU7EhiMwDYAbgOwcLBubE0CyRCY0urOArnIk+A1ycwQ76ihVtuH9v4n79nhepHrd5VOQe9Fkj8ngeEI2F3ZXQEcOFx39iKBeAlMafVwQHackODQeEdOZrQp9e8RyDEAzipCdrheFPtZpVPQe1Hkz0lgOAL8fj4cN/ZKiIDV/BZg/QkJjk1oitiGVa3+TRPysyZwewmyxSB3sWMzwrGB+lmlU9AdCxrNyQ0Bfj/PTSjz4ciU+pdm5WBZUzc5WdH62ybw6xJat3qy6jv5iMJoXvRapVPQR+PL3iTQjQC/n/O9cI5Alg6WhVr9ukK+PiHBp5wDOUaDeq3SKehjDA6nzi0Bfj/PbWiz6dga9b+cla3rNbpguzJKt1ck2DybtJO1el2rdAp6suw5ejEJWIa4jQB8uJju02uXCNi3cwV2K6N1Qha2rkOtnQWoeBIc7xJHV2xZ1yqdgu5KlGhHnggw5WueoklfUiUQqv9wC623zpNV96U6cYYmC7V2Xws4eZ7Uv9JpNgU9Q0GkqZkhQEHPTKhoqEsEQvU/AegrPJn8R5fscskW1a3mNfG4Vck7oiLBjRR0l6JDW/JIgIKex6jSp0QJNNTfU4GbSpD/U5b6BYlOluHBp7R2YQlARepHzHaDK/QMB5amO0uAgu5saGiYiwRC9S2BzCcF2KsiwS0u2uiCTQ3132ElZD2sv73IytUUdBeiQhvyToCCnvcI079YCdjJbQDf9KT+sVgHztFgttUe4vFflIAls7fa225yhZ6jgNMVZwhQ0J0JBQ1xnUCo1Y8VPVd7PzFqaO1Ca9dtq52C3g9BtiGB4QhQ0Ifjxl4FJBCtzm/2pL68gO735XKvrXYKel8Y2YgEhiJAQR8KGzsVjUBTa8tbwG7M1T535PvZaqegF+1PDv1NkwAFPU3anCuTBKJT7TeXgGPLEpybSSdSMLqfrXYKegqB4BSFJUBBL2zo6XgnActSZ/89T4L2n4npH0en2s8R4O081T73OxOqf5oAi8pYf4dup9pn9+ShOP75I4H4CVDQ42fKETNIYG5B56n2XuGc0upOArmjBZw9T4LTe7W3n1PQ+6HENiQwGAEK+mC82DqnBKIa7C+dkOCAtos81d472M/oplt6aNzRQunUCalf3rvHTAsKer+k2I4E+idAQe+fFVvmmICdzgZwbhkv2F7kwTUz2+3Tq3Oeap8j7qqbrtdA878A/IcnwTmDvB4U9EFosS0J9EeAgt4fJ7YqAAE71NUCMCH1I3iqvXfAQ/UtU94vPAmO69362S0o6IMSY3sS6E2Agt6bEVsUhIDqwvkhnr4XwB8F2JWn2ucO/JTWLi8BWpH6wcO8HhT0YaixDwmsmwAFnW8ICXQQCHWTPVpovb4M3MNT7d1fjTXqn1MCtvMk2HPYl4eCPiw59iOBuQlQ0Pl2kAAJ9E0gVP8jAP6lgvKbRf78l747zmpIQR+WHPuRAAWd7wAJkMCIBKa09n6gdYoH780ij6wcZTgK+ij02JcEuhPgCp1vBgmQQE8C4UzinWMV+pYJmfx+zw49GlDQRyXI/iTwXAIUdL4VJEAC6yQwpQteJyjdAeAT3qxMesOio6APS479SIBb7nwHSIAEhiCwWmtbl6F3KPTECZm8coghunahoMdFkuOQwFoCXKHzbSABEuhKQHXDBSEmbGV+xYQE58WJiYIeJ02ORQIzBCjofBNIgAS6EgjVvx3Q73gyuTRuRBT0uIlyPBKgoPMdIAES6EIgVP/LCkxOSHB4EoAo6ElQ5ZhFJ8AVetHfAPpPArMITKn/GQGqngT7JgWHgp4UWY5bZAIU9CJHn76TwCwCoVaXAfJ6T4K3JgmHgp4kXY5dVAIU9KJGnn6TwHNX5h8W4KAKpt4i8uSqJAFR0JOky7GLSoCCXtTI028S6CAwpdUDBXJGE/KW+VJ/IGk4FPSkCXP8IhKgoBcx6vSZBDoIRFngjlO03jIhq76bBhwKehqUOUfRCFwK4A8d19eK5j/9JYFCE2hq7UMt6MkAzo8rC1w/QCno/VBiGxIYjMDdAFYA+Mpg3diaBEgg6wQaWjtfoTu1oAfNk8lfpekPBT1N2pyrCAT2AbAEwC5FcJY+kgAJzBB4SjfdZD6aVwiwqozgIBE00mZDQU+bOOfLOwH7fr4FgEPy7ij9IwESmCEQ6ia7CFpXKHC1J8Ep4+JCQR8Xec6bVwL8fp7XyNIvEuhCoKHVAxRypUAPrMjkVeOEREEfJ33OnUcC/H6ex6jSJxLoQiBU/1QB9leUDvLkUfuzP9aHgj5W/Jw8ZwT4/TxnAaU7JNCNgCoqTfi2xb5gNcoHbSB/ftQFUhR0F6JAG7JEYE8At8xh8BcBPMPv51kKJ20lgcEIrNHqy0qQKwTy/YrUjxqsd7KtKejJ8uXo+SJgYn4zALtfevos19o/uxrAe/PlNr0hARIwAk31T20BR5Ygp5Wl/u+uUaGguxYR2uM6gdMALAKwA4DVXUR9rtW7637RPhIggXUQCLV6hkAOUOD/ppksZpCgUNAHocW2JDBD4MIIxBHrALKurXlyJAESyAgBVX/bBnCRAJPPoHLEBvJI3VXTKeiuRoZ2uUxgPoB7Adj2um2/z37a2+97reN7u8v+0TYSIAEADa0epJDPADjJk+Bc16FQ0F2PEO1zlcBJAGz7vZto2/f1pXP8zFV/aBcJkEBEQBWlEL6tyl8HlBa7cCWtn+BQ0PuhxDYk0J1AeyVuwm7ZobaKDsttD+AaAMsJjgRIIFsELOsb0DIx/24ZwWIRtLLiAQU9K5Gina4SOBXAoQCsCMObbWsOwDJXjaVdJEACcxMI1bc6DMsUsnhC6pdnjRUFPWsRo72uETgRwPsAbADg/uh//8k1I2kPCZDA3ASe0s1qz0PjQgX8CnC4SPDrLPKioGcxarTZFQJWiOUDAC4DYMJu2+6HAfh8tFJ3xU7aQQIkMAeBKH3rwQq9ypNJ+3Oc2YeCntnQ0fAxEnghgIsBKIAPAuhckZuoHwDgVgDHdLmrPkazOTUJkEAngVBrJwJ6VAt6yTyZtM9lmX4o6JkOH40fA4FzokxwJuj2/bzbY9fa7IrL7gCu7JJVbgxmc0oSIIE2AdUFGzZRukQhLwjROPT58tjv80CHgp6HKNKHpAlsB+AgAAcC+CmArwH4dB+T2ul3+62f99H7gMUmJJAGgVBrbwT0khZw0zwJPpLGnGnNQUFPizTnySKB/wPgnwC8EsAV0Wr7vgEdaV9ts9W8fXPnQwIkMCYCU1o9UiDntKCHzpPJL4zJjMSmpaAnhpYDZ5xA+8CbVVAb9bd4G8u+rXOlnvGXguZnl0BD/c+1gFd6KB8i8uefZ9eTuS2noOcxqvRpFALtA282hp1gf3iUwTr6Mh1sTCA5DAkMQkB10x0aaF4qwE8rEtif6dw+FPTchpaODUHg7QA+C+Bz6zjwNsSwf+3SFnVLPJP5E7WjgGBfEkiDQEOr71PIJSXosWWZbBdVSmPqscxBQR8Ldk7qIAHbFreMb3aP3GqeJ/V8LCq/asVdTNQfTGoijksCRSawRv1zSsDbATnUk/q3isCCgl6EKNPHdRFY153yJMlZ8RYr4sJUsUlS5tiFI/A/uvGLPVQuEejjZbQOFVn1ZFEgUNCLEmn62Y2AXSs7JEoSM9ed8iTJdRZzuRbAGUlOxrFJIO8E1mj19BLkUEDO96ReuD9PFPS8v+H0by4CxwI4HoDVOu5W0zxNcvYXz8HRt3tebUuTPOfKDYFQq2cI5AAFLvMksFslhXso6IULOR0GcAmAl0Ui6so3bNv6twN59mfSvuOzwAtfVRLog4Cqv20DsHKnk8+gcsQG8ki9j265bEJBz2VY6dQcBGyL2wqpWKlTOwDn4tMu8NIu+OKijbSJBJwg0NDqQQqxXbaTPAks3XKhHwp6ocNfKOdtW9vuoJ4N4JOOe24Vn/YDwJPwjgeK5o2HgCpKIXxblb8OKC325NG7x2OJW7NS0N2KB62Jn8CO0TfyhQDs4NlZ8U+R2Ig8CZ8YWg6cVQKhbrIL0DIx/24ZwWIRtLLqS9x2U9DjJsrxXCGwIEq3agVV7DT7ea4YNqAdnSfhrwGwfMD+bE4CuSEQqr8EwDKFLJ6Q+uW5cSwmRyjoMYHkME4R+HC0KreCKibmq5yybjhjLLucHZbLwieD4TxkLxKYg8BTulnteWhcqIBfAQ4XCX5NWM8lQEHnW5EnApaFbV8AK6PUrT/Ok3MAsnCoL2fI6c64CazR2lll6P4KvcqTSTtfwmcOAhR0vhp5IDAfgJ1w3QOAVUfL+x1UF6/d5eE9og8OEZhS/4MCXQzIYyXgP8sSrHDIPCdNoaA7GRYaNQABE+/3AbgNwDEAVg/QN8tN24lx7HrbcVl2hLaTQJvAKt14o41QWazQIxS4B9ALPZn8Bgn1R4CC3h8ntnKTQLtm+ecLWr3sQ5guPoGXRMlyLgVQ2KQabr6itKofAs/opltW0FwM4AiBXlOGXCgS/KifvmyzlgAFnW9DFgmMq6CKq6x2ihLlWF562443Yf++q8bSLhJoE1D1d2xOr8ZlEYALK6hcKPKInYHhMwQBCvoQ0NhlrASsQtm/jbGgylid7zF5LSo2Y1nwfgvgDl5zczlcxbUt1OrfA3IEgNcCcuFTaFy0QB57orhE4vGcgh4PR46SPIHOg29XRafYk581uzNY4Zk3A3glgCsB2BW++7LrDi3PA4GmVo9rQfYEdOMS5MKyBBfnwS9XfKCguxIJ2rEuAlYz/CAAtxbs4Fscb8V2ACy5jvH7KYCbAVwQx8AcgwT6JRBqbVeg9TFAfAA3ehJYfgg+MROgoMcMlMPFTmDPSIRsq33cZU5jdy7lAT8B4CMA9gJwS8pzc7oCElij1b8tQyw/xBsFWF6W4HMFxJCayxT01FBzoiEI2Cl2u5ZGARoC3hxd2r8gkWl8TDnSLAKW2W0+GibkHwBkuSd1K47EJ2ECFPSEAXP4oQm0hedUACbsfOIj0GZ7JgD7S5cPCcRGINTaiYDae/W51agsL3J98tig9jkQBb1PUGyWKgGuzJPHbUl43h1NY9/VWfQleea5nqGp/gd05hfEbzWhy+fJ5C9z7bCDzlHQHQxKwU3iyjzdF8D+Arbtd3vsFLzdZedDAn0TaGr1oy3IPoAGQMm21+/quzMbxkqAgh4rTg42IgE7+Won2vl9d0SQQ3TfB8D2/LwxBLmCdnlIF85/Ef5ybgu6hwBXexLw0OqY3wUK+pgDwOmnCXTeMbf70nainQ8JkICjBBrqv6MFrChBbi1joyUiD65x1NRCmUVBL1S4nXTW6ny/p4DFVZwMBo0igXURUN1qXhNPrLBVeQlYUpHgRhJzhwAF3Z1YFM2So6Pa5eb3VwHYHWk+JEACjhJor8oBudXjqtzJKFHQnQxL7o2aB+BeANcB+GjuvaWDJJBhAu1VOaC7W6ZGrsrdDSYF3d3Y5NmyCyPnrDgDHxIgAUcJhOqfosABtir/I9Y7ZktZudpRU2kWAAo6X4O0CZwFoH2imn85pE2f85FAnwRC9c8WYD8BLi9LYBkb+ThOgILueIByZF7nfecvA/hUjnyjKySQGwJTWnuVQC9Q4Pcepo4UeXJVbpzLuSMU9JwH2AH3OoWcGckcCAhNIIG5CExp9QiBXKDQIydksv1pjMAyQoCCnpFAZcjM9nb6FgCsdKc9FPIMBZCmFo+A6oYLQkxcIMCLFXLkhNR/UjwK2feYgp79GI7Tg86iKZ0CbilE/xCdZP/KOA3k3CRAAusmsEZrZ5WhixS41pPgePLKLgEKenZj54Lls6ug2VU0CrgLkaENJLAOAqpbPC/E6g8KcBiAP9kumifBCkLLNgEKerbjR+tJgARIoG8Cq3WTlwpaHywBhwlwo0Iu9qT+rb4HYEOnCVDQnQ4PjSMBEiCB0QmEWnujQA9TwHKwX6wofXa+PPqb0UfmCC4RoKC7FA3aQgIkQAIxEgjV/wiAtwF4oQIXe5j/WZE/PBPjFBzKIQIUdIeCQVNIgARIIA4CoS54PVBaCmCzFnDTPAlmn3eJYxqO4RgBCrpjAaE5JEACJDAsAdXNFoZoLC0B/9SCnsG75MOSzGY/Cno240arSYAESOCvBKyASgOPLQVkKaDLKth4GWuUF+8FoaAXL+b0mARIIEcEmlpd3IIsFeBrZVSWiTyyMkfu0ZUBCFDQB4DFpiRAAiTgAgFVf5sGcAiAtwJ4BGgt82TVd1ywjTaMjwAFfXzsOTMJkAAJ9EXABLwJ7Iq1/1i/uxpofnu+PHZxX4OwUe4JUNBzH2I6SAIkkEUCU7rgkBJKbRGfFnD7pwzcJRLcn0WfaHOyBCjoyfLl6CRAAiQwEIGHdOH8F+Ev57agewjkpgr0MxTwgRAWtjEFvbChp+MkQAKuEWiob5ncVpQgt5ax0RKeVHctQm7bQ0F3Oz60jgRIoAAE7NpZE0+ssFV5CVhSkeDGArhNF2MmQEGPGSiHIwESIIFBCLRX5YDc6nFVPgg6tp1FgILOV4IESIAExkCgvSoHdHcAx3BVPoYg5GxKCnrOAkp3SIAE3CfQVP+UJnCArcr/iPWO2VJWrnbfalroOgEKuusRon0kQAK5IdB5gr0MXFWW4NTcOEdHxk6Agj72ENAAEiCBIhCwb+UAzgXkNp5gL0LE0/eRgp4+c85IAiRQIAI8wV6gYI/ZVQr6mAPA6UmABPJLgKvy/MbWRc8o6C5GhTaRAAlkmoCtykM8sQK8V57pOGbNeAp61iJGe0mABJwmsEb908rAIvtW/t88we50rPJmHAU9bxGlPyRAAmMhEOqC1wOlpQA2A+QrntTPHIshnLSwBCjohQ09HScBEoiDgOpmC0M0lpaAf2pBz5iQyQvjGJdjkMCgBCjogxJjexIgARIAYN/JG3hsKSBLAV1WwcbLWEyFr8Y4CVDQx0mfc5MACWSSQFOri1uQpQJ8rYzKMpFHVmbSERqdKwIU9FyFk86QAAkkSSDU2vGA7gvgEaC1zJNV30lyPo5NAoMQoKAPQottSYAECktgSmv/JtBPtaCfnieTJxYWBB13lgAF3dnQ0DASIAFXCIRaO1Gg728B+01I8ENX7KIdJNBJgILO94EESIAE1kGgobXzFfqqCnQ/kck/EhYJuEqAgu5qZGgXCZDAWAmootxA9VozooLJ/UTQHKtBnJwEehCgoPMVIQESIIFZBFSrf9OAXCuQn1SkfhQBkUAWCFDQsxAl2kgCJJAagSn1X1MCrlXI5Z7Uz0htYk5EAiMSoKCPCJDdSYAE8kOgqf4pLeBYhRw9IfXP58czelIEAhT0IkSZPpIACfQkoLrhgiYmfizA5WUJTunZgQ1IwDECFHTHAkJzSIAExkNgSv2rBfhvT4Ljx2MBZyWB0QhQ0Efjx94kQAI5IDCl1SMEssiT4A05cIcuFJQABb2ggafbJEACMwSmtPYqgf5YIa+ekPpPyIUEskqAgp7VyNFuEiCBWAiE6v8/hV7Dsqex4OQgYyRAQR8jfE5NAiQwXgKh+mcr8KIJCfYfryWcnQRGJ0BBH50hRyABEsgggTVaXVqGHFrG1KtFnlyVQRdoMgk8iwAFnS8ECZBAIQmEWvs50PqqJ5MnFRIAnc4dAQp67kJKh0iABHoRCLW2VKAvr0iwqFdb/pwEskKAgp6VSNFOEiCBWAio1rZqQB+oQLYWqT8Yy6AchAQcIEBBdyAINIEESCA9Ag31r1HILzypL0tvVs5EAskToKAnz5gzkAAJOEKgqf7RLci/eVLfwRGTaAYJxEaAgh4bSg5EAiTgOoFQq18H8ANPJpe6bivtI4FBCVDQByXG9iRAApkksEYXbFdG6faKBJtn0gEaTQI9CFDQ+YqQAAkUgkCotbMAFRZfKUS4C+kkBb2QYafTJFA8AqH6D7fQeus8WXVf8bynx0UgQEEvQpTpIwkUnMCUVo8SYE9PJv+x4Cjofo4JUNBzHFy6RgIkMEOgof6VAjxUluAUMiGBvBKgoOc1svSLBEjgr7tQpkUAAAFPSURBVAQa6q8sA7uLBPcTCwnklQAFPa+RpV8kQALTBFT9bZrAbRUJFhIJCeSZAAU9z9GlbyRAAmhq7XyFblSR4EDiIIE8E6Cg5zm69I0ECkxAdeH8Jv5yLqC7A3paRSavKjAOul4AAhT0AgSZLpJA0QhMqX80gCNLkFvLWO8YkZWri8aA/haPAAW9eDGnxySQewKh1u4GcJcn9Y/m3lk6SAIRAQo6XwUSIIFcEWhqbXkL2M2T+i65cozOkEAPAhR0viIkQAK5IdBQf08FbioBHylLcG5uHKMjJNAHAQp6H5DYhARIwH0CbTEX4O0VCW5x32JaSALxEqCgx8uTo5EACYyRgIk6xXyMAeDUYyVAQR8rfk5OAiRAAiRAAvEQoKDHw5GjkAAJkAAJkMBYCVDQx4qfk5MACZAACZBAPAQo6PFw5CgkQAIkQAIkMFYC/z8NNRpZIeSrjQAAAABJRU5ErkJggg==",
      //     "mediaType": "noteCanvas",
      //     "audioUrl": null,
      //     "isPinned": false,
      //     "color": "white",
      //     "info": {
      //         "txt": "",
      //         "title": "",
      //         "todos": [
      //             {
      //                 "txt": "canvas with todos!",
      //                 "isChecked": false
      //             },
      //             {
      //                 "txt": "",
      //                 "checked": false
      //             }
      //         ]
      //     },
      //     "labels": [],
      //     "id": "3HzrF"

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
