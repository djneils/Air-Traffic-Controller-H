class Landed {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.frames = 160

  }
  update() {
    this.show()
    this.x = this.x + (sin(map(this.frames, 0, 160, 0, 2 * PI)))
    this.y -= 0.5
    this.frames--
    if (this.frames < 0) {
      effects.splice(effects.indexOf(this), 1)
    }
  }
  show() {
    push()
    stroke(0, 0, 255, map(this.frames, 160, 0, 255, 0))
    fill(0, 0, 255, map(this.frames, 160, 0, 255, 0))
    textSize(map(this.frames, 160, 0, 10, 50))
    text('LANDED', this.x, this.y)
    pop()
  }
}