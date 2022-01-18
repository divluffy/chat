const emoji = require("express").Router();
const path = require('path')
const fs = require('fs')

emoji.post("/:type/:page", async (req, res) => {
    let { page, type } = req.params
    if (type === 'love') {
        return
    }
    let countImg = 30 * page
    let allImg = []
    let fileNames = fs.readdirSync(path.join(__dirname, '../', 'storge', `${type}`));
    allImg = []
    allImg = [...fileNames.slice(countImg - 30, countImg)]
    res.send(allImg)
});

module.exports = emoji;
