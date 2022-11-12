export default {
  props: ['book'],
  template: `
    <router-link :to="'/booky/' + book.id" class="book-preview">
      <img :src="book.thumbnail" alt="" />
      <div class="book-prev-details">
        <span class="book-meta">
          <small class="book-author f-s f-clr-light">
            {{book.authors?.at(0)}}
          </small>
          <small class="book-price f-s f-clr-light">
            {{price}}
          </small>
        </span>
        <p class="book-title f-d f-clr-dark">
          {{book.title}}
        </p>
      </div>
    </router-link>
  `,
  computed: {
    price() {
      return new Intl.NumberFormat('he', {
        style: 'currency',
        currency: this.book.listPrice.currencyCode,
      }).format(this.book.listPrice.amount)
    },
  },
}
