const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});[]

const PORT = 7000;
const router = require("./routes");
const connection = require("./DB/connection");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    secure: false,
    httpOnly: false,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, ".", "storge")));

app.get("/", (req, res) => {
  res.json({ msg: "hi hi hi" });
});

const getParamsIOtoReq = (req, res, next) => {
  req.socketMe = io
  next()
}
app.use("/api", getParamsIOtoReq, router);
let users = [];

io.on("connection", async (socket) => {
  // connection users online
  socket.on("new_user", async (username) => {
    // console.log('new ref',socket.id );
    let upUser = await connection.query(
      `update ids set key = $1, state = $2 where username = $3;`,
      [socket.id, "on", username]
    );
    users = await connection.query(`select * from ids`);
    users = users.rows;
    let usersONline = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].state === "on") {
        usersONline.push(users[i].username);
      }
    }
    io.emit("onlines", usersONline);
  });

  // diسconnection users
  socket.on("disconnect", async () => {
    let selectRow = await connection.query(`select * from ids where key = $1;`, [socket.id]);
    if (selectRow.rows.length > 0) {
      let { username } = await selectRow.rows[0]
      let upUser = await connection.query(
        `update ids set state = $1 where username = $2;`,
        ['off', username]
      );
      users = await connection.query(`select * from ids`);
      users = users.rows
      let usersONline = []
      for (let i = 0; i < users.length; i++) {
        if (users[i].state === 'on') {
          usersONline.push(users[i].username)
        }
      }

      io.emit("onlines", usersONline);
    }
  });

  //users send msgs
  socket.on("send_msg", async (msg) => {
    msg = JSON.parse(msg)
    let selectKey = await connection.query(
      `select * from ids where username = $1;`,
      [msg.to]
    );
    let { key: keyTo, state } = selectKey.rows[0];
    if (state === "on") {
      io.to(keyTo).emit("recive_msg", msg);
    }
  });

  // start with feature call video users
  // not complete yet 

  socket.on("sendCall", async ({ to, from, id }) => {
    let getID = await connection.query(
      `select * from ids where username = $1;`,
      [to]
    );
    let { key } = getID.rows[0];
    let getAvatar = await connection.query(
      `select avatar from users where username = $1;`,
      [from]
    );
    io.to(key).emit("sendCallToUser", { from, to, id, avatar: getAvatar.rows[0].avatar });
  });
  
  socket.on("answerCall", async (data) => {
    let selectKey = await connection.query(
      `select * from ids where username = $1;`,
      [data.to]
    );
    let avatarUser = await connection.query(
      `select * from users where username = $1;`,
      [data.from]
    );
    let { avatar, fullname } = avatarUser.rows[0];
    let { key: keyTo } = selectKey.rows[0];
    io.to(keyTo).emit("callAccepted", { signal: data.signal, avatar, fullname, fom: data.from })
  });

  socket.on("rejectCall", async ({ from, to }) => {
    if (!from || !to) return
    let getID = await connection.query(
      `select * from ids where username = $1;`,
      [from]
    );
    let { key } = getID.rows[0];
    io.to(key).emit("rejected");
  })

  /////////////////////////////////////////////
  socket.on("callUser", async ({ signalData, from, to, type }) => {
    if (type !== 'sender') return
    let selectKey = await connection.query(
      `select * from ids where username = $1;`,
      [to]
    );

    let { key, username } = selectKey.rows[0];
    console.log('call to ', from, ' to ', to);
    io.to(key).emit("callUser", { signal: signalData })
  })

  socket.on("answerCall", async ({ signal, from, to }) => {
    let selectKey = await connection.query(
      `select * from ids where username = $1;`,
      [from]
    );
    console.log('answer  ', from, ' to ', to);
    let { key } = selectKey.rows[0];
    io.to(key).emit("callAccepted", signal)
  })
  //////////////////////////////////////////////////////////
});

httpServer.listen(PORT, () => {
  console.log(`run in http://localhost:${PORT}`);
});
