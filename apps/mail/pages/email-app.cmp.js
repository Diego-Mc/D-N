import { emailService } from '../service/email.service.js'

import emailCompose from '../cmps/email-compose.cmp.js'
import emailFilter from '../cmps/email-filter.cmp.js'
import emailFolderList from '../cmps/email-folder-list.cmp.js'
import emailList from '../cmps/email-list.cmp.js'
import emailDetails from '../cmps/email-details.cmp.js'

export default {
  template: /* HTML */ `
    <main class="email-main">
      <email-folder-list />
      <email-list @emailSelected="emailSelected" :emails="emails" />
      <email-details :email="selectedEmail" />
    </main>
  `,
  data() {
    return {
      emails: null,
      selectedEmail: null,
    }
  },
  created() {
    emailService.query().then((emails) => (this.emails = emails))
  },
  methods: {
    emailSelected(email) {
      console.log(email)
      this.selectedEmail = email
    },
  },
  computed: {},
  components: {
    emailFolderList,
    emailList,
    emailDetails,
  },
}
