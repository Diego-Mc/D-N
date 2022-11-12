import { booksService } from "../services/books.service.js"
import { eventBus } from "../../../../services/event-bus.service.js"


export default {
    props: ['book'],
    template: `
        <ul class="book-reviews" v-if="book">
            <li v-for="review in book.reviews">
                <p>{{review.reviewer}}</p>
                <p>{{review.date}}</p>
                <ul class="flex" style="color:#e1ad01;">
                    <li v-for="index in +review.rating" :key="index">
                        <span>&#9733</span>
                    </li>
                </ul>
                <p>{{review.reviewTxt}}</p>
                <button @click="onDeleteReview(review.id)">X</button>
            </li>
           
        </ul>
    `,
    methods: {
        onDeleteReview(reviewId) {
            booksService.deleteReview(this.book.id, reviewId).then(reviews => {
                this.book.reviews = reviews
                eventBus.emit('user-msg',{ txt: `Review for the book '${this.book.title}' was deleted.`, type: 'success' })
            }).catch(() =>  eventBus.emit('user-msg',{ txt: 'Delete Failed.', type: 'fails' }))
        }
    },

}