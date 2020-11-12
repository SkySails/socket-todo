let express = require("express");
let router = express.Router();
const cors = require("cors");
const short = require("short-uuid");
const validate = require("jsonschema").validate;

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(cors());

router.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS,PUT,PATCH,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,Content-Type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const reportSchema = {
  id: "/Report",
  type: "object",
  properties: {
    title: { type: "string" },
    status: { type: "string" },
    id: { type: "string" },
  },
  required: ["place", "type", "client", "times"],
};

const validateReport = (details) => {
  return validate(details, reportSchema);
};

let todos = [
  {
    title: "Example todo",
    status: "done",
    id: "6biW8WacUZpTZkreCcDaHS",
  },
];

router.get("/", (req, res) => {
  res.json(todos);
});

router.post("/", (req, res) => {});

router.get("/:id", (req, res) => {
  let todo = todos.find((todo) => todo.id === req.params.id);
  res.json(todo);
});

router.get("/:id", (req, res) => {
  let todo = todos.find((todo) => todo.id === req.params.id);
  res.json(todo);
});

module.exports = router;
