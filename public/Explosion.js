class Explosion {

  constructor(x, y) {
    this.pos = createVector(x, y)
    this.frame = 0
  }

  show() {

    image(explosionFrames[this.frame], this.pos.x, this.pos.y, 170, 170)

    this.frame++

    if (this.frame == explosionFrames.length - 1) {
      effects.splice(effects.indexOf(this), 1)
    }
  }

  update() {
    this.delay -= 1
    this.show()
  }


}
