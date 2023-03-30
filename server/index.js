const express = require("express");
const cors = require("cors")
const path = require("path")

const PORT = process.env.PORT || 3001;
let user_ip = ""

const app = express();
const api = require("./api")
app.use(cors({
  origin: '*'
}))




app.get('/', (req, res, next) => {
  console.log("hello")
  const ipAddress = req.ip
  res.send({ip: ipAddress})
  // res.sendFile(path.join(__dirname,"../","client", "build", "index.html"));
})

app.use(express.static(path.join(__dirname, '../', "client", "build")))


// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname,"../","client", "build", "index.html"));
// });

app.use('/api', api)


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

