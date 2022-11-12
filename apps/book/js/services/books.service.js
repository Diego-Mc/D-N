
import { utilService } from '../../../../services/util.service.js'
import { storageService } from '../../../../services/async-storage.service.js'
import booksList from './json/books-from-api.json' assert { type: "json" }

const BOOKS_KEY = 'books'
const CACHE_KEY = 'cahce'

let cache = {}
storageService.query(CACHE_KEY).then(res => {
    cache = res
})

_createBooks()

export const booksService = {
    query,
    get,
    addReview,
    deleteReview,
    getGoogleBook,
    addGoogleBook,
    getPrevNextBookIds,
    getAdvancedSearchOptions

}


function query({
    search = '',
    readingLength = undefined,
    recency = undefined,
    sale = false,
    categories = [],
} = {}) {
    return storageService.query(BOOKS_KEY).then((books) => {
        return books
            .filter((b) => {
                return b.title.toLowerCase().includes(search.toLowerCase()) || b.authors.some((a) => a.toLowerCase().includes(search.toLowerCase()))
            })
            // .filter((b) => {
            //     if (!categories.length) return true
            //     if (!b.categories) return false
            //     return b.categories.every(c => categories.includes(c))
            // })
            .filter(b => {
                if (!readingLength) return true
                return b.readingLength === setReadingLength(readingLength)
            })
        .filter(b => {
            if (!sale || b.listPrice.amout < 130) return true
            else return false
        })
        .filter(b => {
            if (!recency) return true
            const date = new Date()
            console.log(parseInt(b.publishedDate.slice(0, 4)));
            const diff = date.getFullYear() - parseInt(b.publishedDate.slice(0, 4))
            if (diff > 10) return false
            else return true
        })
    })
}

function getAdvancedSearchOptions() {
    return {
        cmps: [

            {
                type: 'radioCheck',
                info: {
                    label: 'On Sale',
                    opts: [
                        { txt: 'products on sale', val: true },
                        { txt: 'all products', val: false },
                    ],
                    key: 'sale',
                },
            },
            {
                type: 'radioCheck',
                info: {
                    label: 'Reading Length',
                    opts: [
                        { txt: 'short reading', val: 100 },
                        { txt: 'decent reading', val: 200 },
                        { txt: 'long reading', val: 500 },
                    ],
                    key: 'readingLength',
                },
            },
            {
                type: 'radioCheck',
                info: {
                    label: 'Recency',
                    opts: [
                        { txt: 'new', val: false },
                        { txt: 'old', val: true },
                    ],
                    key: 'recency',
                },
            },
            {
                type: 'checkBox',

                info: {
                    label: 'Categories',
                    opts: ['biography', 'computers', 'electronic', 'trademarks'],
                    key: 'categories',
                },
            },


        ],
    }
}

function _createBooks() {
    let books = utilService.loadFromStorage(BOOKS_KEY)
    if (!books || !books.length) {
        books = booksList.items.map(book => ({
            id: book.id,
            title: book.volumeInfo.title,
            subtitle: book.volumeInfo.subtitle,
            authors: book.volumeInfo.authors,
            description: book.volumeInfo.description,
            pageCount: book.volumeInfo.pageCount,
            readingLength: setReadingLength(book.volumeInfo.pageCount),
            publishedDate: book.volumeInfo.publishedDate,
            thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '../../assets/BooksImages/2.jpg',
            listPrice: {
                amount: parseInt(Math.random() * 100),
                currencyCode: "EUR",
            },
            categories: book.volumeInfo.categories
        }))

        utilService.saveToStorage(BOOKS_KEY, books)
    }
    return books
}

function setReadingLength(count) {
    if (count > 500) return 'Long Reading'
    if (count > 200) return 'Decent Reading'
    if (count > 100) return 'Light Reading'
}

function get(bookId) {

    return storageService.get(BOOKS_KEY, bookId)
}

function addReview(bookId, review) {
    review.id = utilService.makeId()
    return storageService.get(BOOKS_KEY, bookId)
        .then(book => {
            book.reviews ? book.reviews.push(review) : book.reviews = [review]
            return storageService.put(BOOKS_KEY, book)
        })
}

function deleteReview(bookId, reviewId) {
    return storageService.get(BOOKS_KEY, bookId)
        .then(book => {
            const idx = book.reviews.findIndex(review => review.id === reviewId)
            book.reviews.splice(idx, 1)
            return book
        })
        .then(book => {
            storageService.put(BOOKS_KEY, book)
            return book.reviews
        })
}

function addGoogleBook(book) {
    return storageService.post(BOOKS_KEY, book)
}

function getPrevNextBookIds(bookId) {
    return storageService.query(BOOKS_KEY)
        .then(books => {
            var idx = books.findIndex(book => book.id === bookId)
            var preIdx = idx - 1
            var nextIdx = idx + 1
            if (idx === books.length - 1) nextIdx = 0
            if (idx === 0) preIdx = books.length - 1
            return { next: books[nextIdx].id, prev: books[preIdx].id }
        })
}

function _save(CACHE_KEY, cache) {
    utilService.saveToStorage(CACHE_KEY, cache)
}

function getGoogleBook(searchTxt) {
    if (cache[searchTxt]) return Promise.resolve(cache[searchTxt])
    else if (!searchTxt) return Promise.resolve(null)
    return fetch(`https://www.googleapis.com/books/v1/volumes?printType=books&q=${searchTxt}`)
        .then((response) => response.json())
        .then(booksList => {
            const books = booksList.items.map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                subtitle: book.volumeInfo.subtitle,
                authors: book.volumeInfo.authors,
                description: book.volumeInfo.description,
                pageCount: book.volumeInfo.pageCount,
                readingLength: setReadingLength(book.volumeInfo.pageCount),
                publishedDate: book.volumeInfo.publishedDate,
                thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '../BooksImages/2.jpg',
                listPrice: {
                    amount: parseInt(Math.random() * 100),
                    currencyCode: "EUR",
                },
                categories: book.volumeInfo.categories

            }))
            cache[searchTxt] = books
            _save(CACHE_KEY, cache)
            return books
        })


}

