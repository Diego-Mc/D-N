export default {
  template: /*HTML*/ `
    <section class="email-details selected round">
      <header>
        <div className="user-data">
          <img class="email-img" src="assets/img/diego.jpeg" alt="userImg" />
          <span>
            <small class="f-m f-clr-main">Diego Mc</small>
            <small class="f-s f-clr-light">diego@example.com</small>
          </span>
        </div>
        <div class="email-tools">
          <i class="bi bi-arrow-90deg-left"></i>
          <i class="bi bi-reply"></i>
          <i class="bi bi-reply-all"></i>
          <i class="bi bi-star"></i>
          <i class="bi bi-trash"></i>
        </div>
      </header>
      <main>
        <h2>Sign up for my new Website about the VueJS framework</h2>
        <p>
          My new website is about the VueJs framework and it's open and ready for you to join. I’ve worked
          very hard on it and I’m hoping that you will appreciate it and join, I
          would also really like any feedback you can give me.
        </p>
        <p> This means a lot to me.</p>
      </main>
      <footer>
        <p class="signature">
          Thanks for reading, <br>
          Diego, <br>
          Website creator
        </p>
        <small className="email-time f-s f-clr-light">10:43</small>
      </footer>
    </section>
  `,
  data() {
    return {}
  },
  created() {},
  methods: {},
  computed: {},
}

// TODO: use data bool to check if exists email, if not show msg, if exists show email AND render selected class for bg color
