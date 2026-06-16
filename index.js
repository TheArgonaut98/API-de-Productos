const express = require("express");
const productosRouter = require("./routes");

const app = express();
const PUERTO = 3000;

// ── Middlewares ──────────────────────────────
// Permite recibir JSON en el body de las peticiones
app.use(express.json());

// ── Rutas ────────────────────────────────────
// Todas las rutas de productos bajo el prefijo /productos
app.use("/productos", productosRouter);

// Ruta raíz informativa
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: "API de Productos funcionando",
    endpoints: {
      listar: "GET    /productos",
      obtener: "GET    /productos/:id",
      crear: "POST   /productos",
      actualizar: "PUT    /productos/:id",
      eliminar: "DELETE /productos/:id",
    },
  });
});

// ── Manejo de rutas no encontradas (404 global) ──
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    mensaje: `La ruta '${req.originalUrl}' no existe en esta API`,
  });
});

// ── Iniciar servidor ─────────────────────────
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
  console.log("Presiona Ctrl + C para detenerlo");
});
