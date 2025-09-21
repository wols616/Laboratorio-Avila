import { useState } from "react";
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div
            className="container-fluid page-full-screen min-vh-100 d-flex align-items-center justify-content-center p-0"
            style={{
                background: "linear-gradient(135deg, #ffffff 60%,  #00C2CC 40%)",
            }}
        >
        {/* container interno sólo para limitar ancho del contenido centrado */}
        <div className="container">

            
        <div className="row w-100">
            {/* Panel izquierdo */}
            <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center text-white" style={{ padding: "100px" }}>
                <img
                    src="src/assets/Lab Avila Logo.png"
                    alt="Logo de Lab Avila"
                    className="mb-4"
                    style={{
                        maxWidth: "300px",
                        height: "auto",
                        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))"
                    }}
                />
                <h1 className="fw-bold mb-1" style={{ fontSize: "2rem", color: "#00C2CC", fontWeight: "bold"}}>
                    ¡Bienvenidos!
                </h1>
                <br />
                <p
                    className="text-center"
                    style={{ maxWidth: "420px", fontSize: "1.15rem", lineHeight: "1.6", color: "#00C2CC", fontWeight: "bold" }}
                >
                    El mejor laboratorio clínico de Ahuachapan.
                </p>
        </div>


                {/* Panel derecho */}
                <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center bg-white p-5 border-radius-15 shadow">
                    <div style={{ width: "100%", maxWidth: "400px" }}>
                        <h2
                            className="fw-bold mb-4 text-center"
                            style={{ color: "#00C2CC" }}
                        >
                            Iniciar Sesión
                        </h2>

                        <form>
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
            </div>
            
        </div>{/* /.container */}
        </div>
    );
};

export default LoginPage;
