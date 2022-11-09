import { emailService } from '../service/email.service.js'

import emailCompose from '../cmps/email-compose.cmp.js'
import emailFilter from '../cmps/email-filter.cmp.js'
import emailFolderList from '../cmps/email-folder-list.cmp.js'
import emailList from '../cmps/email-list.cmp.js'
import emailPreview from '../cmps/email-preview.cmp.js'

export default {
  template: /* HTML */ `
    <main className="email-main">
      <h1>This is mail!</h1>
      <email-folder-list />
      <email-list />
      <email-preview />
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
    emailPreview,
  },
}
