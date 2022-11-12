import { booksService } from '../services/books.service.js'
import { eventBus } from '../../../../services/event-bus.service.js'
import bookList from '../cmps/book-list.cmp.js'
import bookDetails from './book-details.cmp.js'
import bookFilter from '../cmps/book-filter.cmp.js'
import bookAdd from '../cmps/book-add.cmp.js'

export default {
  template: `
        <section class="books-main" v-if="books">
            <!-- <book-add @add-google-book="addBook"/> -->
            <book-list v-if="!isBookSelected" :books="this.books" @selected="selectBook" />
            <book-details v-else @show-books="resetSelectedBook"/>
        </section>
    `,
  data() {
    return {
      books: null,
      filterBy: { name: '', fromPrice: 0, toPrice: 1000 },
      isBookSelected: false,
    }
  },
  created() {
    booksService
      .query()
      .then((books) => {
        this.books = books
      })
      .then(() => this.checkSelectedBook())
  },
  methods: {
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
    checkSelectedBook() {
      this.isBookSelected =
        this.$route.matched[1] && this.$route.matched[1].name === 'details'
    },
  },
  booksToShow() {
    const regex = new RegExp(this.filterBy.name, 'i')
    console.log(this.books)
    return this.books.filter((book) => {
      return (
        regex.test(book.title) &&
        book.listPrice.amount > this.filterBy.fromPrice &&
        book.listPrice.amount < this.filterBy.toPrice
      )
    })
  },
  computed: {},
  watch: {
    '$route.matched': {
      handler(val) {
        this.checkSelectedBook()
      },
    },
  },
  components: {
    bookList,
    bookDetails,
    bookFilter,
    bookAdd,
  },
}
