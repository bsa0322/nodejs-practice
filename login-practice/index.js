const express = require("express");
const app = express();
const port = 7000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const mongoose = require("mongoose");
const { User } = require("./models/User");

mongoose
  .connect(
    "mongodb+srv://sua:020322@test.2vd7h.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("connect well!!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World! ~~ 안녕하세요 ~~");
});

app.post("/register", (req, res) => {
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`example app listening on port ${port}`);
});
