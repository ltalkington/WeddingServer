var express = require("express");
var mysql = require("./db_conn.js");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("port", 9004);
const path = require("path");

app.set("mysql", mysql);
var cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
var db = require("./db_conn");

// app.use(express.static(path.join(__dirname + "/build/static/index.html")));
/*
    ROUTES
// */
// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname + "/talkingtonwedding/build/index.html"));
// });
// app.get("/RSVP", function (req, res) {
//   res.sendFile(path.join(__dirname + "/talkingtonwedding/build/index.html"));
// });
// app.get("/FAQ", function (req, res) {
//   res.sendFile(path.join(__dirname + "/talkingtonwedding/build/index.html"));
// });

app.get("/listguests", function (req, res) {
  query = "SELECT * FROM Guests";
  db.pool.query(query, (err, result) => {
    if (err) {
      res.write(JSON.stringify(err));
    } else {
      res.send(result);
    }
  });
});

app.get("/displayguests/:filter/:first/:last", function (req, res) {
  query =
    "SELECT * FROM Guests WHERE firstName = '" +
    req.params.first +
    "' AND lastName = '" +
    req.params.last +
    "'";
  db.pool.query(query, (err, result) => {
    if (err) {
      res.write(JSON.stringify(err));
    } else {
      res.send(result);
    }
  });
});

app.post("/createreservation", function (req, res) {
  var mysql = req.app.get("mysql");
  var sql =
    "INSERT INTO Reservations (groupID, isGoing, numberGoing, dietRequests, songRequests) VALUES (?,?,?,?,?)";
  var inserts = [
    req.body.groupID,
    req.body.isGoing,
    req.body.numberGoing,
    req.body.dietRequests,
    req.body.songRequests,
  ];
  console.log(inserts);
  db.pool.query(sql, inserts, function (error, result, fields) {
    if (error) {
      res.write(JSON.stringify(error));
    } else {
      res.send(result);
    }
  });
});

app.post("/createguest", function (req, res) {
  var mysql = req.app.get("mysql");
  var sql =
    "INSERT INTO Guests (firstName, lastName, groupID, isGoing, isPlusOne) VALUES (?,?,?,?,?)";
  var inserts = [
    req.body.firstName,
    req.body.lastName,
    req.body.groupID,
    req.body.isGoing,
    req.body.isPlusOne,
  ];
  console.log(inserts);
  db.pool.query(sql, inserts, function (error, result, fields) {
    if (error) {
      res.write(JSON.stringify(error));
    } else {
      res.send(result);
    }
  });
});
//updates customers
app.put("/updateguests", function (req, res) {
  let inserts = [
    req.body.firstName,
    req.body.lastName,
    req.body.groupID,
    req.body.isGoing,
    req.body.isPlusOne,
    req.body.guestID,
  ];
  query =
    "UPDATE Guests SET firstName=?, lastName=?, groupID=?, isGoing=?, isPlusOne=? WHERE guestID=?;";
  db.pool.query(query, inserts, (err, result) => {
    if (err) {
      res.write(JSON.stringify(err));
    } else {
      res.send(result);
    }
  });
});

app.listen(app.get("port"), function () {
  console.log(
    "Express started on http://localhost:" +
      app.get("port") +
      "; press Ctrl-C to terminate."
  );
});
