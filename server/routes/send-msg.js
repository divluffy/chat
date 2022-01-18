const multer = require("multer");
const fs = require("fs");
const sendToAddMsg = require("../DB/log/send-msg");
const connection = require("../DB/connection");
const sendmsg = require("express").Router();

// send msg text
sendmsg.post("/", async (req, res) => {
  let msg = {
    from: req.user,
    ...req.body,
    date: Date.now(),
  };
  try {
    const send = await sendToAddMsg(msg);
    res.json(send);
  } catch (err) {
    res.status(500).json(err);
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, req.pathy);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).single("file");

sendmsg.post("/file/", async (req, res) => {
  let pathy = `storge/users/${req.user}`;
  if (!fs.existsSync(pathy)) {
    fs.mkdirSync(pathy);
  }
  req.pathy = pathy;
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json(err);
    } else {
      let message = JSON.parse(req.body.message);
      let { type, to } = message;
      let msg = {
        from: req.user,
        type,
        to,
        msg: `/users/${req.user}/${req.file.filename}`,
        date: Date.now(),
      };

      try {
        const send = await sendToAddMsg(msg);
        if (send === 'UPDATE') {
          let selectKey = await connection.query(
            `select * from ids where username = $1;`,
            [msg.to]
          );
          let { key: keyTo, state } = selectKey.rows[0];
          if (state === "on") {
            req.socketMe.to(keyTo).emit("recive_msg", msg);
          }
        }
        res.json(send);
      } catch (err) {
       res.status(500).json(err);
      }
    }
  });
});

module.exports = sendmsg;
