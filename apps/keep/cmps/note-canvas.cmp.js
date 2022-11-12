export default {
  props: ['media'],
  template: `
        <div class="canvas-container">
            <canvas ref="canvas" id="canvas" @mousemove="onMove">
            </canvas>
            <input v-model="strokeColor" class="stroke-color-input" type="color" />
            <!-- <i class="bi bi-eraser-fill" class="canvas-eraser-icon"></i> -->
        </div>

             `,
  data() {
    return {
      canvas: null,
      ctx: null,
      gX: null,
      gY: null,
      state: null,
      strokeColor: 'black',
      fillColor: 'black',
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas
    this.ctx = this.canvas.getContext('2d')
    this.addListeners()
    const ctx = document.getElementById('canvas').getContext('2d')
    const img = new Image()
    img.src = this.media
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
    }
  },
  methods: {
    showColorPicker() {
      this.$refs['stroke-color-input'].click()
    },
    drawLine(x, y, xEnd = 250, yEnd = 250) {
      this.ctx.beginPath()
      this.ctx.moveTo(x, y)
      this.ctx.lineTo(xEnd, yEnd)
      this.ctx.strokeStyle = this.strokeColor
      console.log(this.strokeColor)
      this.ctx.stroke()
      this.ctx.closePath()
    },
    drawPencil(x, y) {
      this.ctx.beginPath()
      this.ctx.strokeStyle = 'black'
      this.ctx.fillStyle = 'black'
      if (!this.gX) {
        this.gX = x - 1
        this.gY = y - 1
      }
      this.drawLine(this.gX, this.gY, x, y)
      this.ctx.fill()
      this.gX = x
      this.gY = y
      this.ctx.closePath()
    },

    draw(ev) {
      let x = ev.type === 'touchmove' ? ev.x : ev.offsetX
      let y = ev.type === 'touchmove' ? ev.y : ev.offsetY
      this.drawPencil(x, y)
    },

    addMouseListeners() {
      // this.canvas.addEventListener('mousemove', this.onMove)
      this.canvas.addEventListener('mousedown', this.onDown)
      this.canvas.addEventListener('mouseup', this.onUp)
    },

    addTouchListeners() {
      this.canvas.addEventListener('touchmove', this.onMove)
      this.canvas.addEventListener('touchstart', this.onDown)
      this.canvas.addEventListener('touchend', this.onUp)
    },

    onMove(ev) {
      this.$emit(
        'canvas-changed',
        this.canvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream')
      )
      if (ev.type === 'touchmove') {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        ev = {
          x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
          y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
          type: 'touchmove',
        }
      }

      if (this.state === 'down') {
        this.draw(ev)
      }
    },

    onDown() {
      this.state = 'down'
    },

    onUp() {
      this.state = 'up'
      this.gX = null
      this.gY = null
    },

    addListeners() {
      this.addMouseListeners()
      this.addTouchListeners()
    },
  },
}
