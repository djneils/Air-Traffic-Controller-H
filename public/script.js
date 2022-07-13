'use strict'
let socket = io.connect()
let plane, runway, explosion, airplane, heliPad, heli, coverScreen
let planes = []
let path = []
let explosionFrames
let effects = []
let gameOver = false
let id = 1
let currentSelectedPlane = 0
let landingPath, landingPath2
let runwayStart, runwayStartHeight
let runwayStart2, runwayStartHeight2
let heliPadPos
let w, h
let score = 0
let f
let planesReleased = 0
let airlinersReleased = 0
let maxPlanes = 5
let maxAirliners = 3
let maxHelis = 2
let helisReleased = 0
let heliPadDiameter
let centre
let crashed = 0
let gameTime, intervalID
let landedPlanes = []
let gameStart = false
let bestScores = []
let scoreSent = false
let name = prompt('enter your name')

function preload() {
  socket.on("top10", function(data) {
    bestScores = data
    console.log("got sent " + data)

  });
  socket.on("refresh", function() {
    socket.emit('getScores')
  })
  coverScreen = loadImage('images/coverScreen.jpeg')
  heli = loadImage('images/heli.png')
  plane = loadImage('images/plane.png')
  explosion = loadImage('images/explosion.png')
  runway = loadImage('images/rundk.png')
  airplane = loadImage('images/airliner.png')
  heliPad = loadImage('images/helipad.jpeg')
  f = loadFont('f.otf')
}

function setup() {

  createCanvas(windowHeight * (runway.width / runway.height), windowHeight)
  init()
}
function init() {
  socket.emit('getScores')
  planes = []
  path = []
  effects = []
  id = 1
  landedPlanes = []
  gameStart = false
  bestScores = []
  scoreSent = false
  planesReleased = 0
  airlinersReleased = 0
  maxPlanes = 5
  maxAirliners = 3
  maxHelis = 2
  helisReleased = 0
  currentSelectedPlane = 0
  gameOver = false
  gameStart = false
  scoreSent = false
  crashed = 0
  score = 0
  textAlign(CENTER, CENTER)
  centre = createVector(width / 2, height / 2)
  explosionFrames = splitIntoArray(explosion, 9, 9, 81)
  runwayStart = createVector(width * 0.09, height * 0.44)
  runwayStart2 = createVector(width * 0.3, height * 0.26)
  runwayStartHeight = height / 6.5
  runwayStartHeight2 = height / 6.5
  heliPadDiameter = height / 10
  heliPadPos = createVector(width * 0.7, height * 0.28)
  landingPath = [
    createVector(width * 0.25, height * 0.42),
    createVector(width * 0.82, height * 0.42)
  ]
  landingPath2 = [
    createVector(width * 0.39, height * 0.34),
    createVector(width * 0.81, height * 0.69)
  ]
  planes.push(new Heli())
  planesReleased++
  path = new Array()
  textFont(f)
  gameTime = 0
  intervalID = setInterval(addTime, 1000)
}
function addTime() {
  gameTime++

}
function draw() {
  if (gameStart == true) {
    if (planesReleased < maxPlanes && frameCount % 400 == 0) {
      planes.push(new Plane())
      planesReleased++
    }
    if (airlinersReleased < maxAirliners && frameCount % 800 == 0) {
      planes.push(new Airplane())
      airlinersReleased++
    }
    if (helisReleased < maxHelis && frameCount % 1200 == 0) {
      planes.push(new Heli())
      helisReleased++
    }
    colorMode(RGB)
    background('#2f7532')
    stroke(0)
    fill(255)
    textSize(40)
    textAlign(CENTER, CENTER)
    text('AIRCRAFT LANDED \n' + score, width * 0.2, 50)
    text("AIRCRAFT TO LAND \n" + planes.length, width * 0.5, 50)
    text("AIRCRAFT CRASHED \n" + crashed, width * 0.8, 50)
    textAlign(LEFT, CENTER)
    if (score + crashed == 10) {
      clearInterval(intervalID)
      gameOver = true
    }
    let mins = floor(gameTime / 60)
    let secs = gameTime % 60
    if (secs < 10) {
      text(mins + ':0' + secs, width * 0.06, height * 0.9)
    } else {
      text(mins + ':' + secs, width * 0.06, height * 0.9)
    }

    radar()
    imageMode(CORNER)
    image(runway, 0, 0, width, height)
    fill(255)
    stroke(255)


    push()
    imageMode(CENTER)
    image(heliPad, heliPadPos.x, heliPadPos.y, height * 0.1, height * 0.1)
    pop()

    textSize(80)
    fill(0)
    stroke(0)

    fill(0)


    for (let i = 0; i < path.length; i++) {
      if (i < path.length - 1) {
        let target = path[i + 1].copy()
        let heading = target.sub(path[i]).heading()
        push()
        translate(path[i].x, path[i].y)
        rotate(heading)
        line(-30, 0, 10, 0)
        triangle(30, 0, 10, -5, 10, 5)
        circle(0, 0, 10)
        pop()
      }
    }

    for (let p of planes) {
      p.update()
    }
    for (let e of effects) {
      e.update()
    }
    fill(0)
    let lx = width * 0.3
    let ly = height * 0.84

    //circle(width*0.3,height*0.84,20)
    for (let l of landedPlanes) {
      let space = 40
      if (l.type == 1) {
        l.height = 0.5
        space = 60
      }
      if (l.type == 2) {
        l.height = 0.6
        space = 70
      }
      if (l.type == 3) {
        l.height = 0.8
        space = 90
      }
      l.pos = createVector(lx, ly)
      l.vel = createVector(0, -1)
      l.show()
      lx += space

    }
    if (gameOver) {

      push()
      rectMode(CENTER)
      textAlign(CENTER, CENTER)
      fill(180, 150)
      stroke(0)
      rect(width / 2, height / 2.1, 500, 250)
      fill(255)
      let finalScore = floor((landedPlanes.length * 18000) / (gameTime / 8))
      let data = {
        name: name.toUpperCase(),
        time: finalScore
      }
      if (scoreSent == false) {
        socket.emit("addScore", data)
        scoreSent = true
      }

      text('FINAL SCORE \n' + finalScore, width / 2, height / 2.1)
      pop()
    }

  } else {
    imageMode(CORNER)
    background(coverScreen)
    push()
    textSize(70)
    let yp = 70
    rectMode(CENTER)
    noFill()
    //rect(width/2,height/2,400,300)
    fill(0)
    text('FLIGHT CONTROL', width * 0.32, height * 0.07)
    textSize(50)
    text('HIGH SCORES', width * 0.15, height * 0.5)
    text('PRESS SPACE TO START', width * 0.5, height * 0.87)
    textSize(30)
    for (let s of bestScores) {
      text(s.name + ' - ' + s.time, width * 0.15, height * 0.5 + yp)
      yp += 30
    }
    pop()
  }

}

function mouseReleased() {
  for (let p of planes) {
    if (p.id == currentSelectedPlane && !p.landing) {
      if (path.length > 1) {
        if (path.length > 5) {
          path.shift()
          path.shift()
        }
        p.addPath(path)
        p.waypoint = 0
        p.assignedPath = true
        path = new Array()
      }

    }
  }
  currentSelectedPlane = 0

}

function mouseDragged() {

  if (currentSelectedPlane != 0) {
    let current = createVector(mouseX, mouseY)
    if (path.length == 0) {
      path.push(current)
    } else {
      let last = path[path.length - 1]
      if (current.dist(last) > 50) {
        path.push(current)
      }
    }
  }


}

function mousePressed() {
  path = new Array()
}




function splitIntoArray(img, rows, cols, numberOfFrames) {
  let fwidth = img.width / cols
  let fheight = img.height / rows

  var frames = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (numberOfFrames > 0) {
        frames.push(img.get(c * fwidth, r * fheight, fwidth, fheight))
      }
      numberOfFrames--
    }
  }
  frames.frameWidth = fwidth
  frames.frameHeight = fheight

  return frames
}


function radar() {
  push()
  rectMode(CORNER)
  translate(width * 0.04, height * 0.65)
  stroke(0)
  fill(63, 93, 93, 100)
  imageMode(CORNER)
  image(runway, 0, 0, 300, 200)
  image(heliPad, 202, 47, 20, 20)
  rect(0, 0, 300, 200)
  noStroke()
  for (let p of planes) {

    if (p.type == 1) {
      fill(255, 0, 0)
    } else if (p.type == 2) {
      fill(0, 255, 0)
    } else {
      fill(0, 0, 255)
    }
    let x = p.pos.x * (300 / width)
    let y = p.pos.y * (200 / height)
    circle(x, y, 5)

  }

  pop()
}

function spawnPosition() {
  let side = floor(random(4))
  let x, y
  if (side == 0) {
    x = random(0, width)
    y = -100
  }
  if (side == 1) {
    x = random(0, width)
    y = height + 100
  }
  if (side == 2) {
    x = -100
    y = random(0, height)
  }
  if (side == 3) {
    x = width + 100
    y = random(0, height)
  }

  return createVector(x, y)
}

function keyPressed() {
  background('green')

  if (keyCode == 32) {
    if (gameOver == true) {
      gameOver = false
      gameStart = false
      scoreSent = false
      crashed = 0
      score = 0
      init()
    } else {
      gameTime = 0
      gameStart = true

    }

  }
}