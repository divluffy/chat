const connection = require("../connection");

const getUser = async (username) => {
  let { rows } = await connection.query(`select * from users where username = $1;`, [
    username,
  ]);
  return rows[0]
};
module.exports = getUser;
