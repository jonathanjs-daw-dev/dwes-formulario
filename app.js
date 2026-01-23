// ============================================================================
// IMPORTACIÓN DE MÓDULOS
// ============================================================================
const express = require("express");
const dayjs = require("dayjs");
require("dayjs/locale/es");
dayjs.locale("es");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

// ============================================================================
// INICIALIZACIÓN
// ============================================================================
const app = express();
const PORT = 3000;

// ============================================================================
// CONFIGURACIÓN DE VISTAS Y ARCHIVOS ESTÁTICOS
// ============================================================================
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// ============================================================================
// MIDDLEWARES
// ============================================================================

// Parseo de datos de formulario
app.use(express.urlencoded({ extended: true }));

// Parseo de cookies
app.use(cookieParser());

// Gestión de sesiones
app.use(
  session({
    secret: "clave para sesiones", // IMPORTANTE: usar variable de entorno en producción
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 30, // 30 minutos
    },
  }),
);

// Middleware de timeout (10 segundos)
app.use((req, res, next) => {
  const ms = 10000;
  const timer = setTimeout(() => {
    if (!res.headersSent) {
      console.warn("Tiempo de espera agotado.");
      res.status(408).send("Tiempo de espera agotado.");
    }
  }, ms);

  res.once("finish", () => clearTimeout(timer));
  res.once("close", () => clearTimeout(timer));
  next();
});

// Middleware de autenticación
const requiereAuth = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect("login");
};

// ============================================================================
// RUTAS - FORMULARIO
// ============================================================================

// GET /form - Mostrar formulario vacío
app.get("/form", (req, res) => {
  res.render("form", {
    nombre: "",
    edad: "",
    ciudad: "",
    intereses: [],
  });
});

// POST /form - Procesar y validar formulario
app.post("/form", (req, res) => {
  const nombre = req.body.nombre;
  const edad = req.body.edad;
  const ciudad = req.body.ciudad;

  console.log("nombre::", nombre);
  console.log("edad::", edad);
  console.log("ciudad::", ciudad);

  // Normalizar checkboxes a array
  let intereses = req.body.intereses || [];
  if (!Array.isArray(intereses)) intereses = [intereses];

  // Validar datos
  let errores = [];

  if (!nombre || nombre.trim().length < 2) {
    errores.push("El nombre tiene que tener minimo 2 caracteres");
  }

  if (!ciudad) {
    errores.push("La ciudad tiene que tener algun valor");
  }

  // Si hay errores, devolver formulario con mensajes
  if (errores.length) {
    return res.status(400).render("form", {
      nombre,
      edad,
      ciudad,
      intereses,
      errores,
    });
  }

  // Si todo OK, mostrar resultado
  res.render("resultado", {
    nombre,
    edad: edad || null,
    ciudad,
    intereses,
  });
});

// ============================================================================
// RUTAS - AUTENTICACIÓN
// ============================================================================

// GET /login - Mostrar formulario de login
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// POST /login - Procesar login
app.post("/login", (req, res) => {
  const { usuario, password } = req.body;

  // NOTA: En producción usar bcrypt para hashear contraseñas
  if (usuario && password === "12345") {
    req.session.user = { nombre: usuario };
    return res.redirect("/perfil");
  }

  res
    .status(401)
    .render("login", { error: "Usuario o contraseña incorrectos." });
});

// GET /perfil - Página de perfil (protegida)
app.get("/perfil", requiereAuth, (req, res) => {
  const user = req.session.user;
  res.render("perfil", { user });
});

// POST /logout - Cerrar sesión
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// ============================================================================
// RUTAS - TEMAS (COOKIES)
// ============================================================================

// GET /tema/:modo - Establecer tema mediante cookie
app.get("/tema/:modo", (req, res) => {
  const modo = req.params.modo;

  res.cookie("tema", modo, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
  });

  res.redirect("/temas");
});

// GET /borrar-tema - Eliminar cookie de tema
app.get("/borrar-tema", (req, res) => {
  res.clearCookie("tema");
  res.redirect("/temas");
});

// GET /temas - Página de demostración de temas
app.get("/temas", (req, res) => {
  const tema = req.cookies.tema || "claro";
  res.render("temas", { tema });
});

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

/*
================================================================================
================================================================================

   GUÍA COMPLETA DE DESARROLLO WEB EN ENTORNO SERVIDOR

   Este archivo es el punto central de aprendizaje. Aquí encontrarás
   explicaciones detalladas de todos los conceptos fundamentales.

   Los demás archivos (.ejs) contienen notas específicas de su contexto
   y referencias a esta guía para conceptos generales.

================================================================================
================================================================================


================================================================================
ÍNDICE
================================================================================

1. Módulos y Dependencias
2. Middlewares
3. Sesiones vs Cookies
4. Motor de Plantillas EJS (referencia: ver form.ejs para sintaxis detallada)
5. Rutas y Métodos HTTP
6. Flujo Completo de la Aplicación
7. Buenas Prácticas y Seguridad
8. Ejercicios Propuestos


================================================================================
1. MÓDULOS Y DEPENDENCIAS
================================================================================

¿Qué es require()?
------------------
Es la forma de importar módulos en Node.js (CommonJS).
Piensa en un módulo como una "caja de herramientas" con código reutilizable.

MÓDULOS DE ESTE PROYECTO:
-------------------------

→ express
  Framework web que facilita crear servidores.
  Sin Express tendríamos que escribir mucho más código para manejar
  peticiones HTTP, rutas, respuestas, etc.

→ dayjs
  Biblioteca para trabajar con fechas de forma sencilla.
  - Formatear: dayjs().format('DD/MM/YYYY') → "23/01/2026"
  - Manipular: dayjs().add(7, 'days') → fecha + 7 días
  Configuramos idioma español para meses/días en castellano.

→ cookie-parser
  Middleware que facilita trabajar con cookies.
  - Sin él: req.headers.cookie = "tema=oscuro; usuario=juan" (string)
  - Con él: req.cookies = { tema: "oscuro", usuario: "juan" } (objeto)

→ express-session
  Middleware para manejar sesiones de usuario.
  Las sesiones permiten "recordar" información entre peticiones.
  HTTP es "stateless" (sin estado), las sesiones solucionan esto.

→ path
  Módulo nativo de Node.js para trabajar con rutas de archivos.
  Construye rutas de forma segura sin importar el sistema operativo.


================================================================================
2. MIDDLEWARES
================================================================================

¿Qué es un middleware?
----------------------
Función que se ejecuta ENTRE la petición del cliente y la respuesta del servidor.
Es como un "filtro" o "procesador intermedio".

Flujo: Cliente → Middleware1 → Middleware2 → Ruta → Respuesta

Analogía: Imagina los controles de un aeropuerto
- Llegas al aeropuerto (petición del navegador)
- Pasas por seguridad (middleware 1: ¿tienes datos de formulario?)
- Muestras tu pasaporte (middleware 2: ¿estás autenticado?)
- Revisión de equipaje (middleware 3: ¿hay cookies?)
- Abordas el avión (llegas a la ruta y obtienes respuesta)

MIDDLEWARES EN ESTA APLICACIÓN:
-------------------------------

→ express.static(path.join(__dirname, "public"))
  Sirve archivos estáticos de la carpeta /public
  - public/index.html → http://localhost:3000/index.html
  - public/style.css → http://localhost:3000/style.css

→ express.urlencoded({ extended: true })
  Convierte datos del formulario en objeto JavaScript.
  Sin esto: req.body sería undefined
  Con esto: req.body = { nombre: "Juan", edad: "25" }

  { extended: true } permite parsear objetos complejos y arrays.

→ cookieParser()
  Analiza las cookies que envía el navegador.
  Las convierte de string a objeto para fácil acceso.

→ session({ ... })
  Gestiona sesiones de usuario. Configuración:
  - secret: clave para firmar la cookie de sesión (¡usar variable de entorno!)
  - resave: false → solo guarda si la sesión cambió (mejor rendimiento)
  - saveUninitialized: false → no guarda sesiones vacías (privacidad/GDPR)
  - cookie.httpOnly: true → la cookie no es accesible desde JavaScript
  - cookie.maxAge: tiempo de vida de la sesión

→ Middleware de timeout
  Evita que peticiones queden "colgadas" indefinidamente.
  Si una petición tarda más de 10 segundos, devuelve error 408.

→ requiereAuth (middleware personalizado)
  Protege rutas que requieren autenticación.
  Si req.session.user no existe → redirige a /login
  Si existe → permite continuar con next()

  Uso: app.get('/ruta-protegida', requiereAuth, (req, res) => {...})


================================================================================
3. SESIONES VS COOKIES
================================================================================

¿Cuándo usar cada una?

COOKIES:
--------
- Datos que se guardan en el NAVEGADOR del usuario
- Persisten días, semanas o meses (según configuración)
- Se envían automáticamente en cada petición al servidor
- Ideales para: preferencias visuales, idioma, recordar configuración
- Menos seguras (el usuario puede verlas/modificarlas)

SESIONES:
---------
- Datos que se guardan en el SERVIDOR
- Expiran al cerrar el navegador (o según maxAge)
- El navegador solo tiene un ID de sesión (en una cookie)
- Ideales para: datos sensibles, autenticación, carrito de compras
- Más seguras (el usuario solo ve el ID, no los datos)

TABLA COMPARATIVA:
------------------
Característica    | Cookies              | Sesiones
------------------|----------------------|------------------
Almacenamiento    | Cliente (navegador)  | Servidor
Persistencia      | Configurable         | Hasta cerrar navegador
Seguridad         | Menos seguro         | Más seguro
Capacidad         | ~4KB por cookie      | Sin límite práctico
Uso ideal         | Preferencias         | Datos sensibles

EN ESTA APLICACIÓN:
-------------------
- Usamos COOKIES para: tema visual (claro/oscuro)
- Usamos SESIONES para: autenticación de usuario


================================================================================
4. MOTOR DE PLANTILLAS EJS
================================================================================

EJS = Embedded JavaScript (JavaScript incrustado en HTML)

Permite crear páginas HTML dinámicas mezclando HTML con JavaScript.
El servidor procesa el archivo .ejs, reemplaza variables y condicionales,
y envía HTML puro al navegador.

IMPORTANTE: Para sintaxis detallada y ejemplos, consulta views/form.ejs
donde se explica completamente la sintaxis de EJS.

RESUMEN RÁPIDO:
---------------
<%= variable %>  → Imprime valor (escapado para seguridad)
<% código %>     → Ejecuta JavaScript (no imprime)
<%- html %>      → Imprime HTML sin escapar (peligroso)

EJEMPLO:
--------
// En app.js
res.render('saludo', { nombre: 'Juan', edad: 25 });

// En saludo.ejs
<h1>Hola, <%= nombre %></h1>
<% if (edad >= 18) { %>
  <p>Eres mayor de edad</p>
<% } %>

// HTML generado
<h1>Hola, Juan</h1>
<p>Eres mayor de edad</p>


================================================================================
5. RUTAS Y MÉTODOS HTTP
================================================================================

Las rutas definen QUÉ hace el servidor cuando recibe una petición a una URL.

MÉTODOS HTTP:
-------------
Método  | Acción              | Ejemplo
--------|---------------------|----------------------------------
GET     | Obtener/Leer        | Cargar una página, buscar datos
POST    | Enviar/Crear        | Enviar formulario, crear usuario
PUT     | Actualizar completo | Editar todo el perfil
PATCH   | Actualizar parcial  | Cambiar solo el email
DELETE  | Eliminar            | Borrar una publicación

EN ESTA APLICACIÓN:
-------------------

FORMULARIO:
- GET /form → Muestra formulario vacío
- POST /form → Procesa datos enviados, valida, responde

AUTENTICACIÓN:
- GET /login → Muestra formulario de login
- POST /login → Verifica credenciales, crea sesión o muestra error
- GET /perfil → Muestra perfil (requiere autenticación)
- POST /logout → Destruye sesión, redirige a inicio

TEMAS (COOKIES):
- GET /temas → Muestra página con tema actual
- GET /tema/:modo → Establece cookie con el modo elegido
- GET /borrar-tema → Elimina la cookie de tema


================================================================================
6. FLUJO COMPLETO DE LA APLICACIÓN
================================================================================

FLUJO DE FORMULARIO:
--------------------
1. Usuario accede a http://localhost:3000/
   → Express sirve public/index.html (archivo estático)

2. Usuario hace clic en "Formulario"
   → GET /form
   → Renderiza views/form.ejs con campos vacíos

3. Usuario llena formulario y hace clic en "Enviar"
   → POST /form con los datos

4. Servidor valida los datos:

   4a. Si hay errores:
       → Renderiza form.ejs con errores y datos previos
       → Usuario ve mensajes y puede corregir

   4b. Si todo OK:
       → Renderiza resultado.ejs con datos validados
       → Usuario ve confirmación

FLUJO DE AUTENTICACIÓN:
-----------------------
1. Usuario accede a /login
   → GET /login → Muestra formulario

2. Usuario envía credenciales
   → POST /login
   → Si correctas: crea sesión, redirige a /perfil
   → Si incorrectas: muestra error

3. Usuario intenta acceder a /perfil
   → Middleware requiereAuth verifica sesión
   → Si existe: muestra perfil
   → Si no: redirige a /login

4. Usuario cierra sesión
   → POST /logout → Destruye sesión → Redirige a /

FLUJO DE TEMAS:
---------------
1. Usuario accede a /temas
   → Lee cookie (si existe) o usa "claro" por defecto
   → Muestra página con tema aplicado

2. Usuario hace clic en "Tema oscuro"
   → GET /tema/oscuro
   → Crea cookie tema=oscuro (dura 7 días)
   → Redirige a /temas → Página con tema oscuro

3. Usuario cierra navegador y vuelve mañana
   → Cookie persiste (dura 7 días)
   → Tema oscuro se mantiene automáticamente


================================================================================
7. BUENAS PRÁCTICAS Y SEGURIDAD
================================================================================

✅ HACER:
---------
- Validar SIEMPRE en el servidor (no confiar solo en HTML)
- Usar httpOnly en cookies sensibles (protección XSS)
- Usar variables de entorno para secretos (no hardcodear)
- Hashear contraseñas con bcrypt (nunca texto plano)
- Establecer tiempos de expiración en sesiones y cookies
- Usar HTTPS en producción
- Escapar datos de usuario antes de mostrarlos (EJS lo hace con <%=)

❌ NO HACER:
------------
- Confiar solo en validación del cliente (puede ser desactivada)
- Guardar contraseñas en texto plano
- Usar secrets simples como "12345" o "secret"
- Dejar sesiones sin expiración
- Exponer información sensible en logs o URLs
- Usar <%- %> con datos de usuario (XSS vulnerability)


================================================================================
8. EJERCICIOS PROPUESTOS
================================================================================

NIVEL BÁSICO:
1. Añadir validación de edad mínima (mayor de 18 años)
2. Añadir más ciudades al selector del formulario
3. Crear página de error 404 personalizada

NIVEL INTERMEDIO:
4. Añadir campo email con validación (debe contener @ y .)
5. Añadir más temas (azul, verde, etc.) al sistema de cookies
6. Implementar contador de visitas usando cookies

NIVEL AVANZADO:
7. Guardar datos del formulario en archivo JSON (módulo fs)
8. Crear página que muestre historial de todos los registros
9. Implementar "Recordarme" en login (cookie de larga duración)
10. Añadir detección automática del tema del sistema operativo


================================================================================
FIN DE LA GUÍA
================================================================================

Para más información sobre conceptos específicos:
- Sintaxis EJS detallada → views/form.ejs
- Archivos estáticos vs dinámicos → public/index.html
- README.md contiene el mapa completo de dónde encontrar cada concepto

*/
