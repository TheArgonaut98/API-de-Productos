# 🛒 API RESTful de Productos

API RESTful construida con **Node.js** y **Express** que permite gestionar un catálogo de productos mediante operaciones CRUD completas. Los datos se almacenan en memoria usando un array en JavaScript, sin necesidad de base de datos.

---

## 📁 Estructura del proyecto

```
api-productos/
├── index.js      → Servidor principal: configura Express y monta las rutas
├── routes.js     → Define todos los endpoints CRUD de /productos
├── data.js       → Array con los datos de los productos (simula la base de datos)
├── package.json  → Dependencias y scripts del proyecto
└── README.md     → Documentación del proyecto
```

---

## ⚙️ Instalación y ejecución

### Requisitos previos
- Node.js v18 o superior instalado
- npm (viene incluido con Node.js)

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/TU_USUARIO/api-productos.git

# 2. Entra a la carpeta del proyecto
cd api-productos

# 3. Instala las dependencias
npm install

# 4. Inicia el servidor
npm start
```

El servidor quedará corriendo en: `http://localhost:3000`

> Para desarrollo con recarga automática: `npm run dev` (requiere nodemon, instalado como dev dependency)

---

## 🔗 Endpoints disponibles

| Método | Ruta              | Descripción                   |
|--------|-------------------|-------------------------------|
| GET    | `/productos`      | Listar todos los productos    |
| GET    | `/productos/:id`  | Obtener un producto por ID    |
| POST   | `/productos`      | Crear un nuevo producto       |
| PUT    | `/productos/:id`  | Actualizar un producto        |
| DELETE | `/productos/:id`  | Eliminar un producto          |

### Estructura de un producto

```json
{
  "id": 1,
  "nombre": "Laptop Lenovo IdeaPad",
  "precio": 599990,
  "categoria": "Tecnología"
}
```

| Campo     | Tipo   | Obligatorio | Descripción                        |
|-----------|--------|-------------|------------------------------------|
| id        | número | Auto        | Asignado automáticamente           |
| nombre    | string | ✅          | Nombre del producto (no vacío)     |
| precio    | número | ✅          | Precio en pesos (>= 0)             |
| categoria | string | ✅          | Categoría del producto (no vacía)  |

---

## 🧪 Ejemplos de pruebas

### 1. GET — Listar todos los productos

**Petición:**
```bash
curl -X GET http://localhost:3000/productos
```

**Respuesta (200 OK):**
```json
{
  "ok": true,
  "total": 3,
  "datos": [
    { "id": 1, "nombre": "Laptop Lenovo IdeaPad", "precio": 599990, "categoria": "Tecnología" },
    { "id": 2, "nombre": "Mouse Inalámbrico Logitech", "precio": 24990, "categoria": "Tecnología" },
    { "id": 3, "nombre": "Silla Ergonómica", "precio": 189990, "categoria": "Muebles" }
  ]
}
```

---

### 2. POST — Crear un nuevo producto

**Petición:**
```bash
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Teclado Mecánico RGB", "precio": 49990, "categoria": "Tecnología"}'
```

**Respuesta (201 Created):**
```json
{
  "ok": true,
  "mensaje": "Producto creado exitosamente",
  "datos": {
    "id": 4,
    "nombre": "Teclado Mecánico RGB",
    "precio": 49990,
    "categoria": "Tecnología"
  }
}
```

**Respuesta con error (400 Bad Request) — campo faltante:**
```bash
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Producto sin precio"}'
```
```json
{
  "ok": false,
  "mensaje": "Faltan campos obligatorios: nombre, precio y categoria son requeridos"
}
```

---

### 3. PUT — Actualizar un producto existente

**Petición:**
```bash
curl -X PUT http://localhost:3000/productos/2 \
  -H "Content-Type: application/json" \
  -d '{"precio": 19990, "nombre": "Mouse Inalámbrico Logitech M185"}'
```

**Respuesta (200 OK):**
```json
{
  "ok": true,
  "mensaje": "Producto actualizado exitosamente",
  "datos": {
    "id": 2,
    "nombre": "Mouse Inalámbrico Logitech M185",
    "precio": 19990,
    "categoria": "Tecnología"
  }
}
```

**Respuesta con error (404 Not Found):**
```bash
curl -X PUT http://localhost:3000/productos/99 \
  -H "Content-Type: application/json" \
  -d '{"precio": 5000}'
```
```json
{
  "ok": false,
  "mensaje": "No se encontró un producto con el id 99"
}
```

---

### 4. DELETE — Eliminar un producto

**Petición:**
```bash
curl -X DELETE http://localhost:3000/productos/3
```

**Respuesta (200 OK):**
```json
{
  "ok": true,
  "mensaje": "Producto eliminado exitosamente",
  "datos": {
    "id": 3,
    "nombre": "Silla Ergonómica",
    "precio": 189990,
    "categoria": "Muebles"
  }
}
```

**Respuesta con error (404 Not Found):**
```bash
curl -X DELETE http://localhost:3000/productos/50
```
```json
{
  "ok": false,
  "mensaje": "No se encontró un producto con el id 50"
}
```

---

## 🔄 Flujo de la aplicación

```
Cliente (curl / Postman)
        │
        │  HTTP Request
        ▼
   index.js  ←── Configura Express, aplica middleware JSON,
        │         monta el router en /productos
        │
        ▼
   routes.js ←── Evalúa el método (GET/POST/PUT/DELETE)
        │         y el path (/productos o /productos/:id)
        │
        ▼
    data.js  ←── Array en memoria que actúa como fuente de datos
        │
        ▼
   routes.js ←── Construye la respuesta JSON con ok, mensaje y datos
        │
        │  HTTP Response (JSON)
        ▼
   Cliente
```

---

## 🧩 Componentes principales

### `index.js` — Servidor principal
Crea la aplicación Express, aplica el middleware `express.json()` para parsear el body de las peticiones, monta el router de productos bajo el prefijo `/productos`, y añade un manejador global de rutas no encontradas (404).

### `routes.js` — Definición de rutas
Contiene la lógica de cada endpoint. Incluye validaciones de campos obligatorios y tipos de datos antes de operar sobre el array. Retorna siempre JSON con los campos `ok`, `mensaje` y `datos`.

### `data.js` — Fuente de datos
Exporta el array `productos` que es importado por `routes.js`. Al trabajar con el mismo objeto en memoria, las modificaciones (push, splice, asignación) persisten durante la ejecución del servidor.

---

## 💡 Decisiones de diseño

- **Sin base de datos**: Se optó por un array en `data.js` para mantener el enfoque en la estructura de Express y el manejo de rutas, sin agregar complejidad de persistencia.
- **Actualización parcial en PUT**: El endpoint `PUT` aplica solo los campos que llegan en el body, conservando los demás. Esto es más flexible para el cliente.
- **Respuesta consistente**: Todas las respuestas incluyen `ok: true/false` para facilitar el manejo en el cliente sin depender únicamente del código HTTP.
- **Separación en 2 archivos**: `index.js` se encarga únicamente de configurar y levantar el servidor, mientras que `routes.js` concentra toda la lógica de negocio de los productos.

---

## 📌 Códigos HTTP utilizados

| Código | Significado              | Cuándo se usa                                      |
|--------|--------------------------|----------------------------------------------------|
| 200    | OK                       | GET, PUT y DELETE exitosos                         |
| 201    | Created                  | POST exitoso (recurso creado)                      |
| 400    | Bad Request              | Campos faltantes o con tipos incorrectos           |
| 404    | Not Found                | ID inexistente o ruta no definida                  |
