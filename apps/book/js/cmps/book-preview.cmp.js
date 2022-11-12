export default {
  props: ['book'],
  template: `
        <router-link :to="'/booky/' + book.id" class="book-prev flex">
          <img :src="book.thumbnail" alt="" />
          <div class="book-prev-details">
            <p>{{book.title}}</p>
            <p>{{ new Intl.NumberFormat('he', { style: 'currency', currency: book.listPrice.currencyCode }).format(book.listPrice.amount)}}</p>
          </div> 
        </router-link>
    `,
}

