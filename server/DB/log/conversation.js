const connection = require('../connection')

const getConversation = (user1, user2) => {
    return connection.query(`select conversation from chat_${user1} where username = $1;`, [user2])
}

const getConverstionDB = async ({ user, username }) => {
    let getChats = await getConversation(user, username)
    let getChats2 = await getConversation(username, user)
    let prev = getChats.rows.length > 0 ? getChats.rows[0].conversation : '[]'
    let prev2 = getChats2.rows.length > 0 ? getChats2.rows[0].conversation : '[]'
    prev = JSON.parse(prev)
    prev2 = JSON.parse(prev2)
    let all = [...prev, ...prev2]
    let result = all.sort(function (a, b) {
        return (b.date - a.date) || 0;
    }).reverse()
    return result
}

module.exports = getConverstionDB;
