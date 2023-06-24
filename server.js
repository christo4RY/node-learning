const http = require("http");
const fs = require("fs");
const path = require("path");
const logFile = require("./logFile");
const fsPromises = require("fs").promises;
const event = require("events");
const myEvent = new event();

const PORT = process.env.PORT || 3000;

const serverFile = async (filePath, contentType, res) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes("css") ? "utf8" : ""
    );

    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    res.writeHead(200, {
      "Content-Type": contentType,
    });
    logFile("success");
    res.end(contentType === "application/json" ? JSON.stringify(data) : data);
  } catch (error) {
    console.log(error);
    res.writeHead(500);
    res.end(error);
  }
};

myEvent.on("load", function first(data) {
  console.log(data);
});
const server = http.createServer((req, res) => {
  const extension = path.extname(req.url);
  let contentType;
  switch (extension) {
    case ".css":
      contentType = "style/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    default:
      contentType = "text/html";
      break;
  }
  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);

  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  const fileExist = fs.existsSync(filePath);
  if (fileExist) {
    serverFile(filePath, contentType, res);
  } else {
    switch (path.parse(req.url).base) {
      case "index.json":
        res.writeHead(301, { Location: "/new.html" });
        res.end();
        break;
      default:
        serverFile(path.join(__dirname, "views", "404.html"), "text/html", res);
        break;
    }
  }
});

console.log(myEvent.listeners("load"));
server.listen(PORT, () => {
  myEvent.emit("load", "helloworld");
  console.log(`server is running at port: localhost:${PORT}`);
});
