const app = require("./app");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;

mongoose
   .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n13dpss.mongodb.net/?retryWrites=true&w=majority`
   )
   .then(() => {
      console.log("Connected to DB!");
      app.listen(port, () => {
         console.log("Listening to port: " + port);
      });
   })
   .catch((err) => console.log(err));
