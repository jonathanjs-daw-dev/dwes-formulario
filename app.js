const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;

//servir estaticos dentro de public
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// gestionamos el get de /form
app.get("/form", (req, res) => {
  res.render("form", {
    nombre: "",
    edad: "",
    ciudad: "",
    intereses: [],
  });
});
// ahora gestionamos el post de /form
app.post("/form", (req, res) => {
  //primero capturamos las var que vengan del formulario
  //nombre, edad, ciudad, intereses
  //para poder recibirt en una peticion variables en la url, hay que activar en express el uso de urlencoded, que se puedan codificar en la url el envio de variables.

  const nombre = req.body.nombre;
  const edad = req.body.edad;
  const ciudad = req.body.ciudad;

  console.log("nombre::", nombre);
  console.log("edad::", edad);
  console.log("ciudad::", ciudad);

  let intereses = req.body.intereses || [];

  if (!Array.isArray(intereses)) intereses = [intereses]; // lo pasamos a array si no lo es.

  let errores = []; // cada error sera un mensaje distinto ya que se va a validar varias cosas.

  // - validar que el nombre exista y que tenga 2 caracteres o mas.
  if (!nombre || nombre.trim().length < 2) {
    errores.push("El nombre tiene que tener minimo 2 caracteres");
  }

  // - validar que ciudad no sea vacio
  if (!ciudad) {
    errores.push("La ciudad tiene que tener algun valor");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
