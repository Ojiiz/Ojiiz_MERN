const mongoose = require("mongoose");
const uri = `mongodb+srv://sohaibsarwar:YDsv25WOlIT5CBjj@ojiiz.iovvayw.mongodb.net/ojiiz`;

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected...");
  })
  .catch((err) => {
    console.error(err);
  });
