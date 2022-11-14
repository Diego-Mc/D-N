import { booksService } from '../services/books.service.js'

export default {
  template: `
    <div class="book-add">
      <label
        >Search Book
        <input
          v-model="searchTxt"
          @input="showResults"
          @change="hideResults"
          type="search" />
      </label>
      <ul v-if="searchTxt" class="">
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
    }
  },
  methods: {
    showResults() {
      const modifiedSearchTxt = this.searchTxt.split(' ').join('%20')
      booksService
        .getGoogleBook(modifiedSearchTxt)
        .then((books) => (this.results = books))
    },
    add(book) {
      this.$emit('add-google-book', book)
    },
  },
}
