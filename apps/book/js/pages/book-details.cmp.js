import { booksService } from '../services/books.service.js'

import LongText from '../cmps/long-text.cmp.js'
import reviewAdd from '../cmps/review-add.cmp.js'
import bookReviews from '../cmps/book-reviews.cmp.js'
import bookReviewDetails from '../cmps/book-review-details.cmp.js'
import { eventBus } from '../../../../services/event-bus.service.js'

export default {
  template: `
    <section v-if="book" class="book-details">
      <div class="book-data">
        <router-link to="/booky" class="back-btn"> &lt;- Library </router-link>

        <div class="book-nav">
          <router-link :to="'/booky/'+ prevId">prev book</router-link>
          <router-link :to="'/booky/'+ nextId">next book</router-link>
        </div>

        <img class="book-cover" :src="book.thumbnail" alt="" />
        <h3 class="book-title">{{book.title}}</h3>

        <div class="book-extras">
          <h4 class="book-author">By {{book.authors?.at(0) || 'Unknown'}}</h4>
          <h4 class="book-date">Published: {{date}}</h4>
          <h4 class="book-date">Page count: {{count}}</h4>
          <p>Price: {{ price }}</p>
        </div>

        <long-text :txt="book.description || 'Description is missing.'" />


      </div>

      <book-reviews
        @selectedReview="doSelectReview"
        :selectedReview="selectedReview"
        :book="book" />

      <book-review-details
        v-if="selectedReview"
        :review="selectedReview"
        :book="book" />

      <review-add v-else-if="isCompose" :book="book" />

      <section v-else class="review-details preview round">
        <h1>No review selected</h1>
        <p>select a review to view</p>
        <button @click="setIsCompose(true)">or add a new review</button>
      </section>
    </section>
  `,
  data() {
    return {
      book: null,
      nextId: null,
      prevId: null,
      selectedReview: null,
      isCompose: false,
    }
  },
  created() {
    this.loadBook()
    eventBus.on('unselectReview', () => (this.selectedReview = null))
    eventBus.on('closeCompose', () => (this.isCompose = false))
  },
  methods: {
    loadBook() {
      const id = this.$route.params.id
      booksService
        .get(id)
        .then((book) => {
          booksService
            .getPrevNextBookIds(book.id)
            .then((nextPrevId) => {
              this.nextId = nextPrevId.next
              this.prevId = nextPrevId.prev
            })
            .then(() => (this.book = book))
        })
        .catch((err) => console.log(err))
    },
    doSelectReview(review) {
      this.selectedReview = review
    },
    setIsCompose(force) {
      this.isCompose = force ?? !this.isCompose
    },
  },
  computed: {
    count() {
      if (!this.book.pageCount) return 'Unknown'
      return (
        this.book.pageCount +
        (this.book.readingLength ? ` (${this.book.readingLength})` : '')
      )
    },
    date() {
      return (
        new Date(this.book.publishedDate).toDateString().slice(3) +
        (this.recency ? ` (${this.recency})` : '')
      )
    },
    recency() {
      const date = new Date()
      const diff =
        date.getFullYear() - new Date(this.book.publishedDate).getFullYear()
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
      const priceAmount = new Intl.NumberFormat('he', {
        style: 'currency',
        currency: this.book.listPrice.currencyCode,
      }).format(this.book.listPrice.amount)

      return priceAmount + (this.book.listPrice.isOnSale ? ' (SALE)' : '')
    },
  },
  watch: {
    getRouterId() {
      // this.book = null
      this.loadBook()
    },
  },
  components: {
    LongText,
    reviewAdd,
    bookReviews,
    bookReviewDetails,
  },
}
