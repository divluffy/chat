
const connection = require("../connection");
const timeSince = require("../../tools/date-since");

const allFriends = async (user) => {
  let { rows } = await connection.query(`select * from users;`);
  return rows
};

const getFriends = async (user) => {
  let friends = await allFriends(user)
  let arr = []
  for (let i = 0; i < friends.length; i++) {
    let { username, fullname, avatar, lastseen } = friends[i]
    let last = timeSince(lastseen)
    user === username ? null : arr.push({ username, fullname, avatar, lastseen: last })
  }

  return arr
}

module.exports = getFriends