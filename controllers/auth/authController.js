const bcrypt = require("bcrypt");
const fs = require("fs/promises");
const jwt = require("jsonwebtoken");

const path = require("path");
const users = {
  getUsers: require("./../../data/auth.json"),
  setUsers(users) {
    this.getUsers = users;
  },
};
const register = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password)
    res.status(400).json({ message: "please fill fields" });
  const duplicateUser = users.getUsers.find(
    (user) => user.username === username
  );
  if (duplicateUser) res.sendStatus(409);
  try {
    const hashedPwd = bcrypt.hashSync(password, 10);
    const newUser = {
      id: users.getUsers.length + 1,
      username: username,
      password: hashedPwd,
      roles: { User: 3 },
    };
    users.setUsers([...users.getUsers, newUser]);
    await fs.writeFile(
      path.join(__dirname, "..", "..", "data", "auth.json"),
      JSON.stringify([...users.getUsers])
    );
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
  const foundUser = users.getUsers.find((user) => user.username === username);
  if (!foundUser) res.sendStatus(401);

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

    const otherUsers = users.getUsers.filter(
      (user) => user.username !== foundUser.username
    );
    const currentUser = users.getUsers.find(
      (user) => user.username == foundUser.username
    );
    const addRefreshToken = { ...currentUser, refreshToken };
    await fs.writeFile(
      path.join(__dirname, "..", "..", "data", "auth.json"),
      JSON.stringify([...otherUsers, addRefreshToken])
    );
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
  const foundUser = users.getUsers.find(
    (user) => user.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: false });
    return res.sendStatus(204);
  }
  const otherUsers = users.getUsers.filter(
    (user) => user.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" };
  users.setUsers([...otherUsers, currentUser]);
  await fs.writeFile(
    path.join(__dirname, "..", "..", "data", "auth.json"),
    JSON.stringify([...users.getUsers])
  );
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: false });
  res.sendStatus(204);
};

const refreshToken = (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) res.sendStatus(401);
  const refreshToken = cookie.jwt;

  const foundUser = users.getUsers.find(
    (user) => user.refreshToken === refreshToken
  );
  if (!foundUser) res.sendStatus(403);

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
