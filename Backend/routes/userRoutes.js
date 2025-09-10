const express = require("express"); 
const {
  login,
  registrar
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/auth"); // Importa el middleware

const router = express.Router(); 

// Rutas de usuario
router.post("/login", login);
router.post("/registrar",authenticateToken, registrar);

module.exports = router;