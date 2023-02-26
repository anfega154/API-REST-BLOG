const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/mi_blog";
mongoose.set("strictQuery", true);
const conecction = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("conexion exitosa");
  } catch (error) {
    console.log(error);
    throw new Error("No se pudo conectar a base de datos ");
  }
};

module.exports = {
  conecction,
};
