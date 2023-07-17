const bcrypt = require("bcrypt");
const fs = require("fs/promises");
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
    };
    users.setUsers([...users.getUsers, newUser]);
    await fs.writeFile(
      path.join(__dirname, "..", "..", "data", "auth.json"),
      JSON.stringify([...users.getUsers, newUser])
    );
    res
      .status(201)
      .json({ message: `New user is ${newUser.username} created!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.end();
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
    res.json({ success: `User ${username} is Logged in` });
  } else {
    res.sendStatus(401);
  }
  res.end();
};

module.exports = {
  register,
  login,
};
