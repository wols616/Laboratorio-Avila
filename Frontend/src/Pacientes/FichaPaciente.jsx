import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function FichaPaciente() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location?.state?.id;

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchPaciente = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`http://localhost:5000/api/pacientes/${id}`, { headers });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setPaciente(data);
      } catch (err) {
        setError("No se pudo cargar el paciente");
      } finally {
        setLoading(false);
      }
    };
    fetchPaciente();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const sexoLabel = (s) => {
    if (!s) return "-";
    const m = String(s).toUpperCase();
    if (m === 'M') return 'Masculino';
    if (m === 'F') return 'Femenino';
    if (m === 'O') return 'Otro';
    if (m === 'U') return 'No especificado';
    return s;
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString();
    } catch (e) {
      return iso;
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F0F0F0" }}>
      <div className="d-flex">
        <div className="flex-grow-1" style={{ marginLeft: "250px", padding: "20px" }}>
          <div className="container-fluid">
            <button className="btn" style={{ backgroundColor: "#FF8789", color: "#fff" }} onClick={() => navigate(-1)}>Volver</button>
            <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
              <h1 className="h3 mb-0">Ficha del Paciente</h1>
              <div className="d-flex gap-2">
                <button className="btn" style={{ backgroundColor: "#00C2CC", color: "#fff" }}>Crear Cita</button>
                <button className="btn" style={{ backgroundColor: "#00C2CC", color: "#fff" }}>Registrar Examen</button>
              </div>
            </div>

            <p className="text-muted mb-4">Información detallada e historial médico</p>

            {loading ? (
              <div className="alert alert-info">Cargando paciente...</div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : !paciente ? (
              <div className="alert alert-warning">Seleccione un paciente válido.</div>
            ) : (
              <div className="row">
                <div className="col-md-5 mb-4">
                  <div className="card">
                    <div className="card-header bg-white">
                      <h5 className="card-title mb-0">Datos</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Nombres</label>
                        <p className="mb-0">{paciente.nombre || '-'}</p>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">Apellidos</label>
                        <p className="mb-0">{paciente.apellido || '-'}</p>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">Sexo</label>
                        <p className="mb-0">{sexoLabel(paciente.sexo)}</p>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">Edad</label>
                        <p className="mb-2">Fecha de Nacimiento</p>
                        <p className="mb-0">{paciente.edad ?? '-'} {paciente.fecha_nacimiento ? `(${formatDate(paciente.fecha_nacimiento)})` : ''}</p>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">DUI</label>
                        <p className="mb-0">{paciente.dui || '-'}</p>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">Teléfono</label>
                        <p className="mb-0">{paciente.telefono || '-'}</p>
                      </div>

                      <hr />
                    </div>
                  </div>
                </div>

                <div className="col-md-7 mb-4">
                  <div className="card">
                    <div className="card-header bg-white">
                      <h5 className="card-title mb-0">Historial Médico</h5>
                    </div>
                    <div className="card-body">
                      <p className="text-muted">Registro completo de exámenes y consultas</p>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Fecha</th>
                              <th>Examen Realizado</th>
                              <th>Total Pagado</th>
                              <th>Tipo de Pago</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>15/03/25</td>
                              <td>Glucosa en sangre</td>
                              <td>$5.00</td>
                              <td>Transferencia</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          body, html {
            margin: 0;
            padding: 0;
          }
          .table th {
            border-top: none;
            font-weight: 600;
            color: #6c757d;
            background-color: #f8f9fa;
          }
          .card {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
          }
          .card-header {
            border-bottom: 1px solid #e0e0e0;
            padding: 15px 20px;
          }
          .card-body {
            padding: 20px;
          }
        `}
      </style>
    </div>
  );
}
