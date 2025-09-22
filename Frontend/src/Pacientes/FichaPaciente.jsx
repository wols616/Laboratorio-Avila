import React from "react";

export default function FichaPaciente() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F0F0F0" }}>
      <div className="d-flex">
        {/* Sidebar (ya existente) */}
        
        {/* Contenido principal */}
        <div className="flex-grow-1" style={{ marginLeft: "250px", padding: "20px" }}>
          <div className="container-fluid">
            {/* Título y botones arriba */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 mb-0">Ficha del Paciente</h1>
              
              <div className="d-flex gap-2">
                <button className="btn" style={{ backgroundColor: "#00C2CC", color: "#fff" }}>Crear Cita</button>
                <button className="btn" style={{ backgroundColor: "#00C2CC", color: "#fff" }}>Registrar Examen</button>
                <button className="btn" style={{ backgroundColor: "#00C2CC", color: "#fff" }}>Editar</button>
              </div>
            </div>
            
            <p className="text-muted mb-4">Información detallada e historial médico</p>
            
            <div className="row">
              {/* Información del paciente */}
              <div className="col-md-5 mb-4">
                <div className="card">
                  <div className="card-header bg-white">
                    <h5 className="card-title mb-0">Prácticas</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Nombres</label>
                      <p className="mb-0">Nelson Nelson</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">Apellidos</label>
                      <p className="mb-0">López López</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">Edad</label>
                      <p className="mb-2">Fecha de Nacimiento</p>
                      <p className="mb-0">22/15/03/2003</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">DUI</label>
                      <p className="mb-0">01622278-3</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">Teléfono</label>
                      <p className="mb-0">76913084</p>
                    </div>
                    
                    <hr />
                    
                    
                  </div>
                </div>
              </div>
              
              {/* Historial médico */}
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
          </div>
        </div>
      </div>

      {/* Estilos personalizados */}
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
