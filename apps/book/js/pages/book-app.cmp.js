import { booksService } from '../services/books.service.js'
import { eventBus } from '../../../../services/event-bus.service.js'
import bookList from '../cmps/book-list.cmp.js'
import bookDetails from './book-details.cmp.js'
import bookFilter from '../cmps/book-filter.cmp.js'
import bookAdd from '../cmps/book-add.cmp.js'

export default {
  template: `
        <section v-if="books">
            <book-add @add-google-book="addBook"/>
            <book-filter v-if="!selectedBook" @filtered="setFilter"></book-filter>
            <book-list v-if="!selectedBook" :books="booksToShow" @selected="selectBook" />
            <!-- <book-details v-else :book="selectedBook" @show-books="resetSelectedBook"/> -->
        </section>
    `,
  data() {
    return {
      books: null,
      filterBy: { name: '', fromPrice: 0, toPrice: 1000 },
      selectedBook: null,
    }
  },
  created() {
    booksService.query().then((books) => {
      this.books = books
    })
  },
  methods: {
    selectBook(id) {
      this.selectedBook = this.books.find((book) => book.id === id)
    },
    setFilter(filterBy) {
      this.filterBy = filterBy
    },
    resetSelectedBook() {
      this.selectedBook = null
    },
    addBook(book) {
      booksService.addGoogleBook(book).then((book) => {
        eventBus.emit('user-msg', { txt: 'book added!', type: 'success' })
        this.books.push(book)
      })
    },
  },
  computed: {
    booksToShow() {
      const regex = new RegExp(this.filterBy.name, 'i')
      return this.books.filter((book) => {
        return (
          regex.test(book.title) &&
          book.listPrice.amount > this.filterBy.fromPrice &&
          book.listPrice.amount < this.filterBy.toPrice
        )
      })
    },
  },
  components: {
    bookList,
    bookDetails,
    bookFilter,
    bookAdd,
  },
}
