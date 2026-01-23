# DWES - Proyecto de Formularios

## Guía de Aprendizaje para Desarrollo Web en Entorno Servidor

Este proyecto es una aplicación educativa que enseña los fundamentos del desarrollo web en el lado del servidor usando Node.js y Express: formularios, validación, sesiones, cookies y plantillas dinámicas.

---

## Índice

1. [¿Qué hace este proyecto?](#qué-hace-este-proyecto)
2. [Tecnologías utilizadas](#tecnologías-utilizadas)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Instalación y ejecución](#instalación-y-ejecución)
5. [Mapa de conceptos](#mapa-de-conceptos)
6. [Problemas comunes](#problemas-comunes)
7. [Recursos adicionales](#recursos-adicionales)

---

## ¿Qué hace este proyecto?

Esta aplicación web permite:

1. **Rellenar un formulario** con datos personales (nombre, edad, ciudad, intereses)
2. **Validar los datos** en el servidor (no solo en HTML)
3. **Ver mensajes de error** si los datos no son válidos
4. **Iniciar sesión** y acceder a rutas protegidas por autenticación
5. **Cambiar preferencias visuales** (tema claro/oscuro) usando cookies persistentes

### Objetivo educativo

Aprender cómo:
- Crear un servidor web con Express
- Manejar rutas GET y POST
- Procesar y validar datos de formularios
- Usar plantillas dinámicas con EJS
- Gestionar sesiones de usuario
- Utilizar cookies para preferencias

---

## Tecnologías utilizadas

### Backend (Servidor)
- **Node.js**: Entorno de ejecución de JavaScript
- **Express**: Framework web minimalista
- **EJS**: Motor de plantillas para HTML dinámico
- **express-session**: Gestión de sesiones
- **cookie-parser**: Manejo de cookies
- **dayjs**: Manejo de fechas

### Herramientas de desarrollo
- **nodemon**: Reinicio automático del servidor
- **npm**: Gestor de paquetes

---

## Estructura del proyecto

```
dwes-formulario/
│
├── app.js                 # Servidor principal + GUÍA COMPLETA DE CONCEPTOS
├── package.json           # Dependencias y scripts
├── README.md              # Este archivo
│
├── public/                # Archivos estáticos
│   └── index.html         # Página de inicio (estático vs dinámico)
│
└── views/                 # Plantillas EJS
    ├── form.ejs           # Formulario + GUÍA DE SINTAXIS EJS
    ├── resultado.ejs      # Confirmación de datos
    ├── login.ejs          # Formulario de login
    ├── perfil.ejs         # Página protegida
    └── temas.ejs          # Demostración de cookies
```

---

## Instalación y ejecución

### Prerequisitos
- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

### Paso 1: Clonar el proyecto
```bash
git clone https://github.com/jonathanjs-daw-dev/dwes-formulario.git
cd dwes-formulario
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Ejecutar el servidor

**Modo producción:**
```bash
npm start
```

**Modo desarrollo (con reinicio automático):**
```bash
npm run dev
```

### Paso 4: Abrir en el navegador
```
http://localhost:3000
```

---

## Mapa de conceptos

Este proyecto tiene los comentarios educativos organizados para evitar duplicidad.
Cada concepto se explica en UN solo lugar:

| Concepto | Archivo | Sección |
|----------|---------|---------|
| **Módulos y require()** | app.js | Sección 1 |
| **Middlewares** | app.js | Sección 2 |
| **Sesiones vs Cookies** | app.js | Sección 3 |
| **Sintaxis EJS completa** | views/form.ejs | Sección 1-7 |
| **Formularios HTML** | views/form.ejs | Sección 2 |
| **Validación cliente vs servidor** | views/form.ejs | Sección 6 |
| **Checkboxes (normalización)** | views/form.ejs | Sección 5 |
| **Rutas y métodos HTTP** | app.js | Sección 5 |
| **Flujo completo de la app** | app.js | Sección 6 |
| **Buenas prácticas y seguridad** | app.js | Sección 7 |
| **Ejercicios propuestos** | app.js | Sección 8 |
| **Archivos estáticos vs dinámicos** | public/index.html | Notas |
| **Rutas protegidas** | views/perfil.ejs | Notas |
| **Uso práctico de cookies** | views/temas.ejs | Notas |

### Cómo navegar la documentación

1. **Si eres nuevo**: Empieza por `app.js` (guía completa de conceptos)
2. **Para sintaxis EJS**: Consulta `views/form.ejs`
3. **Para entender estático vs dinámico**: Consulta `public/index.html`
4. **Los demás archivos .ejs** tienen notas específicas de su contexto y referencias a las guías principales

---

## Problemas comunes

### "Cannot GET /form"
**Causa**: El servidor no está corriendo o la ruta no existe

**Solución**:
1. Verifica que el servidor esté ejecutándose: `npm start`
2. Verifica que la URL sea correcta: `http://localhost:3000/form`

### "req.body is undefined"
**Causa**: Falta el middleware de parseo

**Solución**: Asegúrate de tener en app.js:
```javascript
app.use(express.urlencoded({ extended: true }));
```

### Los checkboxes no mantienen su estado
**Causa**: Falta normalizar a array y/o usar `.includes()`

**Solución**: En app.js normaliza siempre a array:
```javascript
let intereses = req.body.intereses || [];
if (!Array.isArray(intereses)) intereses = [intereses];
```

Y en el EJS verifica con `.includes()`:
```html
<%= (intereses||[]).includes('deportes') ? 'checked' : '' %>
```

### Error "variable is not defined" en comentarios EJS
**Causa**: EJS procesa las etiquetas `<% %>` ANTES de los comentarios HTML

**Solución**: Para mostrar sintaxis EJS como texto, usa `%%` para escapar:
- `<%= variable %>` → escríbelo como `<%%=  variable %%>`

---

## Recursos adicionales

### Documentación oficial
- [Express.js](https://expressjs.com/)
- [EJS](https://ejs.co/)
- [Node.js](https://nodejs.org/)

### Tutoriales recomendados
- [MDN Web Docs - Formularios HTML](https://developer.mozilla.org/es/docs/Learn/Forms)
- [Express Tutorial - FreeCodeCamp](https://www.freecodecamp.org/news/express-explained-with-examples/)

---

## Resumen de aprendizaje

Al completar este proyecto, habrás aprendido:

- Cómo funciona un servidor web
- La comunicación cliente-servidor
- Rutas GET y POST
- Validación de formularios (cliente Y servidor)
- Plantillas dinámicas con EJS
- Gestión de sesiones para autenticación
- Uso de cookies para preferencias
- Protección de rutas

**Recuerda**: La mejor manera de aprender es practicando. Usa `console.log()` para ver el valor de las variables y experimenta modificando el código.

---

## Licencia

ISC - Libre uso educativo
