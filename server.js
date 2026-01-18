// server.js - VERSIÓN FINAL PARA COMMONJS Y VERCEL
require('dotenv').config();

// Verificamos que las variables estén cargadas
console.log("✅ Variables cargadas:", {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? "Definida" : "Undefined",
  NODE_ENV: process.env.NODE_ENV || 'development'
});

const app = require("./app.js");
const { connectDB } = require("./config/MDBConnection.js");

// Función para iniciar el servidor
const iniciarServidor = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    
    // Solo iniciar servidor si NO estamos en Vercel
    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        console.log(`📊 Entorno: ${process.env.NODE_ENV}`);
        console.log(`🌐 URL: http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
    
    // En producción (Vercel), no salir del proceso
    if (process.env.NODE_ENV === 'production') {
      console.log("🔄 Continuando sin conexión a DB...");
    } else {
      process.exit(1);
    }
  }
};

// Iniciar servidor inmediatamente
iniciarServidor();

// Exportar app para Vercel (IMPORTANTE PARA VERCEL)
module.exports = app;