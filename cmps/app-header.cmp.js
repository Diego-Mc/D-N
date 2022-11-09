export default {
  template: `
        <header class="app-header col-full f-m">
            <span class="logo-wrapper">
                <img src="assets/icons/logo-icon-dn.svg" alt="" />
                <h1 class="logo-text logo">D&N</h1>
            </span>
            <nav>
                <router-link to="/maily">Maily</router-link>
                <router-link to="/keepy">Keepy</router-link>
                <router-link to="/">Booky</router-link>
                <router-link to="/about">temp</router-link>
            </nav>
            <i class="bi bi-grid-fill"></i>
        </header>
    `,
}
