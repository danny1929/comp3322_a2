var express = require("express");
var router = express.Router();

/* HTTP POST requests for http://localhost:3001/signin */
router.post("/signin", express.urlencoded({ extended: true }), (req, res) => {
  var db = req.db;
  var col_user = db.get("userList");

  col_user.find(
    { name: req.body.name, password: req.body.password },
    {},
    (error, users) => {
      if (error === null) {
        if (users.length != 0) {
          req.session.userId = users[0]._id;

          var col_note = db.get("noteList");
          col_note.find(
            { userId: users[0]._id.toString() },
            {},
            (error, notes) => {
              var noteAlbum = notes.map(function (note) {
                return {
                  _id: note._id,
                  lastsavedtime: note.lastsavedtime,
                  title: note.title,
                };
              });

              res.send({
                name: users[0].name,
                icon: users[0].icon,
                notes: noteAlbum,
              });
            }
          );
        } else {
          res.send({ msg: "Login failure" });
        }
      } else {
        res.send(error);
      }
    }
  );
});

//HTTP GET requests for http://localhost:3001/logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("");
  res.redirect("/");
});

//HTTP GET requests for http://localhost:3001/getnote?noteid=xx
router.get("/getnote", (req, res) => {
  var db = req.db;
  var col_note = db.get("noteList");
  col_note
    .find({ _id: req.query.noteid })
    .then((notes) => {
      res.send(notes);
    })
    .catch((err) => {
      res.send(err);
    });
});

//HTTP POST requests for http://localhost:3001/addnote
router.post("/addnote", express.urlencoded({ extended: true }), (req, res) => {
  var db = req.db;
  var col_note = db.get("noteList");
  var start = new Date();
  var nowtime = start.toTimeString().split(" ")[0] + " " + start.toDateString();
  col_note
    .insert({
      userId: req.session.userId,
      title: req.body.title,
      content: req.body.content,
      lastsavedtime: nowtime,
    })
    .then((notes) => {
      res.send({ _id: notes._id, lastsavedtime: notes.lastsavedtime });
    })
    .catch((err) => {
      res.send(err);
    });
});

//HTTP PUT requests for http://localhost:3001/savenote/:noteid
router.put("/savenote/:noteid", (req, res) => {
  var db = req.db;
  var col_note = db.get("noteList");
  var start = new Date();
  var nowtime = start.toTimeString().split(" ")[0] + " " + start.toDateString();
  col_note
    .update(
      { _id: req.params.noteid },
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          lastsavedtime: nowtime,
        },
      }
    )
    .then(() => {
      res.send({ lastsavedtime: nowtime });
    })
    .catch((err) => {
      res.send(err);
    });
});

//HTTP GET requests for http://localhost:3001/searchnotes?searchstr=xx
router.get("/searchnotes", (req, res) => {
  var db = req.db;
  var col_note = db.get("noteList");
  col_note
    .find({
      userId: req.session.userId,
      $or: [
        { title: { $regex: req.query.searchstr, $options: "i" } },
        { content: { $regex: req.query.searchstr, $options: "i" } },
      ],
    })
    .then((result) => {
      for (var i = 0; i < result.length; i++) {
        result[i] = {
          _id: result[i]._id,
          lastsavedtime: result[i].lastsavedtime,
          title: result[i].title,
        };
      }
      console.log(result);
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

//HTTP DELETE requests for http://localhost:3001/deletenote/:noteid
router.delete("/deletenote/:noteid", (req, res) => {
  var db = req.db;
  var col = db.get("noteList");
  col
    .remove({ _id: req.params.noteid })
    .then(() => {
      res.send({});
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
