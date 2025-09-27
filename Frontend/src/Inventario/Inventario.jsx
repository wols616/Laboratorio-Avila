import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Inventario() {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Agregar Producto");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // token/headers
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

  // form state for add/edit
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nombre_insumo: "",
    descripcion: "",
    stock: 0,
    stock_minimo: 0,
    unidad_medida: "",
    fecha_vencimiento: ""
  });

  // fetch insumos
  const fetchInsumos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/inventario/insumos", { headers });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar insumos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsumos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProductos = productos.filter(p =>
    (p.nombre_insumo && p.nombre_insumo.toLowerCase().includes(search.toLowerCase())) ||
    (p.descripcion && p.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAgregar = () => {
    setModalTitle("Agregar Producto");
    setEditingId(null);
    setForm({ nombre_insumo: "", descripcion: "", stock: 0, stock_minimo: 0, unidad_medida: "", fecha_vencimiento: "" });
    setShowModal(true);
  };

  const handleEditar = (producto) => {
    setModalTitle("Editar Producto");
    setEditingId(producto.id_insumo || producto.id);
    setForm({
      nombre_insumo: producto.nombre_insumo || producto.nombre || "",
      descripcion: producto.descripcion || "",
      stock: producto.stock || 0,
      stock_minimo: producto.stock_minimo || 0,
      unidad_medida: producto.unidad_medida || "",
      fecha_vencimiento: producto.fecha_vencimiento ? producto.fecha_vencimiento.split('T')[0] : ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar insumo?')) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/inventario/insumos/${id}`, {
        method: 'DELETE',
        headers
      });
      if (!res.ok) throw new Error('Error al eliminar insumo');
      await fetchInsumos();
    } catch (err) {
      setError(err.message || 'Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        nombre_insumo: form.nombre_insumo,
        descripcion: form.descripcion,
        stock: Number(form.stock),
        stock_minimo: Number(form.stock_minimo),
        unidad_medida: form.unidad_medida,
        fecha_vencimiento: form.fecha_vencimiento || null
      };

      if (!editingId) {
        const res = await fetch('http://localhost:5000/api/inventario/insumos', {
          method: 'POST',
          headers,
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error('Error al crear insumo');
      } else {
        const res = await fetch(`http://localhost:5000/api/inventario/insumos/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error('Error al actualizar insumo');
      }

      await fetchInsumos();
      setShowModal(false);
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
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

        {/* Alertas dinámicas */}
        <div className="d-flex gap-3 mb-4 flex-wrap">
          {/** Helpers para determinar alertas **/}
          {/* compute critical and warning lists */}
          {
            (() => {
              const daysUntil = (iso) => {
                if (!iso) return null;
                const d = new Date(iso);
                const now = new Date();
                const diff = d.setHours(0,0,0,0) - now.setHours(0,0,0,0);
                return Math.ceil(diff / (1000 * 60 * 60 * 24));
              };

              const critical = productos.filter(p => typeof p.stock !== 'undefined' && Number(p.stock) <= 0);
              const lowStock = productos.filter(p => typeof p.stock !== 'undefined' && typeof p.stock_minimo !== 'undefined' && Number(p.stock) > 0 && Number(p.stock) <= Number(p.stock_minimo));
              const expiring = productos.filter(p => p.fecha_vencimiento && daysUntil(p.fecha_vencimiento) !== null && daysUntil(p.fecha_vencimiento) <= 30 && daysUntil(p.fecha_vencimiento) >= 0);

              return (
                <>
                  <div className="card flex-fill border-danger">
                    <div className="card-body">
                      <h6 className="text-danger">Alertas Críticas</h6>
                      {critical.length === 0 ? (
                        <div className="alert alert-secondary py-2 mb-0 d-flex align-items-center">No hay insumos con stock agotado</div>
                      ) : (
                        critical.slice(0,3).map((p) => (
                          <div key={p.id_insumo} className="alert alert-danger py-2 mb-2 d-flex align-items-center">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <div>
                              <strong>{p.nombre_insumo}</strong> - Stock: {p.stock}
                            </div>
                          </div>
                        ))
                      )}
                      {critical.length > 3 && <div className="small text-muted mt-2">y {critical.length - 3} más...</div>}
                    </div>
                  </div>

                  <div className="card flex-fill border-warning">
                    <div className="card-body">
                      <h6 className="text-warning">Advertencias</h6>
                      { (lowStock.length === 0 && expiring.length === 0) ? (
                        <div className="alert alert-secondary py-2 mb-0 d-flex align-items-center">Sin advertencias</div>
                      ) : (
                        <>
                          {lowStock.slice(0,3).map(p => (
                            <div key={`low-${p.id_insumo}`} className="alert alert-warning py-2 mb-2 d-flex align-items-center">
                              <i className="bi bi-exclamation-circle-fill me-2"></i>
                              <div><strong>{p.nombre_insumo}</strong> - Stock bajo: {p.stock} (mín {p.stock_minimo})</div>
                            </div>
                          ))}
                          {expiring.slice(0,3).map(p => (
                            <div key={`exp-${p.id_insumo}`} className="alert alert-warning py-2 mb-2 d-flex align-items-center">
                              <i className="bi bi-clock-history me-2"></i>
                              <div><strong>{p.nombre_insumo}</strong> - Vence en {daysUntil(p.fecha_vencimiento)} días</div>
                            </div>
                          ))}
                        </>
                      )}
                      {(lowStock.length + expiring.length) > 3 && <div className="small text-muted mt-2">y {(lowStock.length + expiring.length) - 3} más...</div>}
                    </div>
                  </div>
                </>
              );
            })()
          }
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
                {loading ? (
                  <tr><td colSpan="7" className="text-center">Cargando...</td></tr>
                ) : filteredProductos.length === 0 ? (
                  <tr><td colSpan="7" className="text-center text-muted">No hay productos</td></tr>
                ) : (
                  filteredProductos.map(p => (
                    <tr key={p.id_insumo}>
                      <td>{p.id_insumo}</td>
                      <td><strong>{p.nombre_insumo}</strong></td>
                      <td>{p.descripcion}</td>
                      <td>{p.stock}</td>
                      <td>{p.unidad_medida}</td>
                      <td>{p.fecha_vencimiento ? p.fecha_vencimiento.split('T')[0] : '-'}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-warning me-1" 
                          onClick={() => navigate("/producto", { state: { id: p.id_insumo } })}>
                          <i className="bi bi-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEditar(p)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id_insumo)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre del Producto</label>
                  <input name="nombre_insumo" value={form.nombre_insumo} onChange={handleFormChange} type="text" className="form-control" placeholder="Ingrese nombre" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <input name="descripcion" value={form.descripcion} onChange={handleFormChange} type="text" className="form-control" placeholder="Ingrese descripción" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stock</label>
                  <input name="stock" value={form.stock} onChange={handleFormChange} type="number" className="form-control" placeholder="Ingrese stock" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stock mínimo</label>
                  <input name="stock_minimo" value={form.stock_minimo} onChange={handleFormChange} type="number" className="form-control" placeholder="Ingrese stock mínimo" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Unidad</label>
                  <input name="unidad_medida" value={form.unidad_medida} onChange={handleFormChange} type="text" className="form-control" placeholder="Ingrese unidad" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha de Vencimiento</label>
                  <input name="fecha_vencimiento" value={form.fecha_vencimiento} onChange={handleFormChange} type="date" className="form-control" />
                </div>
              </form>
            </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleFormSubmit} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
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
