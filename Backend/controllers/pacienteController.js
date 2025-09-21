const db = require("../config/db");

// Crear un nuevo paciente
exports.createPaciente = (req, res) => {
	const { nombre, apellido, fecha_nacimiento, edad, dui, telefono, fecha_registro, estado } = req.body;

	if (!nombre || !apellido || !fecha_nacimiento || edad === undefined || !dui || !telefono) {
		return res.status(400).json({ message: 'Faltan campos requeridos' });
	}

	const estadoVal = typeof estado !== 'undefined' ? String(estado) : '1';
	const fechaRegistroVal = fecha_registro || new Date();

	const query = `INSERT INTO paciente (nombre, apellido, fecha_nacimiento, edad, dui, telefono, fecha_registro, estado, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
	db.query(query, [nombre, apellido, fecha_nacimiento, edad, dui, telefono, fechaRegistroVal, estadoVal], (err, result) => {
		if (err) return res.status(500).json({ message: 'Error al crear paciente', error: err });
		return res.status(201).json({ message: 'Paciente creado', id_paciente: result.insertId });
	});
};

// Obtener todos los pacientes
exports.getPacientes = (req, res) => {
	const query = `SELECT * FROM paciente`;
	db.query(query, (err, results) => {
		if (err) return res.status(500).json({ message: 'Error al recuperar pacientes', error: err });
		return res.status(200).json(results);
	});
};

// Obtener paciente por id
exports.getPacienteById = (req, res) => {
	const { id } = req.params;
	const query = `SELECT * FROM paciente WHERE id_paciente = ?`;
	db.query(query, [id], (err, results) => {
		if (err) return res.status(500).json({ message: 'Error al recuperar paciente', error: err });
		if (results.length === 0) return res.status(404).json({ message: 'Paciente no encontrado' });
		return res.status(200).json(results[0]);
	});
};

// Actualizar paciente
exports.updatePaciente = (req, res) => {
	const { id } = req.params;
	const { nombre, apellido, fecha_nacimiento, edad, dui, telefono, fecha_registro, estado } = req.body;

	// Validar que exista
	const selectQ = `SELECT id_paciente FROM paciente WHERE id_paciente = ?`;
	db.query(selectQ, [id], (err, results) => {
		if (err) return res.status(500).json({ message: 'Error en el servidor', error: err });
		if (results.length === 0) return res.status(404).json({ message: 'Paciente no encontrado' });

		const query = `UPDATE paciente SET nombre = ?, apellido = ?, fecha_nacimiento = ?, edad = ?, dui = ?, telefono = ?, fecha_registro = ?, estado = ?, updated_at = NOW() WHERE id_paciente = ?`;
		const estadoVal = typeof estado !== 'undefined' ? String(estado) : '1';
		db.query(query, [nombre, apellido, fecha_nacimiento, edad, dui, telefono, fecha_registro, estadoVal, id], (err2) => {
			if (err2) return res.status(500).json({ message: 'Error al actualizar paciente', error: err2 });
			return res.status(200).json({ message: 'Paciente actualizado' });
		});
	});
};

// Eliminar (soft delete) paciente
exports.deletePaciente = (req, res) => {
	const { id } = req.params;
	const query = `UPDATE paciente SET estado = '0', updated_at = NOW() WHERE id_paciente = ?`;
	db.query(query, [id], (err, result) => {
		if (err) return res.status(500).json({ message: 'Error al eliminar paciente', error: err });
		if (result.affectedRows === 0) return res.status(404).json({ message: 'Paciente no encontrado' });
		return res.status(200).json({ message: 'Paciente eliminado (estado=0)' });
	});
};



