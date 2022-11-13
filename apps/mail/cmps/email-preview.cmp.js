import labelPicker from '../../../cmps/label-picker.cmp.js'
import userLabel from '../../../cmps/user-label.cmp.js'

import { eventBus } from '../../../services/event-bus.service.js'
import { utilService } from '../../../services/util.service.js'

export default {
  props: ['email'],
  template: /* HTML */ `
    <article
      @click="emailSelect"
      :class="{reply: isReply, unread: !email.isRead}"
      @mouseleave="isLabelPicking = false"
      class="email-preview">
      <i
        @click.stop="doStar"
        :class="toggleClass(email.isStarred,'bi bi-star')"
        class="starState"
        :title="email.isStarred ? 'Unstar': 'Star'"></i>
      <img class="email-img" :src="email.imgUrl" />
      <small class="email-recipient f-s f-clr-light">{{recipient}}</small>
      <h3 class="email-subject f-d f-clr-light">{{email.subject}}</h3>
      <section class="f-s f-clr-light email-body">
        <p>{{email.body}}</p>
        <section class="tools">
          <i
            @click.stop="doRead"
            :class="toggleClass(email.isRead,'bi bi-envelope')"
            :title="email.isRead ? 'Mark as unread': 'Mark as read'"></i>
          <i
            @click.stop="doTrash"
            :class="toggleClass(email.removedAt,'bi bi-trash')"
            :title="email.removedAt ? 'Fully remove': 'Move to trash'"></i>
          <i
            v-if="!email.removedAt"
            @click.stop="doLabel"
            class="bi bi-bookmark"
            title="Add labels">
          </i>
          <i
            v-else
            @click.stop="doRestore()"
            class="bi bi-arrow-counterclockwise"
            title="Restore"></i>
          <label-picker
            @updateLabels="updateLabels"
            v-if="isLabelPicking"
            :entityLabels="email.labels"
            :labels="labels" />
        </section>
      </section>
      <section class="labels">
        <user-label
          v-if="email.labels.length"
          v-for="label in email.labels"
          :key="label"
          :label="label" />
      </section>
      <small class="email-time f-s f-clr-light">{{timeStr}}</small>
    </article>
  `,
  data() {
    return {
      isReply: false,
      isLabelPicking: false,
      labels: [
        { txt: 'heelo' },
        { txt: 'relationship' },
        { txt: 'work' },
        { txt: 'love' },
        { txt: 'park' },
        { txt: 'school' },
      ],
    }
  },
  created() {
    this.setReply()
  },
  methods: {
    emailSelect() {
      eventBus.emit('markAsRead', this.email, true)
      if (this.folderName !== 'draft') this.$emit('emailSelected', this.email)
      else {
        this.$router.push({
          query: { isCompose: true, id: this.email.id },
        })
      }
    },
    setReply() {
      if (this.$route.query.replyId === this.email.id) this.isReply = true
      else this.isReply = false
    },
    doStar() {
      eventBus.emit('starEmail', this.email)
    },
    doTrash() {
      eventBus.emit('removeEmail', this.email)
    },
    doRead() {
      eventBus.emit('markAsRead', this.email)
    },
    doRestore() {
      eventBus.emit('restoreEmail', this.email)
    },
    toggleClass(bool, classStr) {
      return classStr + (bool ? '-fill' : '')
    },
    doLabel() {
      this.isLabelPicking = !this.isLabelPicking
    },
    updateLabels(labels) {
      eventBus.emit('updateLabels', this.email, labels)
    },
  },
  computed: {
    folderName() {
      const route = this.$route.matched[1]
      // if (!route) return ''
      return route.name
    },
    timeStr() {
      return utilService.toTimeStr(this.email.sentAt)
    },
    recipient() {
      if (this.$route.path.includes('sent'))
        return this.email.to.name || this.email.to.email
      return this.email.from.name || this.email.from.email
    },
  },
  watch: {
    '$route.query': {
      handler() {
        this.setReply()
      },
      deep: true,
    },
  },
  components: {
    labelPicker,
    userLabel,
  },
}

//TODO: add conditional for email.from/email.to based on folder
