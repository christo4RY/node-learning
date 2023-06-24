const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/index");

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`server is running at port: localhost:${PORT}`);
});
