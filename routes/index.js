const express = require("express");
const employeeRoute = require("./employee");
const authRoute = require("./auth/auth");
const router = express.Router();
const path = require("path");

router.use(express.static(path.join(__dirname, "/../public")));
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/../public", "index.html"));
});

router.use("/", authRoute);
router.use("/employees", employeeRoute);

router.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "/../views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ msg: "error" });
  } else {
    res.type("txt").send("not found");
  }
});
module.exports = router;
