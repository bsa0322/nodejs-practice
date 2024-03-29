const { User } = require("../models/User");

const auth = (req, res, next) => {
  // 인증 처리 하는 부분
  // 클라이언트 쿠키에서 토큰 가져오기
  const token = req.cookies.x_auth;

  // 토큰을 복호화 한 후, 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next();
  });

  // 유저가 있으면 인증 Okay
  // 유저가 없으면 인증 No!
};

module.exports = { auth };
