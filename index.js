//import modules for the webserver and sockets
var express = require('express')
var socket = require('socket.io')
var sqlite3 = require('sqlite3')

//webserver code
var app = express();
var server = app.listen(process.env.PORT || 3000, function() {
  console.log('listening for requests ');
});

app.use(express.static('public'));
//tweak
//socket code
var io = socket(server);


io.on('connection', function(socket) {

  console.log('made socket connection', socket.id);

  socket.on('getScores', function() {
    let db = new sqlite3.Database('bestScores.db');
    let sql = 'SELECT * FROM TIMES ORDER BY TIME DESC LIMIT 10;'
    console.log(sql)
    db.all(sql, function(err, rows) {
      if (err) {
        console.log(err)
      }
      io.emit('top10', rows)
      for (var row of rows) {
        console.log(row);
      }
      db.close()
    });
  });
  socket.on('test', function(data) {
    console.log(data)
  })

  socket.on('addScore', function(data) {
    let db = new sqlite3.Database('bestScores.db');
    console.log(data)

     let sql = `INSERT INTO times(name, time) VALUES ('${data.name}', ${data.time}) ON CONFLICT (name) DO UPDATE SET time = CASE WHEN ${data.time} > time THEN ${data.time} ELSE time END WHERE name = '${data.name}';`


    console.log(sql)
    db.run(sql, function(err, rows) {
      if (err) {
        console.log(err)
      }

console.log(rows)
    });
    
    
    db.close()
    io.emit("refresh")
  });
  

})







let db = new sqlite3.Database('bestScores.db');
//let sqlx = `INSERT INTO times (name,time) VALUES ('frank',12.4);`
let sql = `DELETE FROM times`;
// let sql2 = `INSERT INTO scores (name,score) VALUES ('frank',7500);`;
// //
let sqlx='select * from times'
//let sqly = `update times set time = ${data.time} where name = '${data.name}'; `

db.all(sqlx, function(err, rows) {
  if (err) {
    throw err;
  }
  for (var row of rows) {
    console.log(row)
  }


});
db.close();

