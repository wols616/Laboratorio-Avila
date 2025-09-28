const express = require("express"); 
const {
  login,
  registrar,
  changePassword
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/auth"); // Importa el middleware

const router = express.Router(); 

// Rutas de usuario
router.post("/login", login);
router.post("/registrar", registrar);
// Ruta para cambiar contraseña (protegida)
router.post("/change-password", authenticateToken, changePassword);

module.exports = router;