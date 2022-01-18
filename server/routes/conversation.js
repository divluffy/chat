const getConverstion = require("express").Router();
const getConverstionDB = require("../DB/log/conversation");

getConverstion.get("/:username", async (req, res) => {
    let datas = {
        user: req.user,
        username: req.params.username
    }
    try {
        const data = await getConverstionDB(datas);
        res.json(data)
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = getConverstion;
