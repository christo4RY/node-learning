const fs = require("fs");
const fsPromises = require("fs").promises;
const { format } = require("date-fns");
const path = require("path");
const { v4: uuid } = require("uuid");

module.exports = async function (message) {
  try {
    if (!fs.existsSync(`${__dirname}/logs`))
      await fsPromises.mkdir(`${__dirname}/logs`);

    const date = format(new Date(), "ddd-mmm-yyy");
    const data = `${date} \t ${uuid()} \t ${message} \n`;
    await fsPromises.appendFile(path.join(__dirname, "logs", "logs.txt"), data);
  } catch (error) {
    console.log(error);
  }
};
