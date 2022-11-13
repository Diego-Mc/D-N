import { booksService } from '../services/books.service.js'
import {
  eventBus,
  showSuccessMsg,
} from '../../../../services/event-bus.service.js'
import textArea from '../../../../cmps/text-area.cmp.js'
import textBox from '../../../../cmps/text-box.cmp.js'
import starPicker from '../../../../cmps/star-picker.cmp.js'

export default {
  props: ['book'],
  template: `
        <section class="review-add round" >

      <i @click="close" class="close-btn f-m bi bi-x-lg" title="Close"></i>
      <h2 v-if="composeForm">New Review</h2>
      <p class="book-title f-s f-clr-light">{{book.title}}</p>
        <form
        @submit.prevent="save"
        v-if="composeForm">
        <component
          v-for="(cmp, idx) in composeForm.cmps"
          :is="cmp.type"
          :info="cmp.info"
          :key="cmp.info.key"
          @setVal="setAns">
        </component>
        <footer>
          <input v-model="review.date" ref="datepicker" type="date" name="date"/>
          <button>Send</button>
        </footer>
      </form>
</section>
    `,
  data() {
    return {
      review: {
        reviewer: null,
        title: '',
        rating: 0,
        date: '',
        reviewTxt: null,
      },
      composeForm: null,
    }
  },
  created() {
    this.composeForm = booksService.getComposeSurvey()
  },
  mounted() {
    this.initDate()
  },
  methods: {
    close() {
      eventBus.emit('closeCompose')
    },
    setAns({ key, ans: val }) {
      this.review[key] = val
      console.log(key, val)
    },
    initDate() {
      const date = new Date()
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      this.review.date = `${year}-${month < 10 ? '0' + month : month}-${
        day < 10 ? '0' + day : day
      }`
    },
    save() {
      console.log('saving...')
      booksService.addReview(this.book.id, { ...this.review }).then((book) => {
        this.book.reviews = book.reviews
        showSuccessMsg(`Added review to book "${this.book.title}"`)
        this.close()
      })

      // TODO: add validity
      //   const validity = emailService.checkValidity(this.draft)

      //   if (validity.isValid) {
      //     this.draft.sentAt = Date.now()
      //     emailService.sendEmail(this.draft).then(() => this.closeCompose())
      //   } else {
      //     showErrorMsg('Please add ' + validity.missing)
      //   }
    },
  },
  components: {
    textBox,
    textArea,
    starPicker,
  },
}
