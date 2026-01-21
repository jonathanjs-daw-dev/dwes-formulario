# 📚 DWES - Proyecto de Formularios

## 🎓 Guía de Aprendizaje para Desarrollo Web en Entorno Servidor

Este proyecto es una aplicación educativa que te enseñará los fundamentos del desarrollo web en el lado del servidor usando Node.js y Express practicando formularios, validación de datos y comunicación cliente-servidor.

---

## 📋 Índice

1. [¿Qué hace este proyecto?](#-qué-hace-este-proyecto)
2. [Tecnologías utilizadas](#-tecnologías-utilizadas)
3. [Estructura del proyecto](#-estructura-del-proyecto)
4. [Instalación y ejecución](#-instalación-y-ejecución)
5. [Conceptos fundamentales](#-conceptos-fundamentales)
6. [Flujo de la aplicación](#-flujo-de-la-aplicación)
7. [Explicación del código](#-explicación-del-código)
8. [Ejemplos prácticos](#-ejemplos-prácticos)
9. [Ejercicios propuestos](#-ejercicios-propuestos)

---

## 🎯 ¿Qué hace este proyecto?

Esta aplicación web permite a los usuarios:

1. **Acceder a una página de inicio** con un menú de navegación
2. **Rellenar un formulario** con sus datos personales (nombre, edad, ciudad, intereses)
3. **Validar los datos** tanto en el cliente como en el servidor
4. **Ver mensajes de error** si los datos no son válidos
5. **Confirmar el envío** viendo los datos procesados

### Objetivo educativo

Aprender cómo:

- Crear un servidor web con Express
- Manejar rutas GET y POST
- Procesar datos de formularios
- Validar datos en el servidor
- Usar plantillas dinámicas con EJS
- Mantener el estado del formulario después de errores

---

## 🛠️ Tecnologías utilizadas

### Backend (Servidor)

- **Node.js**: Entorno de ejecución de JavaScript en el servidor
- **Express**: Framework web minimalista para Node.js
- **EJS (Embedded JavaScript)**: Motor de plantillas para generar HTML dinámico

### Frontend (Cliente)

- **HTML5**: Estructura de las páginas
- **Formularios HTML**: Captura de datos del usuario

### Herramientas de desarrollo

- **nodemon**: Reinicia automáticamente el servidor cuando hay cambios
- **npm**: Gestor de paquetes de Node.js

---

## 📁 Estructura del proyecto

```
dwes-formulario/
│
├── app.js                 # 🚀 Servidor principal (punto de entrada)
├── package.json           # 📦 Dependencias y scripts del proyecto
├── package-lock.json      # 🔒 Versiones exactas de dependencias
├── README.md              # 📖 Este archivo (documentación)
│
├── public/                # 📂 Archivos estáticos (HTML, CSS, imágenes)
│   └── index.html         # 🏠 Página de inicio
│
└── views/                 # 📂 Plantillas EJS (HTML dinámico)
    ├── form.ejs           # 📝 Formulario de registro
    └── resultado.ejs      # ✅ Página de confirmación (por crear)
```

### Explicación de cada carpeta

**`app.js`**: El corazón de la aplicación. Contiene toda la lógica del servidor, rutas y validaciones.

**`public/`**: Archivos que se sirven directamente sin procesamiento. Ideales para páginas estáticas.

**`views/`**: Plantillas EJS que se procesan en el servidor antes de enviarlas al cliente. Permiten crear HTML dinámico.

---

## 🚀 Instalación y ejecución

### Prerequisitos

Necesitas tener instalado:

- **Node.js** (versión 14 o superior)
- **npm** (viene incluido con Node.js)

### Paso 1: Clonar o descargar el proyecto

```bash
git clone https://github.com/jonathanjs-daw-dev/dwes-formulario.git
cd dwes-formulario
```

### Paso 2: Instalar dependencias

```bash
npm install
```

Esto instalará:

- `express`: servidor web
- `ejs`: motor de plantillas
- `nodemon`: reinicio automático (solo desarrollo)

### Paso 3: Ejecutar el servidor

**Modo producción** (ejecución normal):

```bash
npm start
```

**Modo desarrollo** (con reinicio automático):

```bash
npm run dev
```

### Paso 4: Abrir en el navegador

Abre tu navegador y ve a:

```
http://localhost:3000
```

¡Listo! Deberías ver la página de inicio.

---

## 🧠 Conceptos fundamentales

### 1. ¿Qué es un servidor web?

Un servidor web es un programa que:

- **Escucha** peticiones de clientes (navegadores)
- **Procesa** esas peticiones
- **Responde** con datos (HTML, JSON, imágenes, etc.)

**Analogía**: Imagina un restaurante:

- **Cliente**: tú, el comensal
- **Servidor**: el camarero
- **Cocina**: la lógica de tu aplicación (app.js)
- **Menú**: las rutas disponibles (/form, /, etc.)

### 2. Cliente-Servidor: ¿Cómo se comunican?

```
┌─────────────┐                    ┌─────────────┐
│  NAVEGADOR  │                    │  SERVIDOR   │
│  (Cliente)  │                    │  (Node.js)  │
└─────────────┘                    └─────────────┘
       │                                  │
       │  1. REQUEST (Petición)           │
       │  GET /form                       │
       │─────────────────────────────────>│
       │                                  │
       │                                  │  2. Procesa la petición
       │                                  │     Ejecuta app.get("/form")
       │                                  │
       │  3. RESPONSE (Respuesta)         │
       │  <html>...</html>                │
       │<─────────────────────────────────│
       │                                  │
       4. Muestra la página              │
```

### 3. Métodos HTTP

Los métodos HTTP definen **qué acción** queremos realizar:

| Método     | Acción                     | Ejemplo                          |
| ---------- | -------------------------- | -------------------------------- |
| **GET**    | Obtener/Leer datos         | Ver una página, buscar productos |
| **POST**   | Enviar/Crear datos         | Enviar formulario, crear usuario |
| **PUT**    | Actualizar datos completos | Editar perfil completo           |
| **PATCH**  | Actualizar datos parciales | Cambiar solo el email            |
| **DELETE** | Eliminar datos             | Borrar una publicación           |

En este proyecto usamos:

- **GET /form**: para mostrar el formulario vacío
- **POST /form**: para enviar y procesar los datos del formulario

### 4. ¿Qué es un middleware?

Un middleware es una función que se ejecuta **entre** la petición y la respuesta.

**Analogía**: Es como los controles de seguridad en un aeropuerto:

1. Llegas al aeropuerto (petición)
2. Pasas por seguridad (middleware 1)
3. Muestras tu pasaporte (middleware 2)
4. Revisión de equipaje (middleware 3)
5. Abordas el avión (respuesta final)

```javascript
// Middleware en Express
app.use((req, res, next) => {
  console.log("Nueva petición recibida");
  next(); // Continúa al siguiente middleware o ruta
});
```

### 5. Plantillas EJS vs HTML estático

#### HTML Estático (public/index.html)

```html
<h1>Hola, Mundo</h1>
<!-- Siempre muestra lo mismo -->
```

#### EJS Dinámico (views/form.ejs)

```ejs
<h1>Hola, <%= nombre %></h1>
<!-- Si nombre = "Juan" → <h1>Hola, Juan</h1> -->
<!-- Si nombre = "María" → <h1>Hola, María</h1> -->
```

**EJS = HTML + JavaScript**

Sintaxis EJS:

- `<%= variable %>`: imprime el valor (escapado, seguro)
- `<% código %>`: ejecuta JavaScript (no imprime)
- `<%- html %>`: imprime HTML sin escapar (peligroso, usar con cuidado)

---

## 🔄 Flujo de la aplicación

### Flujo completo paso a paso

```
┌─────────────────────────────────────────────────────────────────┐
│                    INICIO: Usuario visita la app                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │  GET http://localhost:3000/  │
                 └─────────────────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │  Express sirve           │
                 │  public/index.html       │
                 │  (página estática)       │
                 └─────────────────────────┘
                              │
                              ▼
           ┌──────────────────────────────────────┐
           │  Usuario ve menú con link "Formulario"│
           └──────────────────────────────────────┘
                              │
                              ▼
        ┌────────────────────────────────────────────┐
        │  Usuario hace clic en "Formulario"         │
        └────────────────────────────────────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │  GET /form               │
                 └─────────────────────────┘
                              │
                              ▼
            ┌─────────────────────────────────┐
            │  app.get("/form") se ejecuta    │
            │  Renderiza form.ejs con datos   │
            │  vacíos: nombre="", edad="", etc│
            └─────────────────────────────────┘
                              │
                              ▼
           ┌──────────────────────────────────┐
           │  Usuario ve formulario vacío     │
           │  Llena: nombre, edad, ciudad...  │
           │  Hace clic en "Enviar"           │
           └──────────────────────────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │  POST /form              │
                 │  (con datos del form)    │
                 └─────────────────────────┘
                              │
                              ▼
            ┌─────────────────────────────────┐
            │  app.post("/form") se ejecuta   │
            │  1. Captura datos (req.body)    │
            │  2. Valida los datos            │
            └─────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌────────────────────┐      ┌───────────────────┐
    │  ❌ HAY ERRORES     │      │  ✅ TODO BIEN      │
    └────────────────────┘      └───────────────────┘
                │                           │
                ▼                           ▼
    ┌────────────────────┐      ┌───────────────────┐
    │  Renderiza form.ejs│      │  Renderiza        │
    │  con:              │      │  resultado.ejs    │
    │  - datos previos   │      │  con datos        │
    │  - array errores   │      │  validados        │
    └────────────────────┘      └───────────────────┘
                │                           │
                ▼                           ▼
    ┌────────────────────┐      ┌───────────────────┐
    │  Usuario ve errores│      │  Usuario ve       │
    │  y puede corregir  │      │  confirmación     │
    └────────────────────┘      └───────────────────┘
```

---

## 💻 Explicación del código

### app.js - El servidor principal

#### 1. Importación de módulos

```javascript
const express = require("express");
const path = require("path");
```

**¿Qué es `require()`?**

- En Node.js, usamos `require()` para importar módulos
- Es como "traer una caja de herramientas" a nuestro proyecto

**Analogía**:

- `express`: una caja de herramientas para crear servidores web
- `path`: una caja de herramientas para trabajar con rutas de archivos

#### 2. Creación del servidor

```javascript
const app = express();
const PORT = 3000;
```

- `app`: nuestra aplicación Express (el servidor)
- `PORT`: el "puerto" donde escuchará peticiones

**Analogía del puerto**:
Imagina un edificio de apartamentos:

- El edificio es tu computadora
- Cada apartamento es un puerto (3000, 8080, etc.)
- Cada aplicación vive en su propio apartamento

#### 3. Configuración de archivos estáticos

```javascript
app.use(express.static(path.join(__dirname, "public")));
```

**¿Qué hace esto?**

- Permite servir archivos de la carpeta `public` directamente
- Los archivos se sirven "tal cual", sin procesamiento

**Ejemplo**:

- `public/index.html` → accesible en `http://localhost:3000/index.html`
- `public/style.css` → accesible en `http://localhost:3000/style.css`

#### 4. Configuración de EJS

```javascript
app.set("view engine", "ejs");
```

Le dice a Express: "usa EJS para las plantillas"

#### 5. Middleware para parsear formularios

```javascript
app.use(express.urlencoded({ extended: true }));
```

**¿Qué hace?**
Convierte los datos del formulario en un objeto JavaScript accesible en `req.body`

**Sin este middleware:**

```javascript
req.body; // undefined 😢
```

**Con este middleware:**

```javascript
req.body.nombre; // "Juan"
req.body.edad; // "25"
```

#### 6. Ruta GET /form

```javascript
app.get("/form", (req, res) => {
  res.render("form", {
    nombre: "",
    edad: "",
    ciudad: "",
    intereses: [],
  });
});
```

**¿Qué hace?**

1. Escucha peticiones GET a `/form`
2. Renderiza `views/form.ejs`
3. Pasa un objeto con datos vacíos

**`res.render()`**:

- Procesa una plantilla EJS
- Reemplaza las variables con los valores dados
- Envía el HTML resultante al cliente

#### 7. Ruta POST /form

```javascript
app.post("/form", (req, res) => {
  // Capturar datos
  const nombre = req.body.nombre;
  const edad = req.body.edad;
  const ciudad = req.body.ciudad;
  let intereses = req.body.intereses || [];

  // Normalizar checkboxes a array
  if (!Array.isArray(intereses)) intereses = [intereses];

  // Validar
  let errores = [];

  if (!nombre || nombre.trim().length < 2) {
    errores.push("El nombre tiene que tener minimo 2 caracteres");
  }

  if (!ciudad) {
    errores.push("La ciudad tiene que tener algun valor");
  }

  // Si hay errores, volver al formulario
  if (errores.length) {
    return res.status(400).render("form", {
      nombre,
      edad,
      ciudad,
      intereses,
      errores,
    });
  }

  // Si todo bien, mostrar resultado
  res.render("resultado", {
    nombre,
    edad: edad || null,
    ciudad,
    intereses,
  });
});
```

**Desglose paso a paso:**

1. **Capturar datos**: `req.body.nombre`, `req.body.edad`, etc.
2. **Normalizar checkboxes**: convertir a array siempre
3. **Validar**: verificar reglas de negocio
4. **Si hay errores**: volver al formulario con mensajes
5. **Si todo OK**: mostrar página de confirmación

---

## 📚 Ejemplos prácticos

### Ejemplo 1: Agregar una nueva validación

Queremos validar que la edad sea mayor de 18 años.

**En app.js, en la ruta POST /form:**

```javascript
// Después de las validaciones existentes, añade:

if (edad && parseInt(edad) < 18) {
  errores.push("Debes ser mayor de 18 años");
}
```

### Ejemplo 2: Añadir un nuevo campo al formulario

Vamos a añadir un campo "email".

**Paso 1: Actualizar form.ejs**

```html
<label for="email">
  Email:
  <input type="email" name="email" required value="<%=email || ''%>" />
</label>
<br />
```

**Paso 2: Actualizar app.get("/form")**

```javascript
app.get("/form", (req, res) => {
  res.render("form", {
    nombre: "",
    edad: "",
    ciudad: "",
    intereses: [],
    email: "", // ← NUEVO
  });
});
```

**Paso 3: Capturar y validar en app.post("/form")**

```javascript
app.post("/form", (req, res) => {
  const nombre = req.body.nombre;
  const edad = req.body.edad;
  const ciudad = req.body.ciudad;
  const email = req.body.email; // ← NUEVO
  let intereses = req.body.intereses || [];

  // ... código existente ...

  // Nueva validación
  if (!email || !email.includes("@")) {
    errores.push("El email debe ser válido");
  }

  // Si hay errores
  if (errores.length) {
    return res.status(400).render("form", {
      nombre,
      edad,
      ciudad,
      intereses,
      email, // ← NUEVO
      errores,
    });
  }

  // Si todo OK
  res.render("resultado", {
    nombre,
    edad: edad || null,
    ciudad,
    intereses,
    email, // ← NUEVO
  });
});
```

**Paso 4: Mostrar en resultado.ejs**

```html
<p><strong>Email:</strong> <%= email %></p>
```

### Ejemplo 3: Añadir más opciones de intereses

**En form.ejs, dentro del fieldset:**

```html
<label>
  Música
  <input
    type="checkbox"
    name="intereses"
    value="musica"
    <%= (intereses||[]).includes('musica') ? 'checked' : '' %>
  />
</label>
<label>
  Lectura
  <input
    type="checkbox"
    name="intereses"
    value="lectura"
    <%= (intereses||[]).includes('lectura') ? 'checked' : '' %>
  />
</label>
```

### Ejemplo 4: Cambiar el puerto del servidor

**En app.js:**

```javascript
// En lugar de:
const PORT = 3000;

// Puedes usar:
const PORT = process.env.PORT || 3000;
```

Esto permite usar una variable de entorno, útil para desplegar en servicios como Heroku.

---

## 🎓 Ejercicios propuestos

### Nivel Básico

1. **Añadir un campo "apellido"**
   - Añádelo al formulario
   - Valida que tenga al menos 2 caracteres
   - Muéstralo en resultado.ejs

2. **Validación de edad mínima**
   - Valida que la edad sea mayor de 16 años
   - Muestra un error personalizado si no cumple

3. **Más ciudades**
   - Añade 3 ciudades más al selector

### Nivel Intermedio

4. **Campo de género con radio buttons**
   - Añade un campo con opciones: Masculino, Femenino, Otro
   - Usa `<input type="radio">`
   - Valida que se haya seleccionado uno

5. **Validación de email**
   - Añade un campo email
   - Valida que contenga "@" y "."
   - Valida que no esté vacío

6. **Textarea para comentarios**
   - Añade un campo `<textarea>` para comentarios
   - Valida que no exceda 200 caracteres
   - Muestra cuántos caracteres quedan (con JavaScript)

### Nivel Avanzado

7. **Crear una página de error 404**
   - Crea una ruta que capture todas las URLs no encontradas
   - Renderiza una página personalizada de error

```javascript
// Al final de app.js, antes de app.listen
app.use((req, res) => {
  res.status(404).send("<h1>404 - Página no encontrada</h1>");
});
```

8. **Guardar datos en un archivo JSON**
   - Usa el módulo `fs` (file system) de Node.js
   - Guarda los datos validados en un archivo `datos.json`

9. **Crear una página que muestre todos los registros**
   - Lee el archivo `datos.json`
   - Renderiza una tabla con todos los registros guardados

---

## 🐛 Problemas comunes y soluciones

### Problema 1: "Cannot GET /form"

**Causa**: La ruta no está definida o el servidor no está corriendo

**Solución**:

1. Verifica que el servidor esté ejecutándose: `npm start`
2. Verifica que app.js tenga `app.get("/form", ...)`

### Problema 2: "req.body is undefined"

**Causa**: Falta el middleware `express.urlencoded()`

**Solución**:

```javascript
app.use(express.urlencoded({ extended: true }));
```

### Problema 3: No se muestran los archivos de public/

**Causa**: Falta configurar express.static

**Solución**:

```javascript
app.use(express.static(path.join(__dirname, "public")));
```

### Problema 4: Los checkboxes no se marcan después de un error

**Causa**: Falta la validación `.includes()` en el value de checked

**Solución**:

```html
<input
  type="checkbox"
  name="intereses"
  value="deportes"
  <%= (intereses||[]).includes('deportes') ? 'checked' : '' %>
/>
```

---

## 📖 Recursos adicionales

### Documentación oficial

- [Express.js](https://expressjs.com/) - Framework web
- [EJS](https://ejs.co/) - Motor de plantillas
- [Node.js](https://nodejs.org/) - Entorno de ejecución

### Tutoriales recomendados

- [MDN Web Docs - Formularios HTML](https://developer.mozilla.org/es/docs/Learn/Forms)
- [Express Tutorial - FreeCodeCamp](https://www.freecodecamp.org/news/express-explained-with-examples/)

### Videos educativos

- [Node.js Tutorial - Midudev](https://www.youtube.com/watch?v=yB4n_K7dZV8)
- [Express.js Crash Course](https://www.youtube.com/watch?v=L72fhGm1tfE)

---

## 🤝 Contribuir

Si encuentras errores o tienes sugerencias:

1. Abre un issue en GitHub
2. Haz un fork y envía un pull request
3. Comparte tus mejoras con la comunidad

---

## 📝 Licencia

ISC - Libre uso educativo

---

## 👨‍💻 Autor

Proyecto educativo para aprender desarrollo web en entorno servidor.

---

## 🎉 ¡Felicidades!

Si has llegado hasta aquí, ya entiendes:

✅ Cómo funciona un servidor web  
✅ La comunicación cliente-servidor  
✅ Rutas GET y POST  
✅ Validación de formularios  
✅ Plantillas dinámicas con EJS  
✅ Manejo de errores

**¡Sigue practicando y experimentando!** La mejor manera de aprender es haciendo. 🚀

---

## 📞 ¿Necesitas ayuda?

Si tienes dudas sobre el proyecto:

1. Revisa los comentarios en los archivos (están muy detallados)
2. Experimenta cambiando cosas y viendo qué pasa
3. Usa `console.log()` para ver el valor de las variables
4. Busca en la documentación oficial

**Recuerda**: Todos los programadores consultan documentación constantemente. ¡Es parte del proceso! 💪
