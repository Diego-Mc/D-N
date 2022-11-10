export default {
  template: `
    <footer class="app-footer f-clr-dark">
      <div v-if="isExpended" class="credits">
        <h4 class="f-clr-light">Created by</h4>
        <h4 class="mention">
          Diego Monzon Contreras
          <i class="bi bi-linkedin"></i>
          <i class="bi bi-github"></i>
        </h4>
        <h4 class="mention">
          Nir Coren
          <i class="bi bi-linkedin"></i>
          <i class="bi bi-github"></i>
        </h4>
      </div>
      <p class="rights f-clr-light">D&N Coffeerights &copy; 2022</p>
    </footer>
  `,
  data() {
    return {
      isExpended: true,
    }
  },
  watch: {
    '$route.path': {
      handler(val) {
        const ishomePage = val === '/'
        if (ishomePage) this.isExpended = true
        else this.isExpended = false
      },
    },
  },
}
