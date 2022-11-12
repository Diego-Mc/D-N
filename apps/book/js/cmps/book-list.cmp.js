import bookPreview from './book-preview.cmp.js'

export default {
    props:['books'],
    template: `
        <section>
          <ul class="books-list">
            <li v-for="book in books" :src="book.thumbnail"><book-preview :book="book"/></li>
          </ul>
        </section>
    `,
    methods:{
        selected(id){
            this.$emit('selected',id)
        }
    },
    components: {
        bookPreview,
    }
}
