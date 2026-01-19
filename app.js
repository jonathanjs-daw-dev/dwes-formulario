const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;

//servir estaticos dentro de public
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.get("/form", (req, res) => {
  res.render("form", {
    nombre: '',
    edad: '',
    ciudad: '',
    intereses: []
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
