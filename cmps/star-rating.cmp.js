export default {
  template: /* HTML */ `
    <section class="star-rating">
      <i class="prevent bi bi-star-fill" v-for="i in rating" :key="i"></i>
      <i class="prevent bi bi-star" v-for="i in limit-rating" :key="i"></i>
    </section>
  `,
  props: ['rating', 'limit'],
  methods: {
    className(i) {
      return {
        'bi bi-star': i > this.val,
        'bi bi-star-fill': i <= this.val,
      }
    },
  },
}
