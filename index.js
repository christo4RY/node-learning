// charpter 1

// console.log("hello");
// const path = require("path");
// console.log(__dirname);
// console.log(__filename);
// console.log(path.dirname(__dirname));
// console.log(path.basename(__filename));
// console.log(path.extname(__filename));
// console.log(path.join(__dirname, path.basename(__filename)));

// charpter 2
// const fs = require("fs").promises;
// const path = require("path");

// const files = async () => {
//   const read = await fs.readFile(path.join(__dirname, "files", "lorem.txt"), {
//     encoding: "utf-8",
//   });
//   await fs.writeFile(path.join(__dirname, "files", "new.txt"), "hhhh yyyy");
//   await fs.appendFile(
//     path.join(__dirname, "files", "new.txt"),
//     "\n\nhhhh yyyy"
//   );
//   await fs.rename(
//     path.join(__dirname, "files", "new.txt"),
//     path.join(__dirname, "files", "nn.txt")
//   );
//   await fs.unlink(path.join(__dirname, "files", "new1.txt"));
// };

// files();
// callback api
// fs.readFile(
//   path.join(__dirname, "files", "lorem.txt"),
//   "utf-8",
//   (err, data) => {
//     if (err) throw err;
//     console.log(data);
//   }
// );

// fs.writeFile(path.join(__dirname, "files", "new.txt"), "hey man", (err) => {
//   if (err) throw err;
// });
// fs.appendFile(path.join(__dirname, "files", "new.txt"), "\nhello ", (err) => {
//   if (err) throw err;
// });
// fs.rename(
//   path.join(__dirname, "files", "new.txt"),
//   path.join(__dirname, "files", "new1.txt"),
//   (err) => {
//     if (err) throw err;
//   }
// );

// process.on("uncaughtException", (err) => {
//   console.log(err);
//   process.exit(1);
// });

// charpter 4
// const logFile = require("./logFile");
// const EventEmitter = require("events");

// const myEmitter = new EventEmitter();

// myEmitter.on("log", (message) => logFile(message));
// setTimeout(() => {
//   myEmitter.emit("log", "hello world");
// }, 2000);
