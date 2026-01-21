// ============================================================================
// IMPORTACIÓN DE MÓDULOS (DEPENDENCIES)
// ============================================================================

/*
  ¿Qué es "require"?
  -----------------
  require() es la forma de importar módulos en Node.js cuando usamos CommonJS.
  Un módulo es un archivo o paquete que contiene código reutilizable.
  
  Piensa en los módulos como "cajas de herramientas" que contienen funciones
  y utilidades que podemos usar en nuestro proyecto.
*/

// Importamos Express: un framework que facilita la creación de servidores web
// Express nos proporciona métodos para manejar rutas, peticiones y respuestas HTTP
const express = require("express");

// Importamos el módulo "path": una utilidad nativa de Node.js para trabajar con rutas de archivos
// Nos ayuda a construir rutas de archivos de forma segura, independientemente del sistema operativo
const path = require("path");

// ============================================================================
// INICIALIZACIÓN DE LA APLICACIÓN EXPRESS
// ============================================================================

/*
  Creamos una instancia de Express llamando a la función express()
  Esta instancia (app) será nuestro servidor web y contendrá toda la lógica
  de rutas, middlewares y configuración.
*/
const app = express();

// ============================================================================
// CONFIGURACIÓN DEL PUERTO
// ============================================================================

/*
  Definimos el puerto donde escuchará nuestro servidor.
  Un puerto es como una "puerta" de entrada al servidor.
  El puerto 3000 es común para desarrollo local.
  
  Cuando ejecutamos el servidor, podremos acceder en: http://localhost:3000
*/
const PORT = 3000;

// ============================================================================
// MIDDLEWARE: ARCHIVOS ESTÁTICOS
// ============================================================================

/*
  ¿Qué es un middleware?
  ----------------------
  Un middleware es una función que se ejecuta ENTRE la petición del cliente
  y la respuesta del servidor. Es como un "filtro" o "procesador intermedio".
  
  Flujo: Cliente → Middleware → Servidor → Middleware → Cliente
  
  app.use(): registra un middleware que se ejecutará en todas las peticiones
*/

/*
  express.static(): middleware que sirve archivos estáticos (HTML, CSS, JS, imágenes)
  
  path.join(__dirname, "public"):
  - __dirname: variable global que contiene la ruta absoluta del directorio actual
  - "public": nombre de la carpeta donde guardamos archivos estáticos
  - path.join(): une las rutas de forma segura
  
  Resultado: todos los archivos en /public estarán disponibles públicamente
  Ejemplo: public/index.html será accesible en http://localhost:3000/index.html
*/
app.use(express.static(path.join(__dirname, "public")));

// ============================================================================
// CONFIGURACIÓN DEL MOTOR DE PLANTILLAS (VIEW ENGINE)
// ============================================================================

/*
  Motor de plantillas: EJS (Embedded JavaScript)
  ----------------------------------------------
  EJS permite crear HTML dinámico, mezclando HTML con JavaScript.
  
  ¿Por qué usar plantillas?
  - Podemos insertar datos dinámicos en el HTML
  - Reutilizamos código (headers, footers, etc.)
  - Creamos condicionales y bucles dentro del HTML
  
  Ejemplo de sintaxis EJS:
  - <%= variable %>: muestra el valor de una variable
  - <% código %>: ejecuta código JavaScript
  - <%- html %>: inserta HTML sin escapar
*/
app.set("view engine", "ejs");

// ============================================================================
// MIDDLEWARE: PARSEO DE DATOS DEL FORMULARIO
// ============================================================================

/*
  express.urlencoded(): middleware que parsea (analiza) datos de formularios
  
  ¿Qué hace?
  ----------
  Cuando un formulario se envía con method="POST", los datos viajan
  codificados en el cuerpo (body) de la petición en formato:
  nombre=Juan&edad=25&ciudad=Madrid
  
  Este middleware convierte esos datos en un objeto JavaScript accesible
  mediante req.body
  
  Parámetro { extended: true }:
  - true: permite parsear objetos complejos y arrays
  - false: solo parsea strings y arrays simples
  
  Sin este middleware, req.body sería undefined
*/
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// MIDDLEWARE: TIMEOUT (TIEMPO DE ESPERA)
// ============================================================================

/*
  Middleware personalizado para manejar timeouts
  ----------------------------------------------
  Este middleware evita que las peticiones se queden "colgadas" indefinidamente.
  
  (req, res, next) son los 3 parámetros típicos de un middleware:
  - req (request): objeto con información de la petición del cliente
  - res (response): objeto para enviar respuestas al cliente
  - next: función que ejecuta el siguiente middleware en la cadena
*/
app.use((req, res, next) => {
  // Definimos el tiempo máximo de espera en milisegundos
  const ms = 10000; // 10 segundos (10000 ms = 10 seg)

  /*
    setTimeout(): función que ejecuta código después de un tiempo determinado
    Es como un temporizador: "ejecuta esto después de X tiempo"
  */
  const timer = setTimeout(() => {
    /*
      res.headersSent: propiedad booleana que indica si ya se enviaron
      las cabeceras HTTP al cliente.
      
      Si ya se enviaron, significa que la respuesta ya fue procesada
      y no debemos enviar otra (causaría un error)
    */
    if (!res.headersSent) {
      // Si aún no se envió respuesta, registramos en consola
      console.warn("Tiempo de espera agotado.");

      // Enviamos respuesta con código 408 (Request Timeout)
      res.status(408).send("Tiempo de espera agotado.");
    }
  }, ms);

  /*
    Limpiamos el temporizador cuando la respuesta termine
    ---------------------------------------------------
    res.once(): escucha un evento UNA SOLA VEZ
    
    "finish": se dispara cuando la respuesta se envía completamente
    "close": se dispara cuando la conexión se cierra
    
    clearTimeout(): cancela el temporizador para que no se ejecute
    
    ¿Por qué hacemos esto?
    Para evitar que se ejecute el timeout si la petición ya fue respondida
  */
  res.once("finish", () => clearTimeout(timer));
  res.once("close", () => clearTimeout(timer));

  /*
    next(): llama al siguiente middleware o ruta en la cadena
    Sin esto, la petición se quedaría atascada aquí
  */
  next();
});

// ============================================================================
// RUTAS (ROUTES)
// ============================================================================

/*
  Las rutas definen cómo responde el servidor a diferentes URLs y métodos HTTP
  
  Métodos HTTP principales:
  - GET: solicitar/leer datos (ejemplo: cargar una página)
  - POST: enviar/crear datos (ejemplo: enviar un formulario)
  - PUT: actualizar datos completos
  - PATCH: actualizar datos parciales
  - DELETE: eliminar datos
*/

// ============================================================================
// RUTA GET: /form (MOSTRAR FORMULARIO)
// ============================================================================

/*
  app.get(ruta, callback):
  - Define una ruta que responde a peticiones GET
  - "/form": la URL que activará esta ruta
  - (req, res): función callback que se ejecuta cuando alguien accede a esta ruta
  
  ¿Cuándo se activa?
  Cuando el usuario escribe en el navegador: http://localhost:3000/form
*/
app.get("/form", (req, res) => {
  /*
    res.render(vista, datos):
    - Renderiza (genera) una vista EJS y la envía al cliente
    - "form": busca el archivo views/form.ejs
    - Segundo parámetro: objeto con datos que se pasan a la vista
    
    ¿Por qué pasamos datos vacíos?
    ------------------------------
    En la primera visita, el formulario debe estar vacío.
    Pero si hay errores de validación, volveremos a mostrar el formulario
    con los datos que el usuario había escrito, para que no los pierda.
    
    Esta es la "carga inicial" del formulario, por eso todo está vacío.
  */
  res.render("form", {
    nombre: "", // Campo nombre vacío
    edad: "", // Campo edad vacío
    ciudad: "", // Campo ciudad sin selección
    intereses: [], // Array vacío de intereses (checkboxes sin marcar)
  });
});

// ============================================================================
// RUTA POST: /form (PROCESAR FORMULARIO)
// ============================================================================

/*
  app.post(ruta, callback):
  - Define una ruta que responde a peticiones POST
  - Se activa cuando el formulario se envía con method="POST"
  
  ¿Qué hace esta ruta?
  1. Recibe los datos del formulario
  2. Valida los datos
  3. Si hay errores: vuelve a mostrar el formulario con mensajes de error
  4. Si todo está bien: muestra una página de confirmación
*/
app.post("/form", (req, res) => {
  // ========================================================================
  // PASO 1: CAPTURAR DATOS DEL FORMULARIO
  // ========================================================================

  /*
    req.body: objeto que contiene los datos del formulario
    -------------------------------------------------------
    Gracias al middleware express.urlencoded(), los datos del formulario
    están disponibles en req.body
    
    El nombre de cada propiedad corresponde al atributo "name" del input:
    <input name="nombre"> → req.body.nombre
    <input name="edad"> → req.body.edad
    <select name="ciudad"> → req.body.ciudad
  */

  const nombre = req.body.nombre;
  const edad = req.body.edad;
  const ciudad = req.body.ciudad;

  // Mostramos en consola del servidor los datos recibidos (útil para depuración)
  console.log("nombre::", nombre);
  console.log("edad::", edad);
  console.log("ciudad::", ciudad);

  /*
    Manejo especial de CHECKBOXES
    ------------------------------
    Los checkboxes son especiales:
    - Si NO se marca ninguno: req.body.intereses es undefined
    - Si se marca UNO solo: req.body.intereses es un string "deportes"
    - Si se marcan VARIOS: req.body.intereses es un array ["deportes", "peliculas"]
    
    Problema: necesitamos que SIEMPRE sea un array para poder trabajar con él
    Solución: normalizamos los datos
  */

  // Operador ||: si intereses es undefined/null, usamos array vacío []
  let intereses = req.body.intereses || [];

  /*
    Array.isArray(): verifica si una variable es un array
    Si intereses NO es un array (es un string), lo convertimos a array con [intereses]
    
    Ejemplos:
    - intereses = undefined → [] (por el || anterior)
    - intereses = "deportes" → ["deportes"] (lo envolvemos en array)
    - intereses = ["deportes", "peliculas"] → queda igual (ya es array)
  */
  if (!Array.isArray(intereses)) intereses = [intereses];

  // ========================================================================
  // PASO 2: VALIDACIÓN DE DATOS
  // ========================================================================

  /*
    Validación: proceso de verificar que los datos cumplan ciertas reglas
    ---------------------------------------------------------------------
    Aunque el HTML tiene validación (required, min, etc.), NUNCA debemos
    confiar solo en ella porque:
    1. Puede ser desactivada desde el navegador
    2. Alguien podría enviar datos directamente sin usar el formulario
    3. La seguridad SIEMPRE se valida en el servidor
  */

  // Array para almacenar mensajes de error
  let errores = [];

  // VALIDACIÓN 1: El nombre debe existir y tener al menos 2 caracteres
  /*
    Condiciones que revisamos:
    - !nombre: verifica si nombre es falsy (undefined, null, "", 0, false)
    - nombre.trim(): elimina espacios al inicio y final
    - .length < 2: verifica si tiene menos de 2 caracteres
    
    ¿Por qué trim()?
    Si el usuario escribe "   " (solo espacios), sin trim() pasaría la validación
  */
  if (!nombre || nombre.trim().length < 2) {
    // array.push(): agrega un elemento al final del array
    errores.push("El nombre tiene que tener minimo 2 caracteres");
  }

  // VALIDACIÓN 2: La ciudad debe tener algún valor
  /*
    !ciudad: si ciudad está vacía (string vacío ""), es falsy
  */
  if (!ciudad) {
    errores.push("La ciudad tiene que tener algun valor");
  }

  // ========================================================================
  // PASO 3: MANEJO DE ERRORES
  // ========================================================================

  /*
    Si hay errores, NO procesamos el formulario
    En su lugar, volvemos a mostrar el formulario con:
    1. Los mensajes de error
    2. Los datos que el usuario había escrito (para que no los pierda)
  */
  if (errores.length) {
    /*
      return: detiene la ejecución de la función aquí
      Sin return, el código continuaría y se ejecutarían ambas respuestas (error)
    */
    return res
      .status(400) // Código HTTP 400: Bad Request (petición incorrecta)
      .render("form", {
        // Re-enviamos los datos que el usuario escribió
        nombre,
        edad,
        ciudad,
        intereses,
        // Además, enviamos el array de errores para mostrarlos en la vista
        errores,
      });
  }

  // ========================================================================
  // PASO 4: ÉXITO - MOSTRAR PÁGINA DE RESULTADO
  // ========================================================================

  /*
    Si llegamos aquí, es porque NO hubo errores
    Renderizamos la página de confirmación con los datos validados
    
    edad || null: si edad está vacía, enviamos null (buena práctica)
  */
  res.render("resultado", {
    nombre,
    edad: edad || null,
    ciudad,
    intereses,
  });
});

// ============================================================================
// INICIAR EL SERVIDOR
// ============================================================================

/*
  app.listen(puerto, callback):
  - Inicia el servidor y lo pone a "escuchar" en el puerto especificado
  - Cuando el servidor esté listo, ejecuta la función callback
  
  ¿Qué significa "escuchar"?
  El servidor se queda esperando peticiones de clientes (navegadores)
  en el puerto 3000
*/
app.listen(PORT, () => {
  /*
    Template string: permite insertar variables dentro de strings usando ${}
    Sintaxis: `texto ${variable} más texto`
    Es más legible que la concatenación: "texto " + variable + " más texto"
  */
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// ============================================================================
// RESUMEN DEL FLUJO DE LA APLICACIÓN
// ============================================================================
/*
  1. Usuario accede a http://localhost:3000/ 
     → Ve public/index.html (archivo estático)
  
  2. Usuario hace clic en "Formulario"
     → GET /form
     → Se renderiza views/form.ejs con campos vacíos
  
  3. Usuario llena el formulario y hace clic en "Enviar"
     → POST /form con los datos
     → Se validan los datos en el servidor
     
  4a. Si hay errores:
      → Se vuelve a renderizar form.ejs con errores y datos previos
      
  4b. Si todo está bien:
      → Se renderiza resultado.ejs con los datos validados
*/
