import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Inventario() {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Agregar Producto");
  const [search, setSearch] = useState("");
    const navigate = useNavigate();
  

  const [productos, setProductos] = useState([
    { id: 1, nombre: "Alcohol Etilico", descripcion: "Alcohol al 70% para desinfección", stock: 1, unidad: "pcs", vencimiento: "15/12/2027" },
    { id: 2, nombre: "Reactivo Glucosa", descripcion: "Reactivo para test de glucosa", stock: 10, unidad: "pcs", vencimiento: "01/01/2025" },
  ]);

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  const handleAgregar = () => {
    setModalTitle("Agregar Producto");
    setShowModal(true);
  };

  const handleEditar = (producto) => {
    setModalTitle("Editar Producto");
    setShowModal(true);
  };

  return (
    <div className="d-flex" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Sidebar existente */}

      <div className="flex-grow-1" style={{ marginLeft: "250px", padding: "20px" }}>
        {/* Título */}
        
       
       <div className="d-flex align-items-center mb-4">
  {/* Título a la izquierda */}
  <h1 className="h3 mb-0">Inventario</h1>

  {/* Buscador + botón a la derecha */}
  <div className="d-flex align-items-center ms-auto gap-2">
    <input
      type="text"
      className="form-control"
      placeholder="Buscar producto..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{ width: "250px" }} // ajusta ancho del buscador si quieres
    />
    <button className="btn btn-primary" onClick={handleAgregar}>
      <i className="bi bi-plus-circle me-2"></i>Agregar Producto
    </button>
  </div>
</div>

        <p className="text-muted mb-4"><strong>Gestión de insumos</strong></p>

        {/* Alertas en horizontal */}
        <div className="d-flex gap-3 mb-4 flex-wrap">
          <div className="card flex-fill border-danger">
            <div className="card-body">
              <h6 className="text-danger">Alertas Críticas</h6>
              <div className="alert alert-danger py-2 mb-0 d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <span><strong>Stock Agotado</strong> - Stock: 0 unidades</span>
              </div>
            </div>
          </div>
          <div className="card flex-fill border-warning">
            <div className="card-body">
              <h6 className="text-warning">Advertencias</h6>
              <div className="alert alert-warning py-2 mb-0 d-flex align-items-center">
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                <span>Próximo a Vencer: Reactivo Glucosa - Vence en 15 días</span>
              </div>
            </div>
          </div>
        </div>

       

        {/* Tabla de productos */}
        <div className="card">
          <div className="card-body table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Stock</th>
                  <th>Unidad</th>
                  <th>Vencimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td><strong>{p.nombre}</strong></td>
                    <td>{p.descripcion}</td>
                    <td>{p.stock}</td>
                    <td>{p.unidad}</td>
                    <td>{p.vencimiento}</td>
                    <td>
                       <button className="btn btn-sm btn-outline-warning" 
                       onClick={() => navigate("/producto", { state: { id: p.id_producto } })}>
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditar(p)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal solo con Bootstrap */}
      <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: showModal ? "rgba(0,0,0,0.5)" : "transparent" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalTitle}</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre del Producto</label>
                <input type="text" className="form-control" placeholder="Ingrese nombre" />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <input type="text" className="form-control" placeholder="Ingrese descripción" />
              </div>
              <div className="mb-3">
                <label className="form-label">Stock</label>
                <input type="number" className="form-control" placeholder="Ingrese stock" />
              </div>
              <div className="mb-3">
                <label className="form-label">Unidad</label>
                <input type="text" className="form-control" placeholder="Ingrese unidad" />
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha de Vencimiento</label>
                <input type="date" className="form-control" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary">Guardar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos personalizados */}
      <style>{`
        .table th {
          border-top: none;
          font-weight: 600;
          color: #6c757d;
        }
        .alert {
          border-left: 4px solid;
        }
        .alert-danger {
          border-left-color: #dc3545;
        }
        .alert-warning {
          border-left-color: #ffc107;
        }
      `}</style>
    </div>
  );
}
