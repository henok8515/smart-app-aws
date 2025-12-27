const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Task = require("./model/Task");
const cache = require("./cache");
const { connectRabbit, sendToQueue } = require("./rabbit");
require("dotenv").config();
console.log("Node started");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3002;
mongoose
  .connect(
    "mongodb+srv://HenokEgezew:he0943851525@vpofile.ejxkb2i.mongodb.net/"
  )
  .then(() => {
    console.log("db connected sucessfuly");
  })
  .catch((err) => {
    console.log(err, "mongo unabale to conect to db");
  });

connectRabbit();

app.post("/tasks", async (req, res) => {
  const task = await Task.create({ title: req.body.title });
  await sendToQueue({ taskId: task._id });
  cache.delete("tasks");
  res.json(task);
});

app.get("/tasks", async (req, res) => {
  const cached = await cache.get("tasks");
  if (cached.value) {
    return res.json(JSON.parse(cached.value.toString()));
  }

  const tasks = await Task.find().sort({ createdAt: -1 });
  await cache.set("tasks", JSON.stringify(tasks), { expires: 60 });
  res.json(tasks);
});

app.listen(PORT, () => console.log("Backend running on port " + PORT));
