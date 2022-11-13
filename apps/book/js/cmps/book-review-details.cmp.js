import starRating from '../../../../cmps/star-rating.cmp.js'
import { eventBus } from '../../../../services/event-bus.service.js'

export default {
  props: ['review', 'book'],
  template: /* HTML */ `
    <section class="review-details round">
      <i @click="close" class="close-btn f-m bi bi-x-lg" title="Close"></i>
      <star-rating class="rating" :rating="review.rating" :limit="5" />
      <small class="book-title f-s f-clr-light">{{book.title}}</small>
      <h3 class="review-title f-m-title">{{review.title}}</h3>
      <p class="review-txt">{{review.reviewTxt}}</p>
      <small class="reviewer f-clr-light">{{review.reviewer}}</small>
      <small class="review-date f-clr-light">{{date}}</small>
    </section>
  `,
  data() {
    return {}
  },
  created() {},
  methods: {
    close() {
      eventBus.emit('unselectReview')
    },
  },
  computed: {
    date() {
      return new Date(this.review.date).toDateString()
    },
  },
  components: {
    starRating,
  },
}
