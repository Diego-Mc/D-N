
import userMsg from './cmps/user-msg.cmp.js'

const options = {
    template: `
        <user-msg/>
        <router-view />
    `,

    components: {
        userMsg
    }
}

const app = createApp(options)

app.use(router)
app.mount('#app')
