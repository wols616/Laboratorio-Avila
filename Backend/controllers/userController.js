const db = require("../config/db");
const bcrypt = require("bcryptjs");
const generatePassword = require('generate-password');
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    if (!nombre_usuario || !contrasena) {
        return res.status(400).json({ message: "Nombre de usuario y contraseña son requeridos" });
    }

    db.query(
        "SELECT * FROM usuario WHERE nombre_usuario = ?",
        [nombre_usuario],
        async (err, results) => {
            if (err) return res.status(500).json({ message: "Error en el servidor" });
            if (results.length === 0) return res.status(401).json({ message: "Nombre de usuario o contraseña incorrectos" });

            const user = results[0];

            // Validar si la cuenta está desactivada
            if (user.estado === 0) {
                return res.status(403).json({
                    message: "Tu cuenta está desactivada. Por favor, contacta al administrador al correo maicol.monge@catolica.edu.sv"
                });
            }

            // Validar contraseña
            const match = await bcrypt.compare(contrasena, user.contrasena);
            if (!match) return res.status(401).json({ message: "Correo o contraseña incorrectos" });

            // Si requiere cambio de contraseña
            /*if (user.requiere_cambio_contrasena === 1) {
                const payload = {
                    id_usuario: user.id_usuario,
                    correo: user.correo,
                    privilegio: user.privilegio
                };
                
                const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });


                return res.status(200).json({
                    message: "Contraseña genérica detectada, debe cambiarla",
                    requirePasswordChange: true,
                    token, // <-- aquí va el JWT
                    user: {
                        id_usuario: user.id_usuario,
                        correo: user.correo
                    }
                });
            }

            */
            // Login normal: genera el token
            const payload = {
                id_usuario: user.id_usuario,
                nombre_usuario: user.nombre_usuario,
                rol: user.rol
            };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });

            return res.status(200).json({
                message: "Inicio de sesión exitoso",
                token, // <-- aquí va el JWT
                user: {
                    id_usuario: user.id_usuario,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    nombre_usuario: user.nombre_usuario,
                    rol: user.rol,
                    estado: user.estado
                }
            });
        }
    );
};

exports.registrar = (req, res) => {
    const { nombres, apellidos, direccion, telefono, correo, privilegio, imagen, fecha_nacimiento, sexo, especialidad } = req.body;

    if (!nombres || !apellidos || !direccion || !telefono || !correo || privilegio === undefined) {
        return res.status(400).json({ message: "Todos los campos requeridos deben ser enviados" });
    }

    if (![0, 1].includes(Number(privilegio))) {
        return res.status(400).json({ message: "Privilegio no válido" });
    }

    // Validaciones adicionales según privilegio
    if (Number(privilegio) === 1) {
        if (!fecha_nacimiento || !sexo) {
            return res.status(400).json({ message: "Fecha de nacimiento y sexo son requeridos para paciente." });
        }
        if (!['M', 'F'].includes(sexo)) {
            return res.status(400).json({ message: "Sexo debe ser 'M' o 'F'." });
        }
    }
    if (Number(privilegio) === 0) {
        if (!especialidad) {
            return res.status(400).json({ message: "Especialidad es requerida para especialista." });
        }
    }

    // Generar contraseña genérica aleatoria y segura
    const contrasenaGenerica = generatePassword.generate({
        length: 15,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        strict: true
    });

    bcrypt.hash(contrasenaGenerica, 10, (err, hashedContrasenaGenerica) => {
        if (err) {
            return res.status(500).json({ message: "Error al encriptar la contraseña", error: err });
        }

        const query = "INSERT INTO usuario (nombres, apellidos, direccion, telefono, correo, contrasena, privilegio, imagen, estado, requiere_cambio_contrasena) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(query, [nombres, apellidos, direccion, telefono, correo, hashedContrasenaGenerica, privilegio, imagen || null, 1, 1], (err, results) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ message: "El correo ya está registrado" });
                }
                return res.status(500).json({ message: "Error en el servidor", error: err });
            }

            const id_usuario = results.insertId;

            // Insertar en tabla paciente o especialista según privilegio
            if (Number(privilegio) === 1) {
                const pacienteQuery = "INSERT INTO paciente (id_usuario, fecha_nacimiento, sexo) VALUES (?, ?, ?)";
                db.query(pacienteQuery, [id_usuario, fecha_nacimiento, sexo], (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Error al registrar paciente", error: err });
                    }
                    enviarCorreoBienvenida(correo, contrasenaGenerica, nombres, apellidos);
                    return res.status(201).json({ message: "Paciente registrado exitosamente", userId: id_usuario });
                });
            } else if (Number(privilegio) === 0) {
                const especialistaQuery = "INSERT INTO especialista (id_usuario, especialidad) VALUES (?, ?)";
                db.query(especialistaQuery, [id_usuario, especialidad], (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Error al registrar especialista", error: err });
                    }
                    enviarCorreoBienvenida(correo, contrasenaGenerica, nombres, apellidos);
                    return res.status(201).json({ message: "Especialista registrado exitosamente", userId: id_usuario });
                });
            }
        });
    });
};



