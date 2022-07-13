class Heli {
  constructor() {
    this.height = (0.7)
    this.descendRate = 0.001
    this.speed = random(0.6, 0.8)
    let target = createVector(width / 2, height / 2)
    this.type = 2
    this.pos = spawnPosition()

    this.vel = target.sub(this.pos).setMag(this.speed)
    this.rotorSpeed = 1.4
    this.rotorPos = 0
    this.waypoint = 0
    this.canTurn = true
    this.path = null
    this.assignedPath = false
    this.id = id
    this.showPath = true
    this.landing = false
    this.moving = true
    this.score = 1
    id++

  }

  update() {
    if (this.pos.x < -50 || this.pos.x > width + 50 || this.pos.y < -50 || this.pos.y > height + 50) {
      let target = centre.copy()
      this.vel = p5.Vector.lerp(this.vel, target.sub(this.pos).setMag(this.speed), 0.09)
      this.vel.setMag(this.speed)

    }
    if (this.assignedPath) {
      let target = this.path[this.waypoint].copy()
      this.vel = p5.Vector.lerp(this.vel, target.sub(this.pos).setMag(this.speed), 0.1)
      this.vel.setMag(this.speed)
      if (this.pos.dist(this.path[this.waypoint]) < 40) {
        this.waypoint = (this.waypoint + 1)
        this.canTurn = false
        if (this.waypoint == this.path.length) {
          if (this.pos.dist(heliPadPos) < heliPadDiameter) {

            this.waypoint = 0
            this.landing = true
          }
          this.assignedPath = false
          this.path = null
        }
      } else {
        this.canTurn = true
      }
    }
    if (this.moving) { this.pos.add(this.vel) }

    if (currentSelectedPlane == 0 && mouseIsPressed &&
      collidePointCircle(mouseX, mouseY, this.pos.x, this.pos.y, 100 * this.height)
    ) {
      currentSelectedPlane = this.id
    }
    this.show()
    this.checkForCollision()
    if (this.landing) {
      this.land()
    }
  }
  land() {

    this.vel.mult(0)
    this.height -= this.descendRate
    this.height = constrain(this.height, 0.8, 1.5)
    this.rotorSpeed -= 0.005
    if (this.rotorSpeed < 0) {
      effects.push(new Landed(this.pos.x, this.pos.y))
      landedPlanes.push(this)
      planes.splice(planes.indexOf(this), 1)
      score += this.score
    }


  }
  checkForCollision() {
    for (let p of planes) {
      let hit = collideCircleCircle(this.pos.x, this.pos.y, 60 * this.height, p.pos.x, p.pos.y, 60 * this.height)
      if (hit && p != this) {
        
        let explosionPoint = this.pos.copy().add(p.pos.copy()).mult(0.5)
        effects.push(new Explosion(explosionPoint.x, explosionPoint.y))
        planes.splice(planes.indexOf(this), 1)
        planes.splice(planes.indexOf(p), 1)
        crashed += 2
      }
    }
  }

  addPath(path) {
    this.path = [...path]
  }

  show() {
    stroke('blue')
    fill('blue')
    if (this.showPath && this.path != null) {
      for (let i = 0; i < this.path.length; i++) {
        if (i < this.path.length - 1) {
          let target = this.path[i + 1].copy()
          let heading = target.sub(this.path[i]).heading()
          push()
          translate(this.path[i].x, this.path[i].y)
          rotate(heading)

          triangle(30, 0, 10, -5, 10, 5)

          pop()
        } else {
          push()
          translate(this.path[i].x, this.path[i].y)
          circle(0, 0, 5)
          pop()
        }
      }
    }


    imageMode(CENTER)
    push()
    translate(this.pos.x, this.pos.y)
    scale(this.height)
    rotate(this.vel.heading())
    image(heli, 0, 0, heli.width * this.height, heli.height * this.height)
    push()
    scale(this.height)
    stroke(0)
    strokeWeight(5)
    translate(20, 0)
    rotate(this.rotorPos)
    line(-50, 0, 50, 0)
    circle(0, 0, 5)
    line(0, -50, 0, 50)
    this.rotorPos += this.rotorSpeed
    pop()
    if (currentSelectedPlane == this.id) {
      stroke(255)
      noFill()
      circle(0, 0, 100 * this.height)
    }

    pop()

  }
}