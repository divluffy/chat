
const connection = require("../connection");
const createChat = (username) => {
    return connection.query(`
    CREATE TABLE chat_${username}(
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        conversation TEXT NOT NULL
    );`)
}

const newSignup = async ({ username, password, fname, email, cover }) => {
    let datajoin = Date.now()
    let lastseen = new Date()
    let insert1 = await connection.query(`insert into users (username, email, password, fullname, avatar, datajoin, lastseen) values ($1, $2, $3, $4, $5, $6, $7 );
    `, [username, email, password, fname, cover, datajoin, lastseen]);
    let insert2 = await connection.query(`insert into ids (username, key, state) values ($1, '', 'off');`, [username]);
    let insert3 = await createChat(username)
    if (insert3.command === 'CREATE' && insert2.command === 'INSERT' && insert1.command === 'INSERT') {
        return true
    }
}

module.exports = newSignup