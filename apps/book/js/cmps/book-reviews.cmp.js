import { booksService } from '../services/books.service.js'
import {
  showErrorMsg,
  showSuccessMsg,
} from '../../../../services/event-bus.service.js'
import starRating from '../../../../cmps/star-rating.cmp.js'

export default {
  props: ['book', 'selectedReview'],
  template: `
        <section class="review-list" v-if="book">
          <div v-if="!book.reviews.length" class="preview">
            <h1>No reviews</h1>
            <p>Support our app by adding one!</p>
          </div>

            <article v-else class="review-preview" v-for="review in book.reviews" :key="review.id" @click="selectReview(review)" :class="{selected: review.id === selectedReview?.id}">
              <i
        @click.stop="onDeleteReview(review.id)"
        class="trash-icon bi bi-trash"
        title="Delete review"></i>
                <small class="reviewer-name f-s f-clr-light">{{review.reviewer}}</small>
                <h3 class="review-title f-d f-clr-main">{{review.title}}</h3>
                <span class="review-rating">
                <star-rating :rating="review.rating" limit="5"/>
                </span>
                <p class="review-text f-s f-clr-light">{{review.reviewTxt}}</p>
            </article>
        </section>
    `,
  methods: {
    selectReview(review) {
      this.$emit('selectedReview', review)
    },
    onDeleteReview(reviewId) {
      booksService
        .deleteReview(this.book.id, reviewId)
        .then((reviews) => {
          this.book.reviews = reviews
          showSuccessMsg(
            `Review for the book '${this.book.title}' was deleted.`
          )
        })
        .catch((e) => showErrorMsg('Delete Failed.'))
    },
  },
  components: {
    starRating,
  },
}
