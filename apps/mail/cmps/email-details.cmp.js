import { eventBus } from '../../../services/event-bus.service.js'
import emailReply from '../cmps/email-reply.cmp.js'

export default {
  props: ['email'],
  template: /*HTML*/ `
    <section v-if="email" class="email-details selected round" :class="{expended: isExpended}">
    <i v-if="isExpended" class="expend-icon bi bi-arrow-bar-right" @click="isExpended = !isExpended" title="shrink"></i>
    <i v-else class="expend-icon bi bi-arrow-bar-left" @click="isExpended = !isExpended" title="expend"></i>
<i @click="backToList" class="close-btn f-m bi bi-x-lg" title="Close"></i>
      <header>
        <div class="user-data">
          <img class="email-img" :src="email.imgUrl" />
          <span>
            <small class="f-m f-clr-main">{{recipient}}</small>
            <small class="f-s f-clr-light">{{email.from.email}}</small>
          </span>
        </div>
        <div class="email-tools">
          <i @click="doForward" class="bi bi-arrow-90deg-left" title="Forward"></i>
          <i @click="doReply" class="bi bi-reply" title="Reply"></i>
          <i v-if="!email.removedAt" @click="doStar" :class="toggleClass(email.isStarred,'bi bi-star')" :title="email.isStarred ? 'Unstar': 'Star'"></i>
          <i
            v-else
            @click="doRestore"
            class="bi bi-arrow-counterclockwise"
            title="Restore"></i>
          <i @click="doTrash" :class="toggleClass(email.removedAt,'bi bi-trash')" :title="email.removedAt ? 'Fully remove': 'Move to trash'"></i>
        </div>
      </header>
      <main class="email-content">
        <h2>{{email.subject}}</h2>
        <p>
          {{email.body}}
        </p>
      </main>

      <!--<section v-if="email.replies" class="reply-threads">
        <email-reply v-for="reply in replies" :key="reply.id" :reply="reply">
      </section>-->

      <footer>
      <span class="signature-wrapper">

      <p class="signature f-s f-clr-light">
        {{email.signature || email.from.name}}
        </p>
        <small class="email-time f-s f-clr-light">{{sentAt}}</small>
      </span>
      <small class="keepy-cta" @click="sendToKeepy">Send to Keepy</small>
      </footer>
    </section>
  `,
  data() {
    return {
      isExpended: false,
    }
  },
  created() {},
  methods: {
    sendToKeepy() {
      this.$router.push({
        path: '/keepy',
        query: {
          isEmail: true,
          title: this.email.subject,
          txt: this.email.body,
        },
      })
    },
    doReply() {
      this.$router.push({ query: { replyId: this.email.id, isCompose: true } })
    },
    doForward() {
      this.$router.push({
        query: { forwardId: this.email.id, isCompose: true },
      })
    },
    backToList() {
      eventBus.emit('unselectEmail')
    },
    doStar() {
      eventBus.emit('starEmail', this.email)
    },
    doTrash() {
      eventBus.emit('removeEmail', this.email)
    },
    doRestore() {
      eventBus.emit('restoreEmail', this.email)
    },
    toggleClass(bool, classStr) {
      return classStr + (bool ? '-fill' : '')
    },
  },
  computed: {
    recipient() {
      if (this.$route.path.includes('sent'))
        return this.email.to.name || this.email.to.email
      return this.email.from.name || this.email.from.email
    },
    sentAt() {
      return new Date(this.email.sentAt).toDateString()
    },
  },
  components: {
    emailReply,
  },
}

// TODO: use data bool to check if exists email, if not show msg, if exists show email AND render selected class for bg color

//TODO: add util to break up text to multiple paragraphs
