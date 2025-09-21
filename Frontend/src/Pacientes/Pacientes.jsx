import { useEffect, useState } from 'react';

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ nombre: '', apellido: '', fecha_nacimiento: '', edad: '', dui: '', telefono: '' });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };

  const fetchPacientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/pacientes/', { headers });
      if (!res.ok) {
        // intentar leer body para mensaje de error
        let text;
        try { text = await res.text(); } catch (e) { text = null; }
        throw new Error(text || 'Error al cargar pacientes');
      }
      const data = await res.json();
      setPacientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // helper para formatear fecha ISO -> dd-mm-aaaa
  const formatDateDDMMYYYY = (iso) => {
    if (!iso) return '-';
    const d = iso.split('T')[0];
    const [y, m, day] = d.split('-');
    return `${day}-${m}-${y}`;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Si hay fecha_nacimiento, no enviar edad (backend calculará). Si no, enviar edad numérica.
      const body = { ...form };
      // Normalizar: limpiar strings vacíos
      if (!body.fecha_nacimiento) {
        if (body.edad === '' || body.edad === null || typeof body.edad === 'undefined') {
          delete body.edad;
        } else {
          body.edad = Number(body.edad);
        }
      } else {
        delete body.edad;
      }
      if (body.dui === '') delete body.dui;
      // calcular edad local a partir de fecha o edad enviada para decidir DUI
      let edadLocal = null;
      if (body.fecha_nacimiento) {
        const parts = body.fecha_nacimiento.split('-');
        if (parts.length === 3) {
          const y = Number(parts[0]);
          const m = Number(parts[1]) - 1;
          const d = Number(parts[2]);
          const fecha = new Date(y, m, d);
          const hoy = new Date();
          let calc = hoy.getFullYear() - fecha.getFullYear();
          const mm = hoy.getMonth() - fecha.getMonth();
          if (mm < 0 || (mm === 0 && hoy.getDate() < fecha.getDate())) calc--;
          edadLocal = calc;
        }
      } else if (typeof body.edad !== 'undefined') {
        edadLocal = Number(body.edad);
      }
      if (edadLocal !== null && edadLocal < 18) {
        delete body.dui;
      }
      if (body.fecha_nacimiento === '') delete body.fecha_nacimiento;
      const res = await fetch('http://localhost:5000/api/pacientes/', { method: 'POST', headers, body: JSON.stringify(body) });
      if (!res.ok) {
        let errText = 'Error al crear paciente';
        try {
          const errBody = await res.json();
          errText = errBody.message || JSON.stringify(errBody);
        } catch (e) {
          try { errText = await res.text(); } catch (e) {}
        }
        throw new Error(errText);
      }
      await fetchPacientes();
      setForm({ nombre: '', apellido: '', fecha_nacimiento: '', edad: '', dui: '', telefono: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id_paciente);
    setForm({ nombre: p.nombre, apellido: p.apellido, fecha_nacimiento: p.fecha_nacimiento ? p.fecha_nacimiento.split('T')[0] : '', edad: p.fecha_nacimiento ? '' : (p.edad ?? ''), dui: p.dui ?? '', telefono: p.telefono });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    setError(null);
    try {
      const body = { ...form };
      if (!body.fecha_nacimiento) {
        if (body.edad === '' || body.edad === null || typeof body.edad === 'undefined') {
          delete body.edad;
        } else {
          body.edad = Number(body.edad);
        }
      } else {
        delete body.edad;
      }
      // Si la fecha de nacimiento indica menor de 18, no enviamos DUI
      if (body.dui === '') delete body.dui;
      // calcular edad local a partir de fecha o edad enviada para decidir DUI
      let edadLocal = null;
      if (body.fecha_nacimiento) {
        const parts = body.fecha_nacimiento.split('-');
        if (parts.length === 3) {
          const y = Number(parts[0]);
          const m = Number(parts[1]) - 1;
          const d = Number(parts[2]);
          const fecha = new Date(y, m, d);
          const hoy = new Date();
          let calc = hoy.getFullYear() - fecha.getFullYear();
          const mm = hoy.getMonth() - fecha.getMonth();
          if (mm < 0 || (mm === 0 && hoy.getDate() < fecha.getDate())) calc--;
          edadLocal = calc;
        }
      } else if (typeof body.edad !== 'undefined') {
        edadLocal = Number(body.edad);
      }
      if (edadLocal !== null && edadLocal < 18) {
        delete body.dui;
      }
      if (body.fecha_nacimiento === '') delete body.fecha_nacimiento;
      const res = await fetch(`http://localhost:5000/api/pacientes/${editingId}`, { method: 'PUT', headers, body: JSON.stringify(body) });
      if (!res.ok) {
        let errText = 'Error al actualizar paciente';
        try {
          const errBody = await res.json();
          errText = errBody.message || JSON.stringify(errBody);
        } catch (e) {
          try { errText = await res.text(); } catch (e) {}
        }
        throw new Error(errText);
      }
      setEditingId(null);
      setForm({ nombre: '', apellido: '', fecha_nacimiento: '', edad: '', dui: '', telefono: '' });
      await fetchPacientes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar paciente?')) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/pacientes/${id}`, { method: 'DELETE', headers });
      if (!res.ok) {
        let errText = 'Error al eliminar paciente';
        try {
          const errBody = await res.json();
          errText = errBody.message || JSON.stringify(errBody);
        } catch (e) {
          try { errText = await res.text(); } catch (e) {}
        }
        throw new Error(errText);
      }
      await fetchPacientes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h3>Pacientes</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <div className="mb-2">
              <label>Nombre</label>
              <input name="nombre" className="form-control" value={form.nombre} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label>Apellido</label>
              <input name="apellido" className="form-control" value={form.apellido} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label>Fecha nacimiento</label>
              <input name="fecha_nacimiento" type="date" className="form-control" value={form.fecha_nacimiento} onChange={(e) => {
                // Cuando se ingresa fecha de nacimiento, limpiamos el campo edad (backend calculará)
                const val = e.target.value;
                setForm(f => ({ ...f, fecha_nacimiento: val, edad: val ? '' : f.edad }));
              }} />
            </div>
            {/* Si no hay fecha de nacimiento mostramos campo Edad; si hay fecha, backend calculará y mostramos vacío */}
            {!form.fecha_nacimiento && (
              <div className="mb-2">
                <label>Edad</label>
                <input name="edad" type="number" className="form-control" value={form.edad} onChange={handleChange} />
              </div>
            )}

            {/* Mostrar/ocultar DUI: si tenemos edad (ya calculada o ingresada) y es menor a 18, no pedir DUI */}
            {(() => {
              // calcular edad localmente cuando se pueda
              let edadLocal = null;
              if (form.fecha_nacimiento) {
                // no calculamos edad completa aquí; asumimos que backend lo hará, pero podemos derivar aproximación local
                const d = form.fecha_nacimiento;
                if (d) {
                  const parts = d.split('-');
                  if (parts.length === 3) {
                    const calc = new Date();
                    const y = Number(parts[0]);
                    const m = Number(parts[1]) - 1;
                    const day = Number(parts[2]);
                    const fecha = new Date(y, m, day);
                    let edadTmp = calc.getFullYear() - fecha.getFullYear();
                    const mm = calc.getMonth() - fecha.getMonth();
                    if (mm < 0 || (mm === 0 && calc.getDate() < fecha.getDate())) edadTmp--;
                    edadLocal = edadTmp;
                  }
                }
              } else if (form.edad) {
                edadLocal = Number(form.edad);
              }

              const esMenor = (edadLocal !== null && edadLocal < 18);

              // Si la edad local es menor de 18, ocultamos DUI
              if (esMenor) return null;

              // Si no es menor, mostramos DUI (opcional si fecha_nacimiento existe)
              return (
                <div className="mb-2">
                  <label>{form.fecha_nacimiento ? 'DUI (opcional)' : 'DUI'}</label>
                  <input name="dui" className="form-control" value={form.dui} onChange={handleChange} />
                </div>
              );
            })()}
            <div className="mb-2">
              <label>Teléfono</label>
              <input name="telefono" className="form-control" value={form.telefono} onChange={handleChange} />
            </div>
            <button className="btn btn-primary me-2" type="submit" disabled={loading}>{editingId ? 'Actualizar' : 'Crear'}</button>
            {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setForm({ nombre: '', apellido: '', fecha_nacimiento: '', edad: '', dui: '', telefono: '' }); }}>Cancelar</button>}
          </form>
        </div>
        <div className="col-md-6">
          {loading ? <p>Cargando...</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Edad</th>
                  <th>Fecha Nac.</th>
                  <th>DUI</th>
                  <th>Tel</th>
                  <th>Fecha Registro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map(p => (
                  <tr key={p.id_paciente}>
                    <td>{p.id_paciente}</td>
                    <td>{p.nombre}</td>
                    <td>{p.apellido}</td>
                    <td>{(p.edad || p.edad === 0) ? p.edad : '-'}</td>
                    <td>{p.fecha_nacimiento ? formatDateDDMMYYYY(p.fecha_nacimiento) : '-'}</td>
                    <td>{p.dui || '-'}</td>
                    <td>{p.telefono}</td>
                    <td>{p.fecha_registro ? formatDateDDMMYYYY(p.fecha_registro) : '-'}</td>
                    <td>{p.estado}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(p)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id_paciente)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
