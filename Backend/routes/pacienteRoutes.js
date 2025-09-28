const express = require("express"); 
const {
	createPaciente,
	getPacientes,
	getPacienteById,
	updatePaciente,
	deletePaciente
} = require("../controllers/pacienteController");

const authenticateToken = require("../middlewares/auth"); // Importa el middleware

const router = express.Router(); 

// Rutas de paciente protegidas por token
router.get("/", authenticateToken, getPacientes);
router.post("/", authenticateToken, createPaciente);
router.get("/:id", authenticateToken, getPacienteById);
router.put("/:id", authenticateToken, updatePaciente);
router.delete("/:id", authenticateToken, deletePaciente);

module.exports = router;