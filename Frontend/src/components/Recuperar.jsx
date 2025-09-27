import React from 'react';

export default function Recuperar() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F0F0', padding: '20px' }}>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold" style={{ color: '#111' }}>Recuperar contraseña</h2>
            <p className="text-muted small mb-0">Aquí irá el formulario para recuperar la contraseña.</p>
          </div>
        </div>

        <div className="card shadow-sm" style={{ maxWidth: 720 }}>
          <div className="card-body">
            <p className="text-muted">Componente placeholder. Implementará la lógica de recuperación en otra tarea.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
