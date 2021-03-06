const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const fs = require("fs");
const auth = require("./routes/auth");
const posts = require("./routes/posts");
const users = require("./routes/users");
const subreddits = require("./routes/subreddits");
const passport = require("./passport-config");
// socket io

const io = require("socket.io")(http, {
  cors: { origin: `${process.env.CLIENT_HOST}`, methods: ["GET", "POST"] },
});
io.sockets.on("connection", (socket) => {
  console.log(`user with id ${socket.id}`);

  socket.on("join", (postId) => {
    socket.join(`room${postId}`);
  });
  socket.on("deletePost", (postId) => io.emit("postDeleted", postId));
  socket.on("deleteComment", (postId, commentId) =>
    io.to(`room${postId}`).emit("commentDeleted", commentId)
  );
  socket.on("addComment", (postId, comment) =>
    io.to(`room${postId}`).emit("commentAdded", comment)
  );
  socket.on("changeVote", (postId) => {
    io.emit("votesChanged", postId);
  });
});

// server

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes

app.use("/users", users);
app.use("/auth", auth);
app.use("/posts", posts);
app.use("/subreddits", subreddits);
app.use("/images", express.static("uploaded"));
// initialization

require("dotenv").config();
const dbConnData = {
  host: process.env.PGHOST || "127.0.0.1",
  port: process.env.PGPORT || 5432,
  database: process.env.PGDB || "",
  user: process.env.PGUSER || "",
  password: process.env.PGPASSWORD || "",
};

const { Client } = require("pg");
const client = new Client(dbConnData);

client.connect().then(() => {
  console.log("Connected to PostgreSQL database");
  const port = process.env.APP_PORT || 5000;

  // const createTables = fs.readFileSync("./db.sql").toString();
  // client.query(createTables);

  // const insertToTables = fs.readFileSync("./insert.sql").toString();
  // client.query(insertToTables);

  http.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
  });
});
