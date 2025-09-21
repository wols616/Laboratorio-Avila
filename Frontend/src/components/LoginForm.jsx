import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const LoginForm = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username && password) {
            axios
                .post("http://localhost:5000/api/users/login", { nombre_usuario: username, contrasena: password })
                .then((response) => {
                    const data = response.data;
                    // Si requiere cambio de contraseña, redirige a establecer contraseña
                    /*if (data.requirePasswordChange) {
                        Swal.fire({
                            title: "¡Bienvenido!",
                            text: "Por seguridad, debes establecer una nueva contraseña.",
                            icon: "info",
                            confirmButtonText: "Continuar"
                        }).then(() => {
                            localStorage.setItem("token", data.token);
                            navigate("/establecer-contra", {
                                state: {
                                    id_usuario: data.user.id_usuario,
                                    correo: data.user.correo
                                }
                            });
                        });
                        return;
                    }
                        */
                    // Login normal: guarda token y datos de usuario
                    const { id_usuario, nombre, apellido, nombre_usuario, rol, estado } = data.user;
                    localStorage.setItem("user", JSON.stringify({ id_usuario, nombre, apellido, nombre_usuario, rol: Number(rol), estado }));
                    localStorage.setItem("token", data.token); // Guarda el token para futuras peticiones
                    console.log("Usuario con rol:", rol);
                    if (rol == 0) {
                        console.log("Navegando a /home_normal");
                        navigate("/home_normal");
                    } /* else if (rol === 1) {
                        navigate("/home_paciente");
                    }else if (rol === 3) {
                        navigate("/admin/home");
                    }else {
                        navigate("/");
                    }
                        */
                })
                .catch((error) => {
                    Swal.fire({
                        title: "Error",
                        text: "Usuario o contraseña incorrectos",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 1500
                    });
                });
        } else {
            Swal.fire({
                title: "Error",
                text: "Por favor, completa todos los campos.",
                icon: "error",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    /*
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!forgotEmail) return;
        try {
            await axios.post("http://localhost:5000/api/users/recuperar-contrasena", { correo: forgotEmail });
            Swal.fire({
                title: "¡Revisa tu correo!",
                text: "Si el correo está registrado, recibirás una nueva contraseña.",
                icon: "success",
                confirmButtonText: "Aceptar"
            });
            setShowForgot(false);
            setForgotEmail("");
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || "No se pudo enviar el correo.",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    };
    */

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center px-2">
            <div className="w-100" style={{ maxWidth: 400 }}>
                <h2
                    className="fw-bold mb-4 text-center"
                    style={{ color: "#00C2CC" }}
                >
                    Iniciar Sesión
                </h2>

                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    {/* Usuario */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">
                            Usuario
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ingresa tu usuario"
                            style={{
                                borderRadius: "10px",
                                padding: "0.75rem",
                            }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    {/* Contraseña con ojito */}
                    <div className="mb-3 position-relative">
                        <label className="form-label fw-semibold">
                            Contraseña
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            placeholder="Ingresa tu contraseña"
                            style={{
                                borderRadius: "10px",
                                padding: "0.75rem 2.5rem 0.75rem 0.75rem",
                            }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                        <i
                            className={`bi ${
                                showPassword
                                    ? "bi-eye-slash-fill"
                                    : "bi-eye-fill"
                            }`}
                            style={{
                                position: "absolute",
                                top: "65%",
                                right: "15px",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                fontSize: "1.2rem",
                                color: "#00C2CC",
                            }}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </div>

                    {/* Botón login */}
                    <button
                        type="submit"
                        className="btn w-100 fw-bold text-white mt-2"
                        style={{
                            backgroundColor: "#00C2CC",
                            borderRadius: "30px",
                            padding: "0.8rem",
                            fontSize: "1rem",
                            transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#0099a3")
                        }
                        onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#00C2CC")
                        }
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;