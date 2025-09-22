import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3"
      style={{
        width: "250px",
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #e0e0e0",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {/* Logo */}
      <Link
        to="/home_normal"
        className="d-flex align-items-center mb-4 me-md-auto text-decoration-none"
      >
        <img
          src="src/assets/Lab Avila Logo.png"
          alt="Logo"
          className="img-fluid mb-3"
        />
      </Link>

      {/* Navegación */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <Link
            to="/pacientes"
            className="nav-link d-flex align-items-center text-dark py-2 custom-link"
          >
            <i className="bi bi-people-fill fs-4 me-3"></i>
            Pacientes
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link
            to="/citas"
            className="nav-link d-flex align-items-center text-dark py-2 custom-link"
          >
            <i className="bi bi-calendar-check fs-4 me-3"></i>
            Citas
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link
            to="/examenes"
            className="nav-link d-flex align-items-center text-dark py-2 custom-link"
          >
            <i className="bi bi-file-earmark-text fs-4 me-3"></i>
            Exámenes
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link
            to="/inventario"
            className="nav-link d-flex align-items-center text-dark py-2 custom-link"
          >
            <i className="bi bi-cart-check fs-4 me-3"></i>
            Inventario
          </Link> 

        </li>
        
        <li className="nav-item mb-2">
          <Link
            to="/estadisticas"
            className="nav-link d-flex align-items-center text-dark py-2 custom-link"
          >
            <i className="bi bi-bar-chart-line fs-4 me-3"></i>
            Estadísticas
          </Link>
        </li>
      </ul>

      <hr />

      {/* Usuario / Logout */}
      <div className="mt-auto">
        {user && (
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-person-circle fs-4 me-2" style={{ color: "#00C2CC" }}></i>
            <span>{user.nombre || user.nombre_usuario}</span>
          </div>
        )}
        {user ? (
          <button
            className="btn btn-outline-danger w-100"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-left me-2"></i>
            Cerrar sesión
          </button>
        ) : (
          <Link className="btn btn-outline-primary w-100" to="/">
            Ingresar
          </Link>
        )}
      </div>

      {/* Estilos personalizados */}
      <style>
        {`
          .custom-link {
            border-radius: 8px;
            transition: all 0.2s ease-in-out;
          }
          .custom-link i {
            color: #00C2CC;
          }
          .custom-link:hover {
            background-color: #f5f5f5;
            color: #00C2CC !important;
          }
          .custom-link:hover i {
            color: #00C2CC !important;
          }
        `}
      </style>
    </div>
  );
}
