import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const raw = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home_normal">Laboratorio Ávila</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/home_normal">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pacientes">Pacientes</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {user && <Link className="me-3 nav-link" to="/administrador">{user.nombre || user.nombre_usuario}</Link>}
            {user ? (
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Cerrar sesión</button>
            ) : (
              <Link className="btn btn-outline-primary btn-sm" to="/">Ingresar</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
