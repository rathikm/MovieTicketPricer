const express = require("express");
const cors = require("cors")
const path = require("path")

const PORT = process.env.PORT || 3001;

const app = express();

const api = require("./api")

app.use(express.static(path.join(__dirname + "../client/build")))
app.use(cors())
app.use('/api', api)

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});