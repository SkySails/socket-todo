const express = require("express");
const app = express();
const http = require("http").createServer(app);
const reload = require("reload");
var io = require("socket.io")(http);
const short = require("short-uuid");
const validate = require("jsonschema").validate;

const port = process.env.PORT || 3000;

// Schema for a valid todo
const todoSchema = {
  id: "/Todo",
  type: "object",
  properties: {
    title: { type: "string", minLength: 1 },
    status: { type: "string" },
    id: { type: "string" },
  },
  required: ["title", "status", "id"],
};

app.use(express.static("public"));

let todos = {
  todo: [],
  progress: [],
  done: [],
};

io.on("connection", (socket) => {
  io.emit("init", todos);

  socket.on("create", ({ title, initialStatus }) => {
    // console.log(todos, initialStatus);
    let todo = {
      title,
      status: initialStatus,
      id: short.generate(),
      order: (todos[initialStatus] && todos[initialStatus].length) || 0,
    };

    validate(todo, todoSchema).valid &&
      todos[initialStatus].push(todo) &&
      io.emit("init", todos);
  });

  socket.on("update", (newTodos) => {
    todos = newTodos;
    console.log(todos);
    io.emit("init", todos);
  });
});

// Reload started, start web server
http.listen(port, () => {
  console.log("app listening on port:" + port);
});

reload(app);
