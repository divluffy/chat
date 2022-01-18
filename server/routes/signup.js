const signup = require("express").Router();
const jwt = require("jsonwebtoken");
require("env2")("config.env");
const multer = require('multer')
const fs = require("fs");
const newSignup = require("../DB/log/signup");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let pathy = `storge/users/${file.originalname.split('.')[0]}`
    if (!fs.existsSync(pathy)) {
      fs.mkdirSync(pathy);
    }
    req.pathy = pathy
    cb(null, req.pathy)
  },
  filename: (req, file, cb) => {

    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage }).single('file')

signup.post("/", async (req, res) => {

  upload(req, res, async (err) => {
    if (err) {
      console.log('its ni img upload');
      return res.status(500).json(err)
    } else {
      let dataNew = JSON.parse(req.body.info)
      let data = {
        ...dataNew,
        cover: `/users/${dataNew.username}/${req.file.filename}`,
      }
      try {
        const check = await newSignup(data);
        if (check) {
          let payLoad = {
            username: data.username,
            password: data.password,
          };
          const token = jwt.sign(payLoad, process.env.SECRET, { expiresIn: "30d" });
          res.cookie("token", token, { httpOnly: false, secure: true });
          res.json({ check });
        } else {
          res.json({ toLogin: false });
        }
      } catch (err) {
        res.status(500).json(err);
      }


    }
  })

});

module.exports = signup;
