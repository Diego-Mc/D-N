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
      <email-list />
      <email-details />
    </main>
  `,
  data() {
    return {}
  },
  created() {},
  methods: {},
  computed: {},
  components: {
    emailFolderList,
    emailList,
    emailDetails,
  },
}
