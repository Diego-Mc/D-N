import { booksService } from '../services/books.service.js'

import LongText from '../cmps/long-text.cmp.js'
import reviewAdd from '../cmps/review-add.cmp.js'
import bookReviews from '../cmps/book-reviews.cmp.js'

export default {
  template: `
    <section v-if="book" class="book-details">
      <div class="book-data">

        <router-link to="/booky" class="back-btn">
          &lt;- Library
        </router-link>

        <div class="book-nav">
          <router-link :to="'/booky/'+ prevId">prev book</router-link>
          <router-link :to="'/booky/'+ nextId">next book</router-link>
        </div>

        <img class="book-cover" :src="book.thumbnail" alt="" />
        <h3 class="book-title">{{book.title}}</h3>

        <div class="book-extras">
            <h4 class="book-author">By {{book.authors?.at(0) || 'Unknown'}}</h4>
            <h4 class="book-date">Published: {{book.publishedDate}}</h4>
            <h4 class="book-date">Page count: {{book.pageCount}}</h4>
            <p>{{ book.readingLength }}</p>
        </div>

        <long-text :txt="book.description" />

        <p>{{ book.listPrice.isOnSale }}{{ price }}</p>


      </div>

        <book-reviews :book="book" />


        <review-details v-if="selectedReview" :review="selectedReview"/>
        <review-add v-else :book="book" />

    </section>
  `,
  data() {
    return {
      book: null,
      nextId: null,
      prevId: null,
      selectedReview: null,
    }
  },
  created() {
    this.loadBook()
  },
  methods: {
    loadBook() {
      const id = this.$route.params.id
      booksService
        .get(id)
        .then((book) => {
          this.book = book
          booksService.getPrevNextBookIds(book.id).then((nextPrevId) => {
            this.nextId = nextPrevId.next
            this.prevId = nextPrevId.prev
          })
        })
        .catch((err) => console.log(err))
    },
  },
  computed: {
    readingLength() {},
    recency() {
      const date = new Date()
      const diff = date.getFullYear() - this.book.publishedDate
      if (diff > 10) return 'Veteran Book'
      if (diff < 1) return 'New!'
    },
    priceColor() {
      let color = ''
      if (this.book.listPrice.amount > 150) return (color = 'red')
      else if (this.book.listPrice.amount < 20) return (color = 'green')
      return { color: true }
    },
    getRouterId() {
      return this.$route.params.id
    },
    price() {
      return new Intl.NumberFormat('he', {
        style: 'currency',
        currency: this.book.listPrice.currencyCode,
      }).format(this.book.listPrice.amount)
    },
  },
  watch: {
    getRouterId() {
      this.loadBook()
    },
  },
  components: {
    LongText,
    reviewAdd,
    bookReviews,
  },
}
