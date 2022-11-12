export default {
  template: `
    <section class="home-page f-l-text">
      <section class="maily-section">
        <img src="assets/img/maily-img.png" alt="" />
        <section>
          <h1 class="f-headline">Communicate without limits</h1>
          <p>
            Maily is an email app that gives users the power & control of all
            the data they send and recieve.
          </p>
          <p>
            Maily integrates with our second app Keepy and allows users to send
            email content to Keepy to be saved as a note for later.
          </p>
          <router-link class="btn f-m" to="/maily">Check it out</router-link>
        </section>
      </section>
      <section class="keepy-section">
        <section>
          <h1 class="f-headline">Never forget</h1>
          <p>
            Keepy is a notes app that allows you to store data, any data (text,
            videos, photos, recordings, links etc.), so you’ll never forget.
          </p>
          <p>
            Keepy integrates with our email app and allows you to use a note
            content as an email body, making your experience top notch.
          </p>
          <router-link class="btn f-m" to="/keepy">Check it out</router-link>
        </section>
        <img src="assets/img/keepy-img.png" alt="" />
      </section>
      <section class="booky-section">
        <img src="assets/img/booky-img.png" alt="" />
        <section>
          <h1 class="f-headline">Find your next read</h1>
          <p>
            Bookey is a online book review place for all users to share their
            views and thoughts about their favorite books.
          </p>
          <router-link class="btn f-m" to="/booky">Check it out</router-link>
        </section>
      </section>
    </section>
  `,
}
