const mongoose = require("mongoose");
const uri = `mongodb+srv://ojjiz_dev:7gEgTJu97PFQLCUb@ojiiz.cbrbqjm.mongodb.net/ojiiz`;

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected...");
  })
  .catch((err) => {
    console.error(err);
  });
