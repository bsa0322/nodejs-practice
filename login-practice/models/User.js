const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        console.log("암호화 완료!");
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, callBack) {
  //plainPassword를 암호화해서 암호화된 비밀번호와 같은지 확인
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return callBack(err);
    callBack(null, isMatch);
  });
};

// JWT 토큰 생성
userSchema.methods.generateToken = function (callBack) {
  const user = this;

  const token = jwt.sign(user._id.toHexString(), "secretToken");

  // user id + secret key -> token (인코드)
  // secret key + token -> user id (디코드)

  user.token = token;
  user.save(function (err, user) {
    if (err) return callBack(err);
    callBack(null, user);
  });
};

// 토큰 복호화하는 함수
userSchema.statics.findByToken = function (token, callBack) {
  const user = this;

  // 토큰을 decode한다.
  jwt.verify(token, "secretToken", function (err, decoded) {
    // 유저 아이디를 이용해서 유저 찾은 다음에
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return callBack(err);
      callBack(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
