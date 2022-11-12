import bookPreview from './book-preview.cmp.js'

export default {
  props: ['books'],
  template: `
    <section class="books-list">
          <book-preview v-for="book in books" :book="book" :key="book.id" />
    </section>
  `,
  created() {
    console.log(this.books)
  },
  components: {
    bookPreview,
  },
}
