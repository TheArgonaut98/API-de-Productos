const express = require("express");
const productosRouter = require("./routes");

const app = express();
const PUERTO = 3000;

app.use(express.json());

app.use("/productos", productosRouter);

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

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    mensaje: `La ruta '${req.originalUrl}' no existe en esta API`,
  });
});

app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
  console.log("Presiona Ctrl + C para detenerlo");
});
