export const utilService = {
  saveToStorage,
  loadFromStorage,
  makeId,
  toCapitalCase,
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
  return JSON.parse(localStorage.getItem(key))
}

//TODO: util for params

function makeId(length = 5) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function toCapitalCase(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()
}
