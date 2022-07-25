const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 7000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

const mongoose = require("mongoose");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");

mongoose
  .connect(
    "mongodb+srv://sua:020322@test.2vd7h.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("connect well!!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World! ~~ 안녕하세요 ~~");
});

app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      userInfo,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  //요청 이메일 DB에서 찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.join({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    // user: 위의 DB에서 찾아온 사용자

    //비밀번호 일치하는지 검사
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      //비밀번호 일치하면 토큰 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 클라이언트의 쿠키에 저장
        // 저장은 쿠키 / localstorage 등 여러 곳에 저장할 수 있음. 어디에 저장해야 가장 안전한지는 아직까지 말이 많음
        res.cookie("x_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  // 여기까지 왔다는건 사용자 인증이 완료됐다는 거
  res.status(200).json({
    _id: req.user_id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.listen(port, () => {
  console.log(`example app listening on port ${port}`);
});
