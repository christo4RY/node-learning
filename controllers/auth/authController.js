const UserSchema = require("./../../models/auth/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password)
    res.status(400).json({ message: "please fill fields" });

  const duplicateUser = await UserSchema.findOne({ username }).exec();
  if (duplicateUser) return res.sendStatus(409);
  try {
    const hashedPwd = bcrypt.hashSync(password, 10);

    const newUser = await UserSchema.create({
      username: username,
      password: hashedPwd,
    });
    res
      .status(201)
      .json({ message: `New user is ${newUser.username} created!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password)
    res.status(400).json({ message: "please fill fields" });
  const foundUser = await UserSchema.findOne({ username }).exec();
  if (!foundUser) return res.sendStatus(401);

  const match = await bcrypt.compareSync(password, foundUser.password);
  if (match) {
    //create JWT
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles,
        },
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles,
        },
      },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "1d",
      }
    );

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ token: accessToken });
  } else {
    res.sendStatus(401);
  }
  res.end();
};

const logout = async (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) res.sendStatus(401);
  const refreshToken = cookie.jwt;
  const foundUser = await UserSchema.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: false });
    return res.sendStatus(204);
  }
  foundUser.refreshToken = "";
  await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: false });
  res.sendStatus(204);
};

const refreshToken = async (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) res.sendStatus(401);
  const refreshToken = cookie.jwt;

  const foundUser = await UserSchema.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
    if (err || decoded.username !== foundUser.username) res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "30s",
      }
    );
    res.json({ token: accessToken });
  });
};
module.exports = {
  register,
  login,
  logout,
  refreshToken,
};
