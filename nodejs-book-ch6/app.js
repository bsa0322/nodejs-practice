const express = require("express");
const path = require("path");

const app = express();

// 서버에 포트라는 속성을 심는다. 전역변수 느낌
app.set("port", process.env.PORT || 8080);

// 미들웨어: next를 해야 다음 작업이 실행됨
app.use(
  (req, res, next) => {
    console.log("모든 요청에 실행하고 싶어요");
    // 이걸 해야 다음 라우터들 중 해당하는 것 찾아서 실행
    next();
  }
  //   (req, res, next) => {
  //     try {
  //       console.log(nonDefined);
  //     } catch (error) {
  //       // 에러 처리 미들웨어로 바로 보내줌
  //       next(error);
  //     }
  //   }
  //   에러코드
  //   (req, res) => {
  //     throw new Error("에러야");
  //   }
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/about", (req, res) => {
  res.send("hello about");
});

// 404 처리 미들웨어
// 라우터 모두 돌았는데 못 찾았다..그럼 요청을 알 수 없는 거니까 404 에러라 볼 수 있음
app.use((req, res, next) => {
  res.send("404지롱");
});

app.use((err, req, res, next) => {
  console.error(err);
  // 이런 식으로 상태를 바꿔서 보내서 해커들에 눈속임을 할 수 있음
  res.status(200).send("에러났지롱. 근데 안알려주지롱");
});

// listen : 포트 열어서 익스프레스 서버 실행
app.listen(app.get("port"), () => {
  console.log("익스프레스 서버 실행");
});
