import { booksService } from '../services/books.service.js'

import LongText from '../cmps/long-text.cmp.js'
import reviewAdd from '../cmps/review-add.cmp.js'
import bookReviews from '../cmps/book-reviews.cmp.js'


export default {
    template: `
        <section v-if="book" class="book-details grid">
            <div class="book-details-text">
                <div class="flex space-between">
                    <router-link :to="'/booky/'+ prevId">prev book</router-link>
                    <router-link :to="'/booky/'+ nextId">next book</router-link>
                </div>
                <h3>{{book.title}}</h3>
                <h4>By {{book.authors[0]}}</h4>
                <div class="book-tags flex" style="gap:10px;font-style:italic;color: rgba(20,20,20,.65);">
                    <p>{{ book.readingLength }}</p>
                    <p>{{ recency }}</p>
                </div>
                <div class="flex" style="gap:10px">
                    <p :class="priceColor" style="line-height:34px">{{ new Intl.NumberFormat('he', { style: 'currency', currency: book.listPrice.currencyCode }).format(book.listPrice.amount)}}</p>
                    <p v-if="this.book.listPrice.isOnSale"><img style="height:30px" src="../../assets/imgs/sales.png"/></p>
                </div>
                <long-text v-bind:txt="book.description"/>
                <router-link to="/book" @click="showBooks" class="prev-btn">back </router-link>

                <book-reviews :book="book"/>
            </div> 
            <img :src="book.thumbnail" alt="" />
            <div>
            <review-add :book="book"/>
            </div>
        </section>
    `,
    data() {
        return {
            book: null,
            nextId: null,
            prevId: null,
        }
    },
    created() {
        this.loadBook()
    },
    methods: {
        showBooks() {
            this.$emit('show-books')
        },
        loadBook() {
            const id = this.$route.params.id
            booksService.get(id)
                .then(book => {
                    this.book = book
                    booksService.getPrevNextBookIds(book.id)
                        .then(nextPrevId => {
                            this.nextId = nextPrevId.next
                            this.prevId = nextPrevId.prev
                        })
                })
                .catch(err => console.log(err))
        },
    },
    computed: {
        readingLength() {
          
        }, recency() {
            const date = new Date()
            const diff = date.getFullYear() - this.book.publishedDate
            if (diff > 10) return 'Veteran Book'
            if (diff < 1) return 'New!'
        }, priceColor() {
            let color = ''
            if (this.book.listPrice.amount > 150) return color = 'red'
            else if (this.book.listPrice.amount < 20) return color = 'green'
            return { color: true }
        }, getRouterId() {
            return this.$route.params.id
        }
    }, watch: {
        getRouterId() {
            this.loadBook()
        }
    },
    components: {
        LongText,
        reviewAdd,
        bookReviews
    }
}


