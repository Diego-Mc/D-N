import { booksService } from '../services/books.service.js'
import { eventBus } from '../../../../services/event-bus.service.js'

export default {
  props: ['book'],
  template: `
        <section class="review-list" v-if="book">
            <article class="review-preview" v-for="review in book.reviews" :key="review.date">
                <small class="reviewer-name f-s f-clr-light">{{review.reviewer}}</small>
                <h3 class="review-title f-d f-clr-main">Diego{{review.title}}</h3>
                <span class="review-rating">{{review.rating}}</span>

                <p class="review-text f-s f-clr-light">sdjkfhjdssgsgslk dsfgjhklj kljdfsglkh dshfgkl{{review.reviewTxt}}</p>
                <button class="review-delete-btn" @click="onDeleteReview(review.id)">X</button>
            </article>
        </section>
    `,
  methods: {
    onDeleteReview(reviewId) {
      booksService
        .deleteReview(this.book.id, reviewId)
        .then((reviews) => {
          this.book.reviews = reviews
          eventBus.emit('user-msg', {
            txt: `Review for the book '${this.book.title}' was deleted.`,
            type: 'success',
          })
        })
        .catch(() =>
          eventBus.emit('user-msg', { txt: 'Delete Failed.', type: 'fails' })
        )
    },
  },
}
