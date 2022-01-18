const connection = require("../connection");

const checkUserChated = (from, to) => {
  return connection.query(
    `select exists(select 1 from chat_${from} where username = $1);`, [to]
  );
};

const getConversation = (from, to) => {
  return connection.query(
    `select conversation from chat_${from} where username =  $1;`, [to]
  );
};

const setConversation = ({ from, to, conversation }) => {
  return connection.query(
    `update chat_${from} set conversation = $1 where username = $2;`, [conversation, to]
  );
};

// my function test
const toAddMsg = async ({ from, to, msg, type, date }) => {

  let checkuser = await checkUserChated(from, to);
  if (!checkuser.rows[0].exists) {
    await connection.query(
      `insert into chat_${from} (username, conversation) values ($1, '[]');`, [to]
    );
  }

  // get old msgs from from this user
  let getConvers = await getConversation(from, to);
  let prev = getConvers.rows[0].conversation;
  prev = JSON.parse(prev);
  let conversation = { from, to, msg, type, date }
  conversation = [...prev, conversation];
  conversation = JSON.stringify(conversation);
  let setConv = await setConversation({
    from: from,
    to: to,
    conversation: conversation,
  });
  return setConv.command;
};

module.exports = toAddMsg;
