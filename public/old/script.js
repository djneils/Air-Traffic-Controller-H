var socket = io.connect()

var letters = []
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
var position = 0
var start, end
var first = true
var last = false
var gameOver = false
var final
var elapsed
var canvas
var name = ''
var bestScores = []

var a=0
function windowResized() {
  resizeCanvas(windowWidth, windowHeight)

}

function preload() {
  socket.on("top10", function(data) {
    bestScores = data
    console.log("got sent " + data)

  });
  socket.on("refresh",function(){
    socket.emit('getScores')
  })

}

function setup() {

  canvas = createCanvas(windowWidth, windowHeight)
  textAlign(CENTER, CENTER)
  background(255)
  for (i = 0; i <= 25; i++) {
    //var x = map(i,0,25,width/3,2&width/3)
    letters[i] = new Letter(100 + (40 * i), 0, alphabet[i])
    //letters[i] = new Letter(x, 0, alphabet[i])
  }

  socket.emit('getScores')
}


function keyPressed() {

  if (!gameOver) {
    if (first && keyCode==65) {
      start = new Date().getTime();
      first = false
    }
    if (String.fromCharCode(keyCode) === alphabet[position]) {
      letters[position].drop = true
      position++
    }

    if (position === 26) {
      end = new Date().getTime();
      var elapsed = new Date().getTime() - start;
      console.log(end - start)
      gameOver = true
      last = true
    }
  } else {

    console.log(keyCode)
    if ((keyCode == 13 && name.length>0) || name.length > 8) {
      console.log(name, final)//emit score to database here
      var data = {
        name: name.toUpperCase(),
        time: final / 1000
      }
      socket.emit("addScore", data)

      restartGame()
    } else {
  
      if(keyCode>32 && keyCode<100){
        name += key
      }
      
        
      
      
    }

  }
}
function restartGame() {
  socket.emit('getScores')
  letters = []
  alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  position = 0
  //start, end
  first = true
  last = false
  gameOver = false
  // final=0
  // elapsed=0

  name = ''
  for (i = 0; i <= 25; i++) {
    //var x = map(i,0,25,width/3,2&width/3)
    letters[i] = new Letter(100 + (40 * i), 0, alphabet[i])
    //letters[i] = new Letter(x, 0, alphabet[i])
  }
}
// function mousePressed(){
//   if(mouseButton==RIGHT){
//         var data = {
//         name:name,
//         time:9.9
//       }
//     socket.emit('addScore',data)
//   }
// }
function draw() {
  fill(0)
  background(255)
  for (i = 0; i <= 25; i++) {
    letters[i].show()
  }
  textSize(102)
  elapsed = new Date().getTime() - start

  if (!first) {

    if (!gameOver) {
      textSize(60)
      textFont("Special Elite")
      text(elapsed / 1000, width / 2 - 100, height / 2)
    } else {
      if (last) {
        final = elapsed
        last = false
      }
    }
    if (gameOver) {
      textSize(60)
      text("FINAL TIME - " + final / 1000 + "s", width / 2 - 270, height / 2)
      text("ENTER NAME", width / 2 - 270, height / 2 + 100)
      text(name, width / 2 - 270, height / 2 + 200)

    }
  } else {
    textSize(25)
    var y = 150
    textAlign(LEFT)
    var s=map(sin(a),-1,0,10,11)
    a+=0.1
    textSize(s)
    text("INSTRUCTIONS:",20,200)
    text("TYPE THE ALPHABET",20,250)
    text("AS SOON AS YOU HIT 'A' TIME STARTS",20,300)
    text("WHEN YOU GET TO 'Z' TIME STOPS",20,350)
    text("THEN TYPE YOUR NAME AND HIT ENTER TO SUBMIT SCORE",20,400)
    text("START WHEN READY!",20,450)
     textAlign(CENTER, CENTER)
     textSize(45)
    text('LEADERBOARD', width / 2, y - 50)
    textSize(30)
    for (var score of bestScores) {
      text(score.name + ' : ' + score.time + ' secs', width / 2, y)
      y += 40
    }
    fill(0, 0)
    rect(width / 2 - 200, 70, 400, y - 60)
  }
}







