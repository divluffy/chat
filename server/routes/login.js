const checkLogin = require("../DB/log/check-login");
const login = require("express").Router();
const jwt = require("jsonwebtoken");
require("env2")("config.env");

login.post("/", async (req, res) => {
  let { username, password } = req.body;
  try {
    const data = await checkLogin(username, password);
    if (data.toLogin) {
      let payLoad = {
        username,
        password
      };
      const token = jwt.sign(payLoad, process.env.SECRET, { expiresIn: "30d" });
      res.cookie("token", token, { httpOnly: false, secure: true });
      res.json(data);
    } else {
      res.json({ toLogin: false });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = login;
