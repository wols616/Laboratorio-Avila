import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Administrador() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!currentPassword || !newPassword || !confirmPassword) return setMessage({ type: 'danger', text: 'Todos los campos son requeridos' });
    if (newPassword !== confirmPassword) return setMessage({ type: 'danger', text: 'La nueva contraseña y la confirmación no coinciden' });
    if (newPassword.length < 8) return setMessage({ type: 'danger', text: 'La nueva contraseña debe tener al menos 8 caracteres' });
    const strongRe = /(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;
    if (!strongRe.test(newPassword)) return setMessage({ type: 'danger', text: 'La nueva contraseña debe contener al menos una mayúscula, un número y un carácter especial' });

    const token = localStorage.getItem('token');
    if (!token) return setMessage({ type: 'danger', text: 'No autorizado' });

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });
      const data = await (async () => { try { return await res.json(); } catch { return null; } })();
      if (!res.ok) {
        setMessage({ type: 'danger', text: data?.message || 'Error al cambiar contraseña' });
      } else {
        setMessage({ type: 'success', text: data?.message || 'Contraseña cambiada correctamente' });
        // limpiar campos
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        // opcional: redirigir o forzar logout
        setTimeout(() => {
          // opcional: cerrar sesión después de cambio
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
        }, 1200);
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginLeft: "250px", minHeight: "100vh", backgroundColor: "#F0F0F0", padding: "20px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold" style={{ color: "#111" }}>Administración</h2>
          <p className="text-muted small mb-0">Cambia la contraseña de tu cuenta y administra tu perfil</p>
        </div>
      </div>

      <div className="container-fluid">
        {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

        <div className="row">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">Cambiar contraseña</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Contraseña actual</label>
                    <div className="input-group">
                      <input type={showCurrent ? 'text' : 'password'} className="form-control" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setShowCurrent(s => !s)}>{showCurrent ? 'Ocultar' : 'Mostrar'}</button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nueva contraseña</label>
                    <div className="input-group">
                      <input type={showNew ? 'text' : 'password'} className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setShowNew(s => !s)}>{showNew ? 'Ocultar' : 'Mostrar'}</button>
                    </div>
                    <small className="text-muted">Debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirmar nueva contraseña</label>
                    <div className="input-group">
                      <input type={showConfirm ? 'text' : 'password'} className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirm(s => !s)}>{showConfirm ? 'Ocultar' : 'Mostrar'}</button>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn" type="submit" style={{ backgroundColor: "#00C2CC", color: "#fff" }} disabled={loading}>{loading ? 'Guardando...' : 'Cambiar contraseña'}</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/home_normal')}>Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">Información</h5>
              </div>
              <div className="card-body">
                <p className="text-muted">Aquí puedes cambiar tu contraseña para mantener segura tu cuenta. Después de cambiar la contraseña se cerrará la sesión automáticamente.</p>
                <ul>
                  <li>Contraseña mínima: 8 caracteres</li>
                  <li>Incluye al menos una mayúscula, un número y un carácter especial</li>
                  <li>Si tienes problemas contacta al administrador del sistema</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Administrador;