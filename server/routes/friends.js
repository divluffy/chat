const getFriends = require("../DB/log/get-friends");
const friends = require("express").Router();

friends.get("/", async (req, res) => {
  try {
    const users = await getFriends(req.user);
    res.json(users)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = friends;
