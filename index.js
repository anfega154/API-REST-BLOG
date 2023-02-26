const { conecction } = require("./database/conecction");
conecction();
const express = require("express");
const cors=require("cors")
const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//RUTAS

const routers_articles=require('./routers/article')

//ACARGAR RUTAS
app.use("/api",routers_articles);

const PORT = process.env.PORT || 3900;
app.listen(PORT, (req, res) => {
  console.log("server in  http://localHost:" + PORT);
});
