import { booksService } from "../services/books.service.js"
import { eventBus } from "../../../../services/event-bus.service.js"

const MAX_STARS = 5
export default {
    props: ['book'],
    template: `
        <form class="flex flex-d-column align-center" @submit.prevent="submit">
            <input v-model="review.reviewer" ref="name" type="text" >
            
            <div class="flex stars-container">
                <!-- <span v-for="i in 5" :ref="'star-'+i" @click="changeRating(3)">&#9734</span> -->
                <span ref="star-1" @click="changeRating(1)">&#9734</span>
                <span ref="star-2" @click="changeRating(2)">&#9734</span>
                <span ref="star-3" @click="changeRating(3)">&#9734</span>
                <span ref="star-4" @click="changeRating(4)">&#9734</span>
                <span ref="star-5" @click="changeRating(5)">&#9734</span>
            </div>
            <input v-model="review.date" ref="datepicker" v-model="review.date" type="date" name="date"/>
            <textarea v-model="review.reviewTxt" name="" id="" cols="30" rows="10"></textarea>
            <button>Add Review</button>
        </form>
    `
    ,
    data() {
        return {
            review: {
                reviewer: null,
                rating: 1,
                date: '',
                reviewTxt: null,
            },
        }
    },
    created() {

    },
    mounted() {
        this.$refs.name.focus()
        this.initDate()
    },
    methods: {
        name() {

        },
        changeRating(rate) {
            this.review.rating = rate
            for (let i = 1; i <= MAX_STARS; i++) {
                if (i <= rate) this.$refs[`star-${i}`].innerText = '★'
                else this.$refs[`star-${i}`].innerText = '☆'
            }

        },
        initDate() {
            const date = new Date()
            const day = date.getDate()
            const month = date.getMonth() + 1
            const year = date.getFullYear()
            this.review.date = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
        },
        submit() {
            booksService.addReview(this.book.id, { ...this.review }).then(book => {
                this.book.reviews = book.reviews
                eventBus.emit('user-msg', { txt: `Added review to book "${this.book.title}"`, type: 'success' })
            })
            this.review = {
                reviewer: null,
                rating: 1,
                date: '',
                reviewTxt: null,
            }
            this.initDate()
        }

    },

}
