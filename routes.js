const express = require("express");
const router = express.Router();
const productos = require("./data");

// ──────────────────────────────────────────────
// GET /productos → Listar todos los productos
// ──────────────────────────────────────────────
router.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    total: productos.length,
    datos: productos,
  });
});

// ──────────────────────────────────────────────
// GET /productos/:id → Obtener un producto por ID
// ──────────────────────────────────────────────
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).json({
      ok: false,
      mensaje: `No se encontró un producto con el id ${id}`,
    });
  }

  res.status(200).json({ ok: true, datos: producto });
});

// ──────────────────────────────────────────────
// POST /productos → Crear un nuevo producto
// ──────────────────────────────────────────────
router.post("/", (req, res) => {
  const { nombre, precio, categoria } = req.body;

  // Validación: campos obligatorios presentes
  if (!nombre || precio === undefined || !categoria) {
    return res.status(400).json({
      ok: false,
      mensaje: "Faltan campos obligatorios: nombre, precio y categoria son requeridos",
    });
  }

  // Validación: nombre debe ser string no vacío
  if (typeof nombre !== "string" || nombre.trim() === "") {
    return res.status(400).json({
      ok: false,
      mensaje: "El campo 'nombre' debe ser un texto no vacío",
    });
  }

  // Validación: precio debe ser número positivo
  if (typeof precio !== "number" || precio < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "El campo 'precio' debe ser un número mayor o igual a 0",
    });
  }

  // Validación: categoria debe ser string no vacío
  if (typeof categoria !== "string" || categoria.trim() === "") {
    return res.status(400).json({
      ok: false,
      mensaje: "El campo 'categoria' debe ser un texto no vacío",
    });
  }

  const nuevoProducto = {
    id: productos.length + 1,
    nombre: nombre.trim(),
    precio,
    categoria: categoria.trim(),
  };

  productos.push(nuevoProducto);

  res.status(201).json({
    ok: true,
    mensaje: "Producto creado exitosamente",
    datos: nuevoProducto,
  });
});

// ──────────────────────────────────────────────
// PUT /productos/:id → Actualizar un producto
// ──────────────────────────────────────────────
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const indice = productos.findIndex((p) => p.id === id);

  if (indice === -1) {
    return res.status(404).json({
      ok: false,
      mensaje: `No se encontró un producto con el id ${id}`,
    });
  }

  const { nombre, precio, categoria } = req.body;

  // Validación: al menos un campo debe venir para actualizar
  if (!nombre && precio === undefined && !categoria) {
    return res.status(400).json({
      ok: false,
      mensaje: "Debes enviar al menos un campo para actualizar: nombre, precio o categoria",
    });
  }

  // Validación de tipos si los campos están presentes
  if (nombre !== undefined) {
    if (typeof nombre !== "string" || nombre.trim() === "") {
      return res.status(400).json({
        ok: false,
        mensaje: "El campo 'nombre' debe ser un texto no vacío",
      });
    }
  }

  if (precio !== undefined) {
    if (typeof precio !== "number" || precio < 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El campo 'precio' debe ser un número mayor o igual a 0",
      });
    }
  }

  if (categoria !== undefined) {
    if (typeof categoria !== "string" || categoria.trim() === "") {
      return res.status(400).json({
        ok: false,
        mensaje: "El campo 'categoria' debe ser un texto no vacío",
      });
    }
  }

  // Actualizar solo los campos recibidos (actualización parcial)
  const productoActualizado = {
    ...productos[indice],
    ...(nombre && { nombre: nombre.trim() }),
    ...(precio !== undefined && { precio }),
    ...(categoria && { categoria: categoria.trim() }),
  };

  productos[indice] = productoActualizado;

  res.status(200).json({
    ok: true,
    mensaje: "Producto actualizado exitosamente",
    datos: productoActualizado,
  });
});

// ──────────────────────────────────────────────
// DELETE /productos/:id → Eliminar un producto
// ──────────────────────────────────────────────
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const indice = productos.findIndex((p) => p.id === id);

  if (indice === -1) {
    return res.status(404).json({
      ok: false,
      mensaje: `No se encontró un producto con el id ${id}`,
    });
  }

  const eliminado = productos.splice(indice, 1)[0];

  res.status(200).json({
    ok: true,
    mensaje: "Producto eliminado exitosamente",
    datos: eliminado,
  });
});

module.exports = router;
