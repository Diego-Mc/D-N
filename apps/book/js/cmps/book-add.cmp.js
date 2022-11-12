import { booksService } from '../services/books.service.js'

export default {
    template: `
    <div class="book-add-container flex flex-d-column align-center">
        <div class="flex flex-d-column align-center">
            <label>Search Book</label>
            <div>
                <input v-model="searchTxt" @input="showResults" @change="hideResults" type="search"/>
                <button @click="showResults">show results</button>
            </div>
        </div>
        <ul v-if="isShowResults">
            <li class="flex" v-for="(res, index) in results" :key="index">
                <span>{{res.title}}</span>
                <button @click.prevent.stop="add(res)">+</button>
            </li>
        </ul>
    </div>
    `,
    data() {
        return {
            results: [],
            searchTxt: null,
            isShowResults: false,
        }
    },
    methods: {
        showResults() {
            const modifiedSearchTxt = this.searchTxt.split(' ').join('%20')
            booksService.getGoogleBook(modifiedSearchTxt).then(books => this.results = books)
            this.isShowResults = true
        },
        add(book) {
            this.$emit('add-google-book', book)
        },
        hideResults() {
            // this.isShowResults = false
        }
    }
}