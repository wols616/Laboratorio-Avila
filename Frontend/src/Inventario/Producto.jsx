import React from "react";

export default function DetalleProducto() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F0F0F0" }}>
      <div className="d-flex">
        {/* Sidebar (ya existente) */}
        
        {/* Contenido principal */}
        <div className="flex-grow-1" style={{ marginLeft: "250px", padding: "20px" }}>
          <div className="container-fluid">
            {/* Título */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 mb-0">Alcohol Etilico</h1>
            </div>
            
            <p className="text-muted mb-4">Gestión detallada del producto 2</p>
            
            <div className="row">
              {/* Información del producto */}
              <div className="col-md-5 mb-4">
                <div className="card mb-4">
                  <div className="card-header bg-white">
                    <h5 className="card-title mb-0">Alcohol Etilico</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label fw-bold">ID:</label>
                      <p className="mb-0">2</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">Stock Actual</label>
                      <p className="mb-0">pcs</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">Fecha de Vencimiento</label>
                      <p className="mb-0">15/12/2027</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">Descripción</label>
                      <p className="mb-0">Alcohol al 70% para desinfección</p>
                    </div>
                  </div>
                </div>
                
                {/* Acciones de Stock */}
                <div className="card">
                  <div className="card-header bg-white">
                    <h5 className="card-title mb-0">Acciones de Stock</h5>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Entrada</label>
                        <select className="form-select">
                          <option>Seleccionar</option>
                          <option>Entrada</option>
                          <option>Salida</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Sanidad</label>
                        <select className="form-select">
                          <option>Seleccionar</option>
                          <option>Sanidad</option>
                          <option>Otro</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Cantidad</label>
                        <input type="number" className="form-control" placeholder="Cantidad" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Motivo</label>
                        <input type="text" className="form-control" placeholder="Motivo" />
                      </div>
                    </div>
                    
                    <div className="d-grid gap-2">
                      <button className="btn btn-primary">
                        Guardar
                      </button>                      
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Historial de movimientos */}
              <div className="col-md-7 mb-4">
                <div className="card">
                  <div className="card-header bg-white">
                    <h5 className="card-title mb-0">Historial de Movimientos</h5>
                  </div>
                  <div className="card-body">
                    <p className="text-muted">Registro completo de entradas y salidas</p>
                    
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Cantidad</th>
                            <th>Observación</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>15/03/25</td>
                            <td>Salida</td>
                            <td>5</td>
                            <td>Uso en vacunación</td>
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
          .form-label {
            margin-bottom: 0.5rem;
          }
        `}
      </style>
    </div>
  );
}
